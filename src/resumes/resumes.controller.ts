import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import {
  CreateResumeDto,
  CreateUserCvDto,
} from '../resumes/dto/create-resume.dto';
import { UpdateResumeDto } from '../resumes/dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Post('by-user')
  @ResponseMessage('Get Resumes by User')
  ResumeByUser(@User() user: IUser) {
    return this.resumesService.getResumeByUser(user);
  }

  @Get()
  @ResponseMessage('Get List Resume')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Get a resume')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Change status a resume')
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a resume')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
