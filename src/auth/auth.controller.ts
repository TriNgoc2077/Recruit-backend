import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalStrategy)
  @Post('/login')
  @ResponseMessage('User login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  // @UseGuards(LocalStrategy)
  @Post('/register')
  @ResponseMessage('Resgister a new user !')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('/account')
  @ResponseMessage('Account User Infomation')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Get User by refresh token')
  handleRefreshToken(@Req() request: Request, @Res() response: Response) {
    const refresh_token = request.cookies['refresh_token'];

    return this.authService.processNewToken(refresh_token, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
