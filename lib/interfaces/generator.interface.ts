import { Faker } from '@faker-js/faker';
import { SeederContext } from "./context.interface";

type BaseType = string | number | Date | Buffer | boolean | Record<string, any>;
export type SeedValue = BaseType | Array<BaseType>;
export type SeedValueGenerator = (faker?: Faker, ctx?: SeederContext) => SeedValue | Promise<SeedValue>;
