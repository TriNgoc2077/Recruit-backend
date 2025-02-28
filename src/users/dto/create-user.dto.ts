import { IsEmail, IsNotEmpty } from 'class-validator';
//data transfer object
export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: 'Email is invalid !',
    },
  )
  @IsNotEmpty({
    message: 'Email must not be empty !',
  })
  email: string;
  @IsNotEmpty()
  password: string;

  name: string;
  address: string;
}
