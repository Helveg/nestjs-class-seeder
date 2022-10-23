import { TypeOrmModule } from "@nestjs/typeorm";
import { createClassSeeders, seeder } from "nestjs-class-seeder";
import { Duck } from "./duck.entity";

const entities = [Duck]

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
}).run([
  ...createClassSeeders(entities)
]);
