import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { Trip } from './entities/trip.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Trip, User])],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}
