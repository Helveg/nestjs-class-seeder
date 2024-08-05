import { SeedValue, SeedValueGenerator } from "../interfaces";
import { SeederFactory } from "../seeder/seeder.factory";

export function Seed(arg: SeedValue | SeedValueGenerator): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    const existingSymbols = Reflect.getMetadataKeys(target.constructor);
    // Check if somewhere in the prototype chain, or on ourselves, we already have a
    // factory for the same `propertyKey` ...
    const symbol =
      existingSymbols.find(
        (symbol) =>
          Reflect.getMetadata(symbol, target.constructor)?.propertyKey ===
          propertyKey
        // ... if so, use it. If not, create a new one.
      ) ?? Symbol("Seeder factory metadata");

    Reflect.defineMetadata(
      // (over)write new/existing metadata symbol for the propertyKey.
      symbol,
      new SeederFactory(propertyKey, arg),
      target.constructor
    );
  };
}
