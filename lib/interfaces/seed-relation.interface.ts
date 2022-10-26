import { ShapeQuery as MongoQuery } from '@helveg/sift';

type BaseType<T> = number | MongoQuery<T>;
export type SeedRelationQuery<T> = BaseType<T> | BaseType<T>[];
export interface SeedRelationOptions {
  readonly many?: boolean
}
