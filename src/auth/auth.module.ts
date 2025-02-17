import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { EnvModule } from 'src/env/env.module';
import { JwtConfModule } from './jwt-conf/jwt-conf.module';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [UsersModule, PassportModule, EnvModule, JwtConfModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
