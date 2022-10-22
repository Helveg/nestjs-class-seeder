import { SeedValue } from '../decorators/seed.decorator';

export interface Seed {
  generate(count: number, values?: Record<string, any>): Record<string, SeedValue>[];
}
