import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './entities/trip.entity';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async createTrip(createTripDto: CreateTripDto): Promise<Trip> {
    const trip = this.tripRepository.create(createTripDto);
    return this.tripRepository.save(trip);
  }

  async findAll(): Promise<Trip[]> {
    return this.tripRepository.find({ relations: ['user', 'itineraries'] });
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['user', 'itineraries'],
    });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  async updateTrip(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findById(id);
    Object.assign(trip, updateTripDto);
    return this.tripRepository.save(trip);
  }

  async deleteTrip(id: string): Promise<void> {
    const result = await this.tripRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
  }
}
