import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { BadRequestException } from '@nestjs/common';

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

    // Limpar os mocks antes de cada teste
    jest.clearAllMocks();
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

    it('should throw an error if the destination is not provided', async () => {
      const dto: CreateItineraryDto = {
        destination: '',
        totalDays: 7,
        totalCost: 2000,
      };

      await expect(controller.createItinerary(dto)).rejects.toThrow(BadRequestException);
      expect(itineraryService.create).not.toHaveBeenCalled();
    });

    it('should throw an error if totalDays is less than 1', async () => {
      const dto: CreateItineraryDto = {
        destination: 'New York',
        totalDays: 0,
        totalCost: 2000,
      };
  
      await expect(controller.createItinerary(dto)).rejects.toThrow(BadRequestException);
      expect(itineraryService.create).not.toHaveBeenCalled();
    });
  
    it('should throw an error if totalCost is less than 1', async () => {
      const dto: CreateItineraryDto = {
        destination: 'New York',
        totalDays: 7,
        totalCost: 0,
      };
  
      await expect(controller.createItinerary(dto)).rejects.toThrow(BadRequestException);
      expect(itineraryService.create).not.toHaveBeenCalled();
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

    it('should throw an error if the itinerary does not exist', async () => {
      const id = '2';
      (itineraryService.findById as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Itinerary not found');
      });

      await expect(controller.getItinerary(id)).rejects.toThrow('Itinerary not found');
      expect(itineraryService.findById).toHaveBeenCalledWith(id);
    });

    it('should return an empty itinerary if no itinerary exists for the given ID', async () => {
      const id = '3';
      (itineraryService.findById as jest.Mock).mockReturnValueOnce(null);
  
      const result = await controller.getItinerary(id);
      expect(result).toBeNull(); 
      expect(itineraryService.findById).toHaveBeenCalledWith(id);
    });
  });
});

