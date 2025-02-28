import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  handleHomePage() {
    const message = this.appService.getHello();
    console.log(this.configService.get<string>('PORT'));
    return {
      message: message,
    };
    // return "this.appService.getHello()";
  }
}
