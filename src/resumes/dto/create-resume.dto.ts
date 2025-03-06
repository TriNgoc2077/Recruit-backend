import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsEmail({}, { message: 'Email is invalid !' })
  @IsNotEmpty({ message: 'Email must not be empty !' })
  email: string;

  @IsNotEmpty({ message: 'UserId must not be empty !' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Url must not be empty !' })
  url: string;

  @IsNotEmpty({ message: 'Status must not be empty !' })
  status: string;

  @IsNotEmpty({ message: 'company must not be empty !' })
  company: mongoose.Schema.Types.ObjectId;
  history: Array<{
    status: string;
    updatedAt: Date;
    updatedBy: {
      _id: mongoose.Schema.Types.ObjectId;
      email: string;
    };
  }>;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Url must not be empty !' })
  url: string;

  @IsNotEmpty({ message: 'company must not be empty !' })
  @IsMongoId({ message: 'company is a mongoose id !' })
  company: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'job must not be empty !' })
  @IsMongoId({ message: 'job is a mongoose id !' })
  job: mongoose.Schema.Types.ObjectId;
}
