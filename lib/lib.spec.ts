import { TypeOrmModule } from "@nestjs/typeorm";
import { Beaver } from "./tests/beaver.entity";
import { Duck } from "./tests/duck.entity";
import { createClassSeeders, seeder } from "./index";
import { v4 as uuidv4 } from "uuid";
import { DataSource, Repository } from "typeorm";
import * as fs from "fs";
import * as path from "node:path";

describe("class-seeder", () => {
  let testDbDir = `./.testdbs`;
  let testDb = path.join(testDbDir, `${uuidv4()}.db`);
  let dataSource: DataSource;
  let beaverRepo: Repository<Beaver>;
  let duckRepo: Repository<Duck>;
  const entities = [Duck, Beaver];
  const dsOptions = {
    type: "sqlite",
    database: testDb,
    synchronize: true,
    entities,
  } as const;

  beforeEach(async () => {
    dataSource = new DataSource(dsOptions);
    await dataSource.initialize();
    beaverRepo = dataSource.getRepository(Beaver);
    duckRepo = dataSource.getRepository(Duck);
  });

  describe("single batch", () => {
    beforeEach(async () => {
      await seeder({
        imports: [
          TypeOrmModule.forRoot(dsOptions),
          TypeOrmModule.forFeature(entities),
        ],
        debug: true,
      }).run([...createClassSeeders(entities)]);
    });

    it("should seed 10 beavers and ducks", async () => {
      expect(await beaverRepo.count()).toEqual(10);
      expect(await duckRepo.count()).toEqual(10);
    });
  });

  describe("repeated batches", () => {
    beforeEach(async () => {
      await seeder({
        imports: [
          TypeOrmModule.forRoot(dsOptions),
          TypeOrmModule.forFeature(entities),
        ],
        repeats: 10,
        debug: true,
      }).run([...createClassSeeders(entities)]);
    });

    it("should seed 10x10 beavers and ducks", async () => {
      expect(await beaverRepo.count()).toEqual(100);
      expect(await duckRepo.count()).toEqual(100);
    });
  });

  afterEach(() => dataSource.dropDatabase());
  afterAll(async () => {
    await dataSource.destroy();
    // Somehow, the database file stays locked until the running process finishes
    // even though we destroy our connection to it. So instead we place the test DBs
    // in a dedicated directory and just clean up all the files in it. This leaves a
    // maximum of 1 test DB in there at all times (namely the current one), and cleans
    // up the old ones.
    await new Promise((resolve, reject) =>
      fs.readdir(testDbDir, (err, files) => {
        if (err) reject(err);
        else {
          let resolved = 0;
          for (const file of files) {
            fs.unlink(path.join(testDbDir, file), (err) => {
              if (++resolved === files.length) {
                resolve(void 0);
              }
            });
          }
        }
      })
    );
  });
});
