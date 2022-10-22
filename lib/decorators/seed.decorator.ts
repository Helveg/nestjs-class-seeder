import { Faker } from '@faker-js/faker';
import { SeedlingContext } from 'interfaces/seedling-context.interface';

type BaseType = string | number | Date | Buffer | boolean | Record<string, any>;
export type SeedValue = BaseType | Array<BaseType>;
export type SeedValueGenerator = (faker?: Faker, ctx?: SeedlingContext) => SeedValue;

const metaKey = Symbol("Seedling metadata");

export function Seed(arg: SeedValueGenerator | SeedValue) {
  return (target: any, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(metaKey, arg, target, propertyKey)
  };
}
