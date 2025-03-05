import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: 'Id must not be empty !' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsNotEmpty({ message: 'Skill must not be empty !' })
  @IsArray({ message: 'Skill is a array !' })
  //"each" -> class-validator will run the validation on each item of the arr
  @IsString({ each: true, message: 'Skill format is string !' })
  skills: Array<string>;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  location: string;

  salary: number;

  @Min(1, { message: 'The smallest quantity is 1' })
  quantity: number;

  @IsNotEmpty({ message: 'Level must not be empty !' })
  level: string;

  description: string;
  @IsNotEmpty({ message: 'startDate must not be empty !' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate format is date !' })
  startDate: Date;

  @IsNotEmpty({ message: 'endDate must not be empty !' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'endDate format is date !' })
  endDate: Date;

  isActive: Boolean;
}
