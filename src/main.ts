import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import ms, { StringValue } from 'ms';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());
  //config cookie
  app.use(cookieParser());
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

  //config cors
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true,
  });

  //config versioning
  app.setGlobalPrefix('api'); //api/v
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
