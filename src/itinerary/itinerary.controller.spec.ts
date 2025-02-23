import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MultiAuthGuard } from 'src/auth/guards/multi-auth.guard';

describe('ItineraryController', () => {
  let controller: ItineraryController;
  let itineraryService: ItineraryService;

  const mockItineraryService = {
    create: jest.fn((destination, totalDays, totalCost) => ({
      id: '1',
      destination,
      totalDays,
      totalCost,
    })),
    findById: jest.fn((id) => ({
      id,
      destination: 'Paris',
      totalDays: 5,
      totalCost: 1500,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItineraryController],
      providers: [
        {
          provide: ItineraryService,
          useValue: mockItineraryService,
        },
      ],
    }).compile();

    controller = module.get<ItineraryController>(ItineraryController);
    itineraryService = module.get<ItineraryService>(ItineraryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createItinerary', () => {
    it('should create a new itinerary', async () => {
      const dto: CreateItineraryDto = {
        destination: 'New York',
        totalDays: 7,
        totalCost: 2000,
      };

      const result = await controller.createItinerary(dto);
      expect(result).toEqual({
        id: '1',
        ...dto,
      });

      expect(itineraryService.create).toHaveBeenCalledWith(
        dto.destination,
        dto.totalDays,
        dto.totalCost,
      );
    });
  });

  describe('getItinerary', () => {
    it('should return an itinerary by ID', async () => {
      const id = '1';
      const result = await controller.getItinerary(id);
      expect(result).toEqual({
        id: '1',
        destination: 'Paris',
        totalDays: 5,
        totalCost: 1500,
      });

      expect(itineraryService.findById).toHaveBeenCalledWith(id);
    });
  });
});
