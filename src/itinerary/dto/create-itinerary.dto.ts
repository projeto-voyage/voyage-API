import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  destination: string;

  @IsString()
  activities: string; 

  @IsNumber()
  totalCost: number;

  @IsString()
  @IsUUID()
  tripId: string; 
}