import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  singIn(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  }
}
