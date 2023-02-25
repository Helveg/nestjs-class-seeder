import { TypeOrmModule } from "@nestjs/typeorm";
import { Beaver } from "./tests/beaver.entity";
import { Duck } from "./tests/duck.entity";
import { createClassSeeders, seeder } from "./index";
import { v4 as uuidv4 } from "uuid";
import { DataSource, Repository } from "typeorm";

describe("paginate", () => {
  let testDb = `./${uuidv4()}.db`;
  let dataSource: DataSource;
  let beaverRepo: Repository<Beaver>;
  let duckRepo: Repository<Duck>;

  beforeAll(async () => {
    const entities = [Duck, Beaver];
    const dsOptions = {
      type: "sqlite",
      database: testDb,
      synchronize: true,
      entities,
    } as const;

    await seeder({
      imports: [
        TypeOrmModule.forRoot(dsOptions),
        TypeOrmModule.forFeature(entities),
      ],
      debug: true,
    }).run([...createClassSeeders(entities)]);
    dataSource = new DataSource(dsOptions);
    await dataSource.initialize();
    beaverRepo = dataSource.getRepository(Beaver);
    duckRepo = dataSource.getRepository(Duck);
  });

  it("should seed 10 beavers and ducks", async () => {
    expect(await beaverRepo.count()).toEqual(10);
    expect(await duckRepo.count()).toEqual(10);
  });
});
