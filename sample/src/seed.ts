import { TypeOrmModule } from "@nestjs/typeorm";
import { createClassSeeders, seeder } from "nestjs-class-seeder";
import { Beaver } from "./beaver.entity";
import { Duck } from "./duck.entity";

const entities = [Duck, Beaver]

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './ducks.db',
      synchronize: true,
      entities
    }),
    TypeOrmModule.forFeature(entities),
  ],
  debug: true,
}).run([
  ...createClassSeeders(entities)
]);
