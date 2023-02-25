import { Faker } from "@faker-js/faker";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Beaver } from "./beaver.entity";
import { Seed, SeedEnum, SeederContext, SeedRelation } from "../index";

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

  @Seed((faker: Faker, ctx: SeederContext) =>
    faker.datatype.number({ min: 11300, max: 11400 })
  )
  @Column()
  feathers: number;

  @SeedRelation(() => Duck, [1, 2, 3])
  @ManyToMany(() => Duck, { onDelete: "SET NULL" })
  @JoinTable()
  friends: Duck[];

  @SeedRelation(() => Beaver)
  @ManyToOne(() => Beaver, { onDelete: "SET NULL" })
  alsoHates: Beaver;
}
