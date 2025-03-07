import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose, { isValidObjectId } from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsMongoId({ each: true, message: 'each permission is mongo id' })
  @IsArray()
  permission: Array<mongoose.Schema.Types.ObjectId>;
}
