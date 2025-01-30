import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/env.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      useFactory: async (configService: EnvService) => ({
        secret: configService.getJwtSecret,
        signOptions: { expiresIn: '60s' },
      }),

      inject: [EnvService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfModule {}
