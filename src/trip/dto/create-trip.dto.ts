import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateTripDto {
  @IsString()
  destination: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  budget: number;

  @IsString()
  @IsUUID()
  userId: string;
}