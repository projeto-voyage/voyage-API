import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeminiService {
  private readonly geminiApiUrl: string;
  private readonly geminiApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: EnvService,
  ) {
    this.geminiApiUrl = this.configService.getGeminiApiUrl;
    this.geminiApiKey = this.configService.getGeminiApiKey;
  }

  async genarateItinerary(prompt: string): Promise<string> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
      );

      return (
        response.data.candidates[0]?.content?.parts[0]?.text ||
        'Nenhuma resposta gerada.'
      );
    } catch (error) {
      console.error(
        'Erro ao chamar Gemini API:',
        error.response?.data || error.message,
      );
      throw new Error('Erro ao gerar roteiro.');
    }
  }
}
