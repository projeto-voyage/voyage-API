import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const isCorsEnabled = configService.get<boolean>('CORS_ENABLED');
  if (isCorsEnabled) {
    app.enableCors();
  } else {
    console.log('CORS disabled');
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = configService.get<number>('APP_PORT');
  await app.listen(port);
}
bootstrap();
