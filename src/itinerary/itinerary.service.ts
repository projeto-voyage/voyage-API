import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Itinerary } from './entities/itinerary.entity';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { GeminiService } from 'src/gemini/gemini.service';
import * as fs from 'fs';
import * as path from 'path';

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

    // Criar diretório se não existir
    const dirPath = path.join(__dirname, '../../itineraries');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Nome do arquivo (UUID)
    const fileName = `${crypto.randomUUID()}.txt`;
    const filePath = path.join(dirPath, fileName);

    // Salvar conteúdo no arquivo
    fs.writeFileSync(filePath, content);

    const itinerary = this.itineraryRepository.create({
      destination,
      totalDays,
      totalCost,
      filePath, // Armazena apenas o caminho
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
    if (!fs.existsSync(itinerary.filePath)) {
      throw new NotFoundException('Arquivo de roteiro não encontrado.');
    }

    return fs.readFileSync(itinerary.filePath, 'utf8');
  }
}
