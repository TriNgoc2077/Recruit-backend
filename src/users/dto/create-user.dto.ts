import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty({ message: 'Id must not be empty !' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsEmail({}, { message: 'Email is invalid !' })
  @IsNotEmpty({ message: 'Email must not be empty !' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty !' })
  password: string;

  @IsNotEmpty({ message: 'Age must not be empty !' })
  age: number;

  gender: number;

  address: number;

  @IsNotEmpty({ message: 'Role must not be empty !' })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsEmail({}, { message: 'Email is invalid !' })
  @IsNotEmpty({ message: 'Email must not be empty !' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty !' })
  password: string;

  @IsNotEmpty({ message: 'Age must not be empty !' })
  age: number;

  gender: number;

  address: number;

  // @IsNotEmpty({ message: 'Role must not be empty !' })
  // role: string = 'USER';

  // @IsNotEmptyObject()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => Company)
  // company: Company;
}
