import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ItineraryService {
  constructor(
    @InjectRepository(Itinerary)
    private readonly itineraryRepository: Repository<Itinerary>,
    private readonly geminiService: GeminiService,
  ) {}

  async create(
    destination: string,
    totalDays: number,
    totalCost: number,
  ): Promise<Itinerary> {

    if (!destination) {
      throw new Error('Destination cannot be empty');
    }
    if (totalDays < 1) {
      throw new Error('Total days must be at least 1');
    }
    if (totalCost < 0) {
      throw new Error('Total cost must be a positive value');
    }

    const prompt = `Crie um roteiro detalhado de ${totalDays} dias para ${destination}. 
    Inclua sugestões de passeios, alimentação e transporte com um orçamento de R$ ${totalCost}.`;

    const content = {
      destination,
      totalDays,
      totalCost,
      details: await this.geminiService.genarateItinerary(prompt),
    };

    const itinerary = this.itineraryRepository.create({
      destination,
      totalDays,
      totalCost,
      content,  
    });

    return this.itineraryRepository.save(itinerary);
  }

  async findById(id: string): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.findOne({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }

    return itinerary;
  }
}
