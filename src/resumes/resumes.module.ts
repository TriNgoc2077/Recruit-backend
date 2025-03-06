import { Module } from '@nestjs/common';
import { ResumesService } from '../resumes/resumes.service';
import { ResumesController } from './resumes.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas/resume.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
