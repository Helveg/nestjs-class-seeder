<p align="center">
An extension library for NestJS to perform seeding.
</p>

## How to use

### 1. Install the dependency

`npm install nestjs-seedling --save-dev`

### 2. Define the model class

In this example, we'll use `@nestjs/mongoose` to define our model. But you could use any
class that you want. It's not tied to any database type. The only requirement is that you
use ES2015 class.

#### user.schema.ts

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Factory } from "nestjs-seedling";

@Schema()
export class User extends Document {
  @Factory(faker => faker.name.findName())
  @Prop()
  name: string;
}

export const userSchema = SchemaFactory.createForClass(User);
```

Notice that we use `@Factory` decorator to specify the value for this property. This value
will be used during the seeding process.

`@Factory` decorator supports multiple argument types, for example:

#### Static Value

```typescript
@Factory('male')
gender: string;
```

#### Faker Generated Value

```typescript
@Factory(faker => faker.address.streetAddress())
address: string;
```

#### Custom Function

```typescript
@Factory(() => {
  const minAge = 18;
  const maxAge = 30;
  return Math.round(Math.random() * (maxAge - minAge) + minAge);
})
age: number;
```

### 3. Define seeder

A seeder is a class that implements `Seeder` interface. It requires you to implement two
methods:

- `async seed(): Promise<any>`
- `async drop(): Promise<any>`

Use `seed` method to insert data into the database, and use `drop` method to clear the
data in the database (collection / table).

To insert the data into the database, you could use the provided
`DataFactory.createForClass` method. Please see the example below:

#### users.seeder.ts

```typescript
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { Seeder, DataFactory } from "nestjs-seedling";

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly user: Model<User>) {}

  async seed(): Promise<any> {
    // Generate 10 users.
    const users = DataFactory.createForClass(User).generate(10);

    // Insert into the database.
    return this.user.insertMany(users);
  }

  async drop(): Promise<any> {
    return this.user.deleteMany({});
  }
}
```

### 4. Register the seeder

Create a seeder file under `src` folder in your NestJS project and name it `seeder.ts`.

#### src/seeder.ts

```typescript
import { seeder } from "nestjs-seedling";
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "./schemas/user.schema";
import { UsersSeeder } from "./seeders/users.seeder";

seeder({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/nestjs-seedling-sample"),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
}).run([UsersSeeder]);
```

Notice that `seeder` function accepts NestJS `@Module()` decorator metadata such as
`imports` and `providers`. This will allow you to use NestJS dependency injection and
later inject it in your seeder file.

Finally, we call `run` method and pass any number of seeders that you want to run. In this
case we want to run `UsersSeeder`.

If you want to run multiple seeders, you could do:

```typescript
.run([UsersSeeder, ProductsSeeder])
```

### 5. Integrate your seeder into command line

Add these two script (`seed` and `seed:refresh`) under the `scripts` property in your
`package.json` file:

#### package.json

```json
"scripts": {
  "seed": "node dist/seeder",
  "seed:refresh": "node dist/seeder --refresh"
}
```

**NOTE:** Don't replace the `scripts`. Add both `seed` and `seed:refresh` scripts after
*your existing scripts.

With the scripts integrated in the `package.json` file, now you could run 2 different
commands:

#### Run seeders normally

`npm run seed`

#### Run seeders and replace existing data

`npm run seed:refresh`

## Advance Usage

### Access previously generated value

#### user.schema.ts

```typescript
@Schema()
export class User extends Document {
  @Factory(faker => faker.random.arrayElement(["male", "female"]))
  @Prop({ required: true })
  gender: string;

  @Factory((faker, ctx) => faker.name.firstName(ctx.gender === "male" ? 0 : 1))
  @Prop({ required: true })
  firstName: string;
}
```

### Fill context with predefined values

#### user.schema.ts

```typescript
const users = DataFactory.createForClass(User).generate(10, {
  zipCode: "10153",
});
```

#### users.seeder.ts

```typescript
@Schema()
export class User extends Document {
  // If you pass predefined values to the `generate` function, you will be
  // able to access it in the context.
  @Factory((faker, ctx) => `${faker.address.streetAddress()} ${ctx.zipCode}`)
  @Prop({ required: true })
  address: string;
}
```

## 📜 License

`nestjs-seedling` is [MIT licensed](LICENSE).
