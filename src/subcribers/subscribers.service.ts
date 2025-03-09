import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}
  async create(createsubscriberDto: CreateSubscriberDto, user: IUser) {
    const { name, email, skills } = createsubscriberDto;
    const existsubscriber = await this.subscriberModel.findOne({ email });
    if (existsubscriber) {
      throw new BadGatewayException(
        `Email ${email} already exist on system !.`,
      );
    }
    const newsubscriber = await this.subscriberModel.create({
      name,
      email,
      skills,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: newsubscriber._id,
      createdAt: newsubscriber.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subscriberModel
      .find(filter)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found subscriber with id=${id}`);
    }
    return await this.subscriberModel.findById(id);
  }

  async update(updatesubscriberDto: UpdateSubscriberDto, user: IUser) {
    return await this.subscriberModel.updateOne(
      { email: user.email },
      {
        ...updatesubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { upsert: true }, //(upsert: update/insert) if record doesn't exist: create, if exist: udpate
    );
  }

  async getSkills(user: IUser) {
    const { email } = user;
    return await this.subscriberModel.findOne({ email }, { skills: 1 });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Not found subscriber with id=${id}`);
    }
    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.subscriberModel.softDelete({ _id: id });
  }
}
