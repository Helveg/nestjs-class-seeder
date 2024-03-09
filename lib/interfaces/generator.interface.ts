import { Faker } from "@faker-js/faker";
import { Ref } from "../relationships/references";
import { SeederContext } from "./context.interface";

type BaseType = string | number | Date | Buffer | boolean | Record<string, any>;
export type SeedValue = BaseType | Array<BaseType> | Ref<any>;
export type SeedValueGenerator = (
  faker: Faker,
  ctx: SeederContext
) => SeedValue | Promise<SeedValue>;
