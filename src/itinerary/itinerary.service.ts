import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { GeminiService } from 'src/gemini/gemini.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ItineraryService {
  private readonly storageDir = path.join(process.cwd(), 'storage/itineraries');

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

    // Criar diretório se não existir
    await fs.mkdir(this.storageDir, { recursive: true });

    // Nome do arquivo (UUID)
    const fileName = `${randomUUID()}.txt`;
    const filePath = path.join(this.storageDir, fileName);

    // Salvar conteúdo no arquivo
    await fs.writeFile(filePath, content, 'utf8');

    const itinerary = this.itineraryRepository.create({
      destination,
      totalDays,
      totalCost,
      filePath, 
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

  async getItineraryContent(id: string): Promise<string> {
    const itinerary = await this.findById(id);

    // Verifica se o arquivo existe antes de ler
    try {
      return await fs.readFile(itinerary.filePath, 'utf8');
    } catch (error) {
      throw new NotFoundException('Arquivo de roteiro não encontrado.');
    }
  }
}
