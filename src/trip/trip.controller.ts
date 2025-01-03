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
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.createTrip(createTripDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tripService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.updateTrip(id, updateTripDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tripService.deleteTrip(id);
  }
}
