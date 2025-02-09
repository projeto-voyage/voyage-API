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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, description: 'Itinerary created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  async createItinerary(@Body() createItineraryDto: CreateItineraryDto) {
    const { destination, totalDays, totalCost } = createItineraryDto;
    return this.itineraryService.create(destination, totalDays, totalCost);
  }

  @ApiOperation({ summary: 'Get an itinerary by ID' })
  @ApiResponse({ status: 200, description: 'Itinerary found' })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Get(':id')
  async getItinerary(@Param('id') id: string) {
    return this.itineraryService.findById(id);
  }

  @ApiOperation({ summary: 'Get itinerary content' })
  @ApiResponse({ status: 200, description: 'Content retrieved' })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Get(':id/content')
  async getContent(@Param('id') id: string): Promise<string> {
    return this.itineraryService.getItineraryContent(id);
  }

  @ApiOperation({ summary: 'Update an itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Put(':id')
  async updateItinerary(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itineraryService.updateItinerary(id, updateItineraryDto);
  }

  @ApiOperation({ summary: 'Delete an itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary deleted successfully' })
  @ApiResponse({ status: 404, description: 'Itinerary not found' })
  @Delete(':id')
  async deleteItinerary(@Param('id') id: string) {
    await this.itineraryService.deleteItinerary(id);
    return { message: 'Itinerário removido com sucesso' };
  }
}
