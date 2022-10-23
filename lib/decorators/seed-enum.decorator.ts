import { Faker } from '@faker-js/faker';
import { Seed } from './seed.decorator';

export const SeedEnum = (arg: any) => Seed((faker: Faker) => faker.helpers.arrayElement(Object.values(arg)));
