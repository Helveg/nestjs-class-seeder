import { SeedRelation } from 'nestjs-class-seeder';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Duck } from './duck.entity';

@Entity()
export class Beaver {
  @PrimaryGeneratedColumn()
  id: number;

  @SeedRelation(() => Duck)
  @ManyToOne(() => Duck, {onDelete: 'SET NULL'})
  hates: Duck;
}
