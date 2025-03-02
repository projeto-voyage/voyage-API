import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  singIn(@Body() createAuthDto: CreateAuthDto) {
    if (!createAuthDto.email) {
      throw new Error('Email é obrigatório');
    }
    if (!createAuthDto.password) {
      throw new Error('Senha é obrigatória');
    }

    return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    console.log('Redirecting to Google...');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    if (!req.user) {
      throw new Error('Usuário não autenticado');
    }  

    if (!req.user || Object.keys(req.user).length === 0) {
      throw new Error('Usuário inválido');
    }

    return {
      message: 'Login bem-sucedido!',
      user: req.user,
    };
}
}