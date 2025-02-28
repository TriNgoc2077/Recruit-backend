import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  providers: [UsersModule, PassportModule, AuthService, LocalStrategy],
  imports: [UsersModule],
})
export class AuthModule {}
