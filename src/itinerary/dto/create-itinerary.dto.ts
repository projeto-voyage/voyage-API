import { IsString, IsNumber, IsUUID, IsOptional, IsInt } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  destination: string;

  @IsInt()
  totalDays: number; 

  @IsNumber()
  totalCost: number; 
}