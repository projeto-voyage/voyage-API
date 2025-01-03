import { Trip } from 'src/trip/entities/trip.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('itineraries')
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destination: string;

  @Column('text', { default: '[]' }) 
  activities: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalCost: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Trip, (trip) => trip.itineraries, { onDelete: 'CASCADE' })
  @JoinColumn()
  trip: Trip;
}
