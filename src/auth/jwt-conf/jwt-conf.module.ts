import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AppConfigService } from 'src/app-config/app-config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        secret: config.getJwtSecret,
        signOptions: { expiresIn: '60s' },
      }),

      inject: [AppConfigService],
    }),
  ],
  exports: [JwtModule],
})

export class JwtConfModule {}
