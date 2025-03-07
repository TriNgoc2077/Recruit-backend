import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  apiPath: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  module: string;
}
