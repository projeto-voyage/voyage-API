import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  async createItinerary(@Body() createItineraryDto: CreateItineraryDto) {
    const { destination, totalDays, totalCost } = createItineraryDto;
    return this.itineraryService.create(destination, totalDays, totalCost);
  }

  @Get(':id')
  async getItinerary(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }

  @Get(':id/content')
  async getContent(@Param('id') id: string): Promise<string> {
    return this.itineraryService.getItineraryContent(id);
  }

  @Put(':id')
  async updateItinerary(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itineraryService.updateItinerary(id, updateItineraryDto);
  }

  @Delete(':id')
  async deleteItinerary(@Param('id') id: string) {
    await this.itineraryService.deleteItinerary(id);
    return { message: 'Itinerário removido com sucesso' };
  }
}
