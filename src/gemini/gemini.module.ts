import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [AppConfigModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
