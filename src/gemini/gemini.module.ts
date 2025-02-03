import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { EnvModule } from 'src/env/env.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [EnvModule, HttpModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
