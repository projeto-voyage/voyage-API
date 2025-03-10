import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EnvService } from './env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);

  setCorsPolicy();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Voyage API')
    .setDescription('Documentação da API do Voyage')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

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