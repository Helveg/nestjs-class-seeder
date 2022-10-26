import { SeedRelation } from 'nestjs-class-seeder';
import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Duck } from './duck.entity';

@Entity()
export class Beaver {
  @PrimaryGeneratedColumn()
  id: number;

  @SeedRelation(() => Duck)
  @ManyToOne(() => Duck, {onDelete: 'SET NULL'})
  reallyHatesThisOne: Duck;

  @SeedRelation(() => Duck, {feathers: {$lt: 11350}}, {many: true})
  @ManyToMany(() => Duck, {onDelete: 'SET NULL'})
  @JoinTable()
  theseAreOk: Duck[];

  @SeedRelation(() => Beaver)
  @ManyToOne(() => Beaver, {onDelete: 'SET NULL'})
  loves: Beaver;
}
