import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsNotEmpty({ message: 'Name must not be empty !' })
  @IsEmail({}, { message: 'Email is not in correct format !' })
  email: string;

  @IsNotEmpty({ message: 'Name must not be empty !' })
  @IsArray({ message: 'Skills have array format !' })
  @IsString({ each: true })
  skills: Array<string>;
}
