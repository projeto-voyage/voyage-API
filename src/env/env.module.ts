import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        CORS_ENABLED: Joi.boolean().default(false),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required().default('root'),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        BCRYPT_SALT_ROUNDS: Joi.number().required(),
        GEMINI_API_KEY: Joi.string().required(),
      }),
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
