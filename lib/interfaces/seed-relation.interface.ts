import { ShapeQuery as MongoQuery } from '@helveg/sift';

export type SeedRelationQuery<T> = number | MongoQuery<T>;
export interface SeedRelationOptions {
  readonly many?: boolean
}
