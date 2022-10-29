<p align="center">
A class-decorator based seeder for NestJS projects.
</p>

## Installation and setup

### Install the dependency

```
npm install nestjs-class-seeder --save-dev
```

### Create a seeding script

Create a seeding script called `seeder.ts` under the `src` folder of your NestJS project:

```typescript
import { seeder, createClassSeeder } from "nestjs-class-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";

seeder({
  imports: [
    TypeOrmModule.forRoot(yourConfig),
    TypeOrmModule.forFeature([Duck]),
  ],
  providers: [],
}).run([createClassSeeder(Duck)]);
```

For multiple entities, use the plural `createClassSeeders` function instead:

```typescript
import { seeder, createClassSeeders } from "nestjs-class-seeder";
import { TypeOrmModule } from "@nestjs/typeorm";

const entities = [Duck, Beaver, Gecko];

seeder({
  imports: [
    TypeOrmModule.forRoot(yourConfig),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [],
}).run(createClassSeeders(entities));
```

Note that you can pass additional imports and providers for dependency injection.

### Integrate your seeder into the command line

Add these two scripts (`seed` and `seed:refresh`) under the `scripts` property in your
`package.json` file:

```json
"scripts": {
  "seed": "node -r tsconfig-paths/register -r ts-node/register src/seeder.ts",
  "seed:refresh": "node -r tsconfig-paths/register -r ts-node/register src/seeder.ts -- --refresh"
}
```

You can now run either `npm run seed`. If you run `npm run seed:refresh` you **drop all**
data in the seeded tables before generating new data.

## Usage

To generate values for columns, decorate them with the `Seed` decorator, the decorator
takes simple static values, or a generator function. Generator functions are handed a
`Faker` instance to help you produce fake values, and a `context` (more on that later):

```typescript
import { Seed } from "nestjs-class-seeder";
import { Entity, Column } from "typeorm";

@Entity()
export class Duck {
  @Seed(faker => faker.name.firstName())
  @Column()
  name: string;

  @Seed("yellow")
  @Column()
  billColor: string;
}
```

### Relationships

You can seed relationships using the `SeedRelation` decorator:

```typescript
import { SeedRelation } from 'nestjs-class-seeder';
import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Duck } from './duck.entity';

@Entity()
export class Beaver {
  @PrimaryGeneratedColumn()
  id: number;

  // Selects a random Duck
  @SeedRelation(() => Duck)
  @ManyToOne(() => Duck, {onDelete: 'SET NULL'})
  random: Duck;

  // Selects the 4th Duck created this seeding batch
  @SeedRelation(() => Duck, 3)
  @ManyToOne(() => Duck, {onDelete: 'SET NULL'})
  reallyHatesThis: Duck;

  // Selects multiple Ducks
  @SeedRelation(() => Duck, [6, 4, 1])
  @ManyToMany(() => Duck, {onDelete: 'SET NULL'})
  @JoinTable()
  butHasTheirEyesOn: Duck[];
}
```

**Note** the use of the `() => MyClass` pattern to avoid circular dependencies.

#### Relationship queries

`nestjs-class-seeder` uses [sift.js](https://github.com/crcn/sift.js) to let you use
MongoDB queries to find generated relationship objects. Relationship queries only apply to
objects created during the same seeding batch, the database entries are not queried.

```typescript
import { SeedRelation } from 'nestjs-class-seeder';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Duck } from './duck.entity';

@Entity()
export class Beaver {
  @PrimaryGeneratedColumn()
  id: number;

  // Selects a duck named Tucker
  @SeedRelation(() => Duck, {name: "Tucker"})
  @ManyToOne(() => Duck, {onDelete: 'SET NULL'})
  bestFriend: Duck;

  // Selects all ducks with more than 11350 feathers.
  @SeedRelation(() => Duck, {feathers: {$gt: 11350}}, {many: true})
  @ManyToMany(() => Duck, {onDelete: 'SET NULL'})
  @JoinTable()
  extraFluffyOnes: Duck[];
}
```

### Context

Clearly, Tucker is not all beavers' best friend (see previous example if you're confused).
Some outcomes depend on the current context. The seeding context is passed as the second
argument to generator functions:

```typescript
import { SeedEnum, SeedRelation } from 'nestjs-class-seeder';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Duck } from './duck.entity';

const enum BeaverNames = {
  BuckBean,
  Sawyer,
  Bonnie,
}

@Entity()
export class Beaver {
  @PrimaryGeneratedColumn()
  id: number;

  @SeedEnum(BeaverNames)
  name: BeaverNames;

  // Tucker is only BuckBean's best friend
  @SeedRelation(() => Duck, (faker, ctx) =>
    ctx.currentRecord.name === BeaverNames.BuckBean ? {name: "Tucker"} : null
  )
  @ManyToOne(() => Duck, {onDelete: 'SET NULL'})
  bestFriend: Duck;
}
```

It also gives you access to:

* `currentRecord`: A `Record` of the generated values so far.
* `currentIndex`: The index of the current record in the batch.
* `currentRecords`: The other records generated so far.
* `currentBatchRecords`: A class-to-records `Map` generated so far.
* `savedEntities`: A class-to-entity `Map` with the entities saved to the database so far.
* `dataSource`: Your TypeORM connection to the database.

## 📜 License

`nestjs-class-seeder` is [MIT licensed](LICENSE). This project was forked from
[`nestjs-seeder`](https://github.com/edwardanthony/nestjs-seeder).
