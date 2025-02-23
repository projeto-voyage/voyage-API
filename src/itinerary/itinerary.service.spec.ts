import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryService } from './itinerary.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { GeminiService } from '../gemini/gemini.service';
import { NotFoundException } from '@nestjs/common';

describe('ItineraryService', () => {
  let service: ItineraryService;
  let repository: Repository<Itinerary>;
  let geminiService: GeminiService;

  let idCounter = 1;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((itinerary) => ({
      id: (idCounter++).toString(),
      ...itinerary,
    })),
    findOne: jest.fn().mockImplementation(({ where: { id } }) =>
      id === '1'
        ? { id: '1', destination: 'Paris', totalDays: 5, totalCost: 1500 }
        : null,
    ),
  };

  const mockGeminiService = {
    genarateItinerary: jest.fn().mockResolvedValue('Detalhes do itinerário gerados pela IA.'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItineraryService,
        {
          provide: getRepositoryToken(Itinerary),
          useValue: mockRepository,
        },
        {
          provide: GeminiService,
          useValue: mockGeminiService,
        },
      ],
    }).compile();

    service = module.get<ItineraryService>(ItineraryService);
    repository = module.get<Repository<Itinerary>>(getRepositoryToken(Itinerary));
    geminiService = module.get<GeminiService>(GeminiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an itinerary', async () => {
      const result = await service.create('New York', 7, 2000);

      expect(geminiService.genarateItinerary).toHaveBeenCalledWith(
        expect.stringContaining('New York'),
      );

      expect(repository.create).toHaveBeenCalledWith({
        destination: 'New York',
        totalDays: 7,
        totalCost: 2000,
        content: {
          destination: 'New York',
          totalDays: 7,
          totalCost: 2000,
          details: 'Detalhes do itinerário gerados pela IA.',
        },
      });

      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        destination: 'New York',
        totalDays: 7,
        totalCost: 2000,
        content: {
          destination: 'New York',
          totalDays: 7,
          totalCost: 2000,
          details: 'Detalhes do itinerário gerados pela IA.',
        },
      });
    });

    it('should throw an error if destination is empty', async () => {
      await expect(service.create('', 7, 2000)).rejects.toThrow(
        new Error('Destination cannot be empty'),
      );
    });

    it('should throw an error if totalDays is less than 1', async () => {
      await expect(service.create('New York', 0, 2000)).rejects.toThrow(
        new Error('Total days must be at least 1'),
      );
    });

    it('should throw an error if totalCost is less than 0', async () => {
      await expect(service.create('New York', 7, -1)).rejects.toThrow(
        new Error('Total cost must be a positive value'),
      );
    });

    it('should include generated details in the itinerary content', async () => {
      const result = await service.create('Tokyo', 5, 3000);
  
      expect(result.content.details).toEqual('Detalhes do itinerário gerados pela IA.');
    });

    it('should handle multiple itinerary creations', async () => {
      const firstItinerary = await service.create('London', 4, 2500);
      const secondItinerary = await service.create('Berlin', 3, 1800);
  
      expect(firstItinerary).toHaveProperty('id');
      expect(secondItinerary).toHaveProperty('id');
      expect(firstItinerary.destination).toEqual('London');
      expect(secondItinerary.destination).toEqual('Berlin');
    });

    it('should handle duplicate itinerary creation gracefully', async () => {
      await service.create('New York', 7, 2000);
      const duplicateItinerary = await service.create('New York', 7, 2000);
  
      expect(duplicateItinerary).toHaveProperty('id');
      expect(duplicateItinerary.destination).toEqual('New York');
      expect(duplicateItinerary.totalDays).toEqual(7);
      expect(duplicateItinerary.totalCost).toEqual(2000);
    });

    it('should call the repository save method once', async () => {
      await service.create('New York', 7, 2000);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if GeminiService fails to generate itinerary', async () => {
      mockGeminiService.genarateItinerary.mockRejectedValue(new Error('Failed to generate itinerary'));
  
      await expect(service.create('New York', 7, 2000)).rejects.toThrow(
        new Error('Failed to generate itinerary'),
      );
    });

    it('should create multiple itineraries correctly', async () => {
      mockGeminiService.genarateItinerary.mockResolvedValue('Detalhes do itinerário gerados pela IA.');
    
      const itinerary1 = await service.create('Tokyo', 5, 3000);
      const itinerary2 = await service.create('Paris', 3, 1500);
    
      expect(itinerary1).toHaveProperty('id');
      expect(itinerary2).toHaveProperty('id');
      expect(itinerary1.destination).toEqual('Tokyo');
      expect(itinerary2.destination).toEqual('Paris');
    });
  });

  describe('findById', () => {
    it('should return an itinerary when found', async () => {
      const result = await service.findById('1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual({
        id: '1',
        destination: 'Paris',
        totalDays: 5,
        totalCost: 1500,
      });
    });

    it('should throw NotFoundException when itinerary is not found', async () => {
      await expect(service.findById('2')).rejects.toThrow(
        new NotFoundException('Itinerary with ID 2 not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
    });

    it('should throw NotFoundException when provided with an invalid ID format', async () => {
      await expect(service.findById('invalid-id')).rejects.toThrow(
        new NotFoundException('Itinerary with ID invalid-id not found'),
      );
    });

    it('should return the correct itinerary details', async () => {
      const result = await service.findById('1');
  
      expect(result).toEqual({
        id: '1',
        destination: 'Paris',
        totalDays: 5,
        totalCost: 1500,
      });
    });
  });
});
