import { Itinerary } from 'src/itinerary/entities/itinerary.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  destination: string;

  @Column()
  duration: number;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.trips)
  user: User;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.trip)
  itineraries: Itinerary[];
}
