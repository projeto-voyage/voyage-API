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
    const prompt = this.generatePrompt(destination, totalDays, totalCost);
    const content = await this.geminiService.genarateItinerary(prompt);
    const filePath = await this.saveItineraryFile(content);

    const itinerary = this.itineraryRepository.create({
      destination,
      totalDays,
      totalCost,
      filePath,
    });

    return this.itineraryRepository.save(itinerary);
  }

  async findById(id: string): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.findOne({ where: { id } });

    if (!itinerary) {
      throw new NotFoundException(`Itinerário com ID ${id} não encontrado.`);
    }

    return itinerary;
  }

  async getItineraryContent(id: string): Promise<string> {
    const itinerary = await this.findById(id);
    return this.readItineraryFile(itinerary.filePath);
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
    const itinerary = await this.findById(id);

    try {
      await fs.unlink(itinerary.filePath); // Remove o arquivo associado
    } catch (error) {
      console.warn(`Erro ao excluir arquivo ${itinerary.filePath}:`, error);
    }

    await this.itineraryRepository.delete(id);
  }

  private generatePrompt(
    destination: string,
    totalDays: number,
    totalCost: number,
  ): string {
    return `Crie um roteiro detalhado de ${totalDays} dias para ${destination}. 
    Inclua sugestões de passeios, alimentação e transporte com um orçamento de R$ ${totalCost}.`;
  }

  private async saveItineraryFile(content: string): Promise<string> {
    await fs.mkdir(this.storageDir, { recursive: true });

    const fileName = `${randomUUID()}.txt`;
    const filePath = path.join(this.storageDir, fileName);

    await fs.writeFile(filePath, content, 'utf8');
    return filePath;
  }

  private async readItineraryFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      throw new NotFoundException('Arquivo de roteiro não encontrado.');
    }
  }
}
