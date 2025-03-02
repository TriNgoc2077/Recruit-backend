import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync, hash } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from './users.interface';
import { User as UserDecorator } from 'src/decorator/customize';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async create(createUserDto: CreateUserDto, @UserDecorator() user: IUser) {
    const { name, email, password, age, gender, address, role, company } =
      createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        'Email already exist. Please use another email',
      );
    }

    const hashPassword = this.getHashPassword(password);
    let newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;

    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        'Email already exist. Please use another email',
      );
    }
    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: 'USER',
    });
    return newRegister;
  }
  // async create(email: string, password: string, name: string) {
  // }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user !';
    }
    return this.userModel
      .findOne({
        _id: id,
      })
      .select('-password');
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }

  async update(updateUserDto: UpdateUserDto, @UserDecorator() user: IUser) {
    const idExist = await this.userModel.findOne({
      _id: updateUserDto._id,
    });
    if (!idExist) throw new BadRequestException('User not found !');

    const emailExist = await this.userModel.findOne({
      email: updateUserDto.email,
    });
    if (emailExist && emailExist.id !== idExist.id)
      throw new BadRequestException('Email already exist !');

    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id,
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, @UserDecorator() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not found user !';
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({
      _id: id,
    });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken,
      },
    );
  };

  getUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };
}
