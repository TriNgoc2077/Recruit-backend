import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import {
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage('Create a subscriber')
  create(
    @Body() createsubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.create(createsubscriberDto, user);
  }

  @Post('skills')
  @ResponseMessage("Get subscriber's skills")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Get()
  @ResponseMessage('Fetch subscribers with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetcch subscriber by id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Update a subscribers')
  update(
    @Param('id') id: string,
    @Body() updatesubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update(updatesubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subscriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
