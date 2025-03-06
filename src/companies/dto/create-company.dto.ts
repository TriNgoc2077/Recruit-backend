import { IsEmail, IsNotEmpty } from 'class-validator';
//data transfer object
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsNotEmpty({ message: 'Address must not be empty !' })
  address: string;

  @IsNotEmpty({ message: 'Description must not be empty !' })
  description: string;

  logo: string;
}
