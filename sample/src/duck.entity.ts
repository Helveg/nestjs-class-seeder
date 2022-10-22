import { Seed } from 'nestjs-class-seeder';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Duck {
  @PrimaryGeneratedColumn()
  id: number;

  @Seed(11309)
  @Column()
  feathers: number;
}
