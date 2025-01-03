import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';

@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itineraryService.createItinerary(createItineraryDto);
  }

  @Get()
  findAll() {
    return this.itineraryService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itineraryService.updateItinerary(id, updateItineraryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.itineraryService.deleteItinerary(id);
  }
}
