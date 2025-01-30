import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/env.service';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      useFactory: async (configService: EnvService) => ({
        type: 'postgres',
        host: configService.getDbHost,
        port: configService.getDbPort,
        username: configService.getDbUsername,
        password: configService.getDbPassword,
        database: configService.getDbName,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [EnvService],
    }),
  ],
})
export class DatabaseModule {}
