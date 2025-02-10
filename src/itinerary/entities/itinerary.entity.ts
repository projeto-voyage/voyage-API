import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('itineraries')
export class Itinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destination: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  totalCost: number;

  @Column()
  totalDays: number;

  @Column('json', { nullable: false }) 
  content: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
