import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './app-config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  setCorsPolicy();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = configService.getPort;
  await app.listen(port);

  function setCorsPolicy() {
    const isCorsEnabled = configService.isCorsEnabled;
    if (isCorsEnabled) {
      app.enableCors();
    } else {
      console.log('CORS disabled');
    }
  }
}
bootstrap();
