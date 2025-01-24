import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { JwtConfModule } from './jwt-conf/jwt-conf.module';

@Module({
  imports: [UsersModule, PassportModule, AppConfigModule, JwtConfModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
