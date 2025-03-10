import { IsString, IsNumber, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItineraryDto {
  @ApiProperty({ example: 'Paris', description: 'Destination of the trip' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: 5, description: 'Total number of days for the trip' })
  @IsInt()
  @IsNotEmpty()
  totalDays: number; 

  @ApiProperty({ example: 1500.50, description: 'Total estimated cost for the trip' })
  @IsNumber()
  @IsNotEmpty()
  totalCost: number; 
}