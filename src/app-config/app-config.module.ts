import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfigService } from "./app-config.service";
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
                DB_DATABASE: Joi.string().required()
            })
        })
    ], 
    providers: [AppConfigService],
    exports: [AppConfigService]
})

export class AppConfigModule {}