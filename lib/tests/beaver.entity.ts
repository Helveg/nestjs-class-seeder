import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Duck } from "./duck.entity";
import { SeedRelation } from "../index";

@Entity()
export class Beaver {
  @PrimaryGeneratedColumn()
  id: number;

  // Pick a random Duck
  @SeedRelation(() => Duck)
  @ManyToOne(() => Duck, { onDelete: "SET NULL" })
  reallyHatesThisOne: Duck;

  // Pick all Ducks with less than 11350 feathers
  @SeedRelation(() => Duck, { feathers: { $lt: 11350 } }, { many: true })
  @ManyToMany(() => Duck, { onDelete: "SET NULL" })
  @JoinTable()
  theseAreOk: Duck[];

  // Pick the n-th Duck for the n-th Beaver
  @SeedRelation(() => Duck, (ctx, entities) => entities[ctx.currentIndex])
  @OneToOne(() => Duck, { onDelete: "SET NULL" })
  @JoinColumn()
  crossSpeciesTwin: Duck;

  // Pick another Beaver
  @SeedRelation(() => Beaver)
  @ManyToOne(() => Beaver, { onDelete: "SET NULL" })
  loves: Beaver;
}
