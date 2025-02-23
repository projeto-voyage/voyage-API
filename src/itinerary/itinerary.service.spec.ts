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

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((itinerary) => ({
      id: '1',
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
  });
});
