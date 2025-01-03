import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Itinerary } from './entities/itinerary.entity';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { Trip } from 'src/trip/entities/trip.entity';

@Injectable()
export class ItineraryService {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async createItinerary(
    createItineraryDto: CreateItineraryDto,
  ): Promise<Itinerary> {
    const trip = await this.getTripDetails(createItineraryDto);

    const itinerary = this.itineraryRepository.create({
      ...createItineraryDto,
      trip,
    });
    return this.itineraryRepository.save(itinerary);
  }

  async findAll(): Promise<Itinerary[]> {
    return this.itineraryRepository.find({ relations: ['trip'] });
  }

  async findById(id: string): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.findOne({
      where: { id },
      relations: ['trip'],
    });
    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }
    return itinerary;
  }

  async updateItinerary(
    id: string,
    updateItineraryDto: UpdateItineraryDto,
  ): Promise<Itinerary> {
    const itinerary = await this.findById(id);
    Object.assign(itinerary, updateItineraryDto);
    return this.itineraryRepository.save(itinerary);
  }

  async deleteItinerary(id: string): Promise<void> {
    const result = await this.itineraryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }
  }

  private async getTripDetails(createItineraryDto: CreateItineraryDto) {
    const trip = await this.tripRepository.findOne({
      where: { id: createItineraryDto.tripId },
    });

    if (!trip) {
      throw new NotFoundException(
        `Trip with ID ${createItineraryDto.tripId} not found`,
      );
    }
    return trip;
  }
}
