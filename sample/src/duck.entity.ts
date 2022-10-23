import { Faker } from '@faker-js/faker';
import { Seed } from 'nestjs-class-seeder';
import { SeederContext } from 'nestjs-class-seeder/dist/interfaces/context.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Duck {
  @PrimaryGeneratedColumn()
  id: number;

  @Seed(2)
  @Column()
  legs: number;

  @Seed((faker) => faker.helpers.arrayElement(["brownish yellow", "yellowish brown"]))
  billColor: string;

  @Seed((faker: Faker, ctx: SeederContext) => faker.datatype.number({min: 11300, max: 11400}))
  @Column()
  feathers: number;
}
