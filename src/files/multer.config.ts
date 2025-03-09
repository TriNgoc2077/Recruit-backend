import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  MulterModule,
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { fileLoader } from 'ejs';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };
  ensureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already exist');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          //Error
          //Requested location already exists, but it's not a ...
          break;
        case 'ENOTDIR':
          //Error:
          //the parent hierarchy contains a file with the same name as the
          //you're truying to create
          break;
        default:
          //some other error like permission denied
          console.log(error);
          break;
      }
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureExists(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          let extName = path.extname(file.originalname);
          let baseName = path.basename(file.originalname);
          let finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'pdf',
          'doc',
          'docx',
        ];
        const fileExtension = file.originalname
          .split('.')
          .pop()
          .toLocaleLowerCase();
        const isValidFileType = allowedFileTypes.includes(fileExtension);

        if (!isValidFileType) {
          cb(
            new HttpException(
              'Invalid file type',
              HttpStatus.UNPROCESSABLE_ENTITY,
            ),
            null,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 1, //1mb
      },
    };
  }
}
