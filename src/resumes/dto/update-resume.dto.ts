import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import {
  IsArray,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import mongoose, { Schema } from 'mongoose';
import { Type } from 'class-transformer';

class UpdatedBy {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

class History {
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  updatedAt: Date;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UpdatedBy)
  updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => History)
  history?: History[];
}
