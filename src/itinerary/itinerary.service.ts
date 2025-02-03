import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { GeminiService } from 'src/gemini/gemini.service';
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
    const prompt = `Crie um roteiro detalhado de ${totalDays} dias para ${destination}. 
    Inclua sugestões de passeios, alimentação e transporte com um orçamento de R$ ${totalCost}.`;

    const content = await this.geminiService.genarateItinerary(prompt);

    const itinerary = this.itineraryRepository.create({
      destination,
      totalDays,
      totalCost,
      content,
    });

    return this.itineraryRepository.save(itinerary);
  }
  async findAll(): Promise<Itinerary[]> {
    return this.itineraryRepository.find();
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

  async updateItinerary(
    id: string,
    updateItineraryDto: UpdateItineraryDto,
  ): Promise<Itinerary> {
    const itinerary = await this.findById(id);
    Object.assign(itinerary, updateItineraryDto);
    return this.itineraryRepository.save(itinerary);
  }

  async deleteItinerary(id: string): Promise<void> {
    const result = await this.itineraryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Itinerary with ID ${id} not found`);
    }
  }
}
