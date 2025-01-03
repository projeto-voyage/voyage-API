import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { TripModule } from './trip/trip.module';
import { ItineraryModule } from './itinerary/itinerary.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    DatabaseModule,
    TripModule,
    ItineraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
