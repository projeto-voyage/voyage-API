import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createItinerary(@Body() createItineraryDto: CreateItineraryDto) {
    const { destination, totalDays, totalCost } = createItineraryDto;
    return this.itineraryService.create(destination, totalDays, totalCost);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getItinerary(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }
}
