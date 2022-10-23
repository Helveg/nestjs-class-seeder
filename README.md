<p align="center">
A class-decorator based seeder for NestJS projects.
</p>

## Usage

### 1. Install the dependency

```
npm install nestjs-class-seeder --save-dev
```

### 2. Decorate your model classes

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

### 3. Create the seeding script

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

### 5. Integrate your seeder into the command line

Add these two scripts (`seed` and `seed:refresh`) under the `scripts` property in your
`package.json` file:

```json
"scripts": {
  "seed": "node dist/seeder",
  "seed:refresh": "node dist/seeder --refresh"
}
```

You can now run either `npm run seed`. If you run `npm run seed:refresh` you **drop all**
data in the seeded tables before generating new data.

## 📜 License

`nestjs-class-seeder` is [MIT licensed](LICENSE). This project was forked from
[`nestjs-seeder`](https://github.com/edwardanthony/nestjs-seeder).
