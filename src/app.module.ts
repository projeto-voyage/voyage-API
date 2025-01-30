import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EnvModule } from './env/env.module';
import { DatabaseModule } from './database/database.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    ItineraryModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
