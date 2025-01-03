import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.getDbHost,
        port: configService.getDbPort,
        username: configService.getDbUsername,
        password: configService.getDbPassword,
        database: configService.getDbName,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class DatabaseModule {}
