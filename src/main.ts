import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import ms, { StringValue } from 'ms';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());

  // app.use(cookieParser());
  // //config session
  // app.use(
  //   session({
  //     secret: configService.get<string>('EXPRESS_SESSION_SECRET'),
  //     resave: true,
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: ms(configService.get<StringValue>('EXPRESS_SESSION_COOKIE')),
  //     },
  //     store: MongoStore.create({
  //       mongoUrl: configService.get<string>('MONGO_URL'),
  //     }),
  //   }),
  // );
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
