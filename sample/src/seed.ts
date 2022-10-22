import { TypeOrmModule } from "@nestjs/typeorm";
import { createClassSeeders, seeder } from "nestjs-class-seeder";
import { Duck } from "./duck.entity";

const entities = [Duck]

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './ducks.db',
      entities
    }),
    TypeOrmModule.forFeature(entities),
  ],
}).run([
  ...createClassSeeders(entities)
]);
