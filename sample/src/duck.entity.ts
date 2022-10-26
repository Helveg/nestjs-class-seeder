import { Faker } from '@faker-js/faker';
import { Seed, SeedEnum, SeedRelation } from 'nestjs-class-seeder';
import { SeederContext } from 'nestjs-class-seeder/dist/interfaces/context.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Beaver } from './beaver.entity';

enum BillColors {
  Normal = "brownish yellow",
  Abberant = "yellowish brown",
}

@Entity()
export class Duck {
  @PrimaryGeneratedColumn()
  id: number;

  @Seed(2)
  @Column()
  legs: number;

  @SeedEnum(BillColors)
  billColor: string;

  @Seed((faker: Faker, ctx: SeederContext) => faker.datatype.number({min: 11300, max: 11400}))
  @Column()
  feathers: number;

  @SeedRelation(() => Beaver)
  @ManyToOne(() => Beaver, {onDelete: 'SET NULL'})
  alsoHates: Beaver
}
