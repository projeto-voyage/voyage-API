import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultiAuthGuard } from '../auth/guards/multi-auth.guard';

@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(MultiAuthGuard)
  @Post()
  async createItinerary(@Body() createItineraryDto: CreateItineraryDto) {
    const { destination, totalDays, totalCost } = createItineraryDto;

    if (!destination || destination.trim() === '') {
      throw new BadRequestException('Destination is required');
    }

    if (totalDays < 1) {
      throw new BadRequestException('Total days must be at least 1');
    }
    if (totalCost < 1) {
      throw new BadRequestException('Total cost must be at least 1');
    }
    
    return this.itineraryService.create(destination, totalDays, totalCost);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getItinerary(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }
}
