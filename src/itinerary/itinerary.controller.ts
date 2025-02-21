import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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
          totalCost: 1500
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Itinerary created successfully',
    schema: {
      example: {
        id: 'abc123',
        destination: 'Paris',
        totalDays: 7,
        totalCost: 1500
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  async createItinerary(@Body() createItineraryDto: CreateItineraryDto): Promise<any> {
    return this.itineraryService.create(
      createItineraryDto.destination, 
      createItineraryDto.totalDays, 
      createItineraryDto.totalCost
    );
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
        totalCost: 1500
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Get(':id')
  async getItinerary(@Param('id') id: string): Promise<any> {
    return this.itineraryService.findById(id);
  }

  @ApiOperation({ summary: 'Get itinerary content' })
  @ApiResponse({ status: 200, description: 'Content retrieved', schema: { example: "Itinerary details..." } })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Get(':id/content')
  async getContent(@Param('id') id: string): Promise<string> {
    return this.itineraryService.getItineraryContent(id);
  }

  @ApiOperation({ summary: 'Update an itinerary' })
  @ApiBody({
    description: 'Updated itinerary details',
    type: UpdateItineraryDto,
    examples: {
      example1: {
        summary: 'Valid update',
        value: {
          destination: 'London',
          totalDays: 10,
          totalCost: 2000
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Itinerary updated successfully',
    schema: {
      example: {
        id: 'abc123',
        destination: 'London',
        totalDays: 10,
        totalCost: 2000
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Put(':id')
  async updateItinerary(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto
  ): Promise<any> {
    return this.itineraryService.updateItinerary(id, updateItineraryDto);
  }

  @ApiOperation({ summary: 'Delete an itinerary' })
  @ApiResponse({ 
    status: 200, 
    description: 'Itinerary deleted successfully',
    schema: { example: { message: 'Itinerário removido com sucesso' } }
  })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Delete(':id')
  async deleteItinerary(@Param('id') id: string): Promise<{ message: string }> {
    await this.itineraryService.deleteItinerary(id);
    return { message: 'Itinerário removido com sucesso' };
  }
}
