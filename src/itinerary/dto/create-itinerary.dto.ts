import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  destination: string;

  @IsString()
  activities: string; // JSON como string para atividades

  @IsNumber()
  totalCost: number;

  @IsUUID()
  tripId: string; // Relaciona o roteiro à viagem
}