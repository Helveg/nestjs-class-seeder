import type { Faker } from "@faker-js/faker";
import { SeederContext } from "../interfaces/context.interface";
import {
  SeedValue,
  SeedValueGenerator,
} from "../interfaces/generator.interface";

export class SeederFactory {
  private readonly fn: SeedValueGenerator;
  constructor(
    public readonly propertyKey: string | symbol,
    fnOrValue: SeedValue | SeedValueGenerator
  ) {
    this.fn =
      typeof fnOrValue !== "function"
        ? () => fnOrValue
        : (fnOrValue as SeedValueGenerator);
  }

  async generate(faker: Faker, context: SeederContext): Promise<SeedValue> {
    return this.fn(faker, context);
  }
}
