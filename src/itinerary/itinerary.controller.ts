import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Itineraries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('itineraries')
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @ApiOperation({ summary: 'Create a new itinerary' })
  @ApiBody({
    description: 'Itinerary details',
    type: CreateItineraryDto,
    examples: {
      example1: {
        summary: 'Valid itinerary',
        value: {
          destination: 'Paris',
          totalDays: 7,
          totalCost: 1500,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Itinerary created successfully',
    schema: {
      example: {
        id: 'abc123',
        destination: 'Paris',
        totalDays: 7,
        totalCost: 1500,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UseGuards(JwtAuthGuard)
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

  @ApiOperation({ summary: 'Get an itinerary by ID' })
  @ApiResponse({
    status: 200,
    description: 'Itinerary found',
    schema: {
      example: {
        id: 'abc123',
        destination: 'Paris',
        totalDays: 7,
        totalCost: 1500,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getItinerary(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }
}
