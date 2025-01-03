import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { Trip } from 'src/trip/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Itinerary, Trip])],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
