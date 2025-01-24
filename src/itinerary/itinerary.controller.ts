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

@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itineraryService.createItinerary(createItineraryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.itineraryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itineraryService.updateItinerary(id, updateItineraryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.itineraryService.deleteItinerary(id);
  }
}
