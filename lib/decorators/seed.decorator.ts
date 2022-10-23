import { SeedValue, SeedValueGenerator } from '../interfaces/generator.interface';
import { SeederFactory } from '../seeder/seeder.factory';

export function Seed(arg: SeedValue | SeedValueGenerator): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(Symbol("Seeder factory metadata"), new SeederFactory(propertyKey, arg), target.constructor);
  };
}
