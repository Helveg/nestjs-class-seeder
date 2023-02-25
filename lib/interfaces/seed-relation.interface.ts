import { ShapeQuery as MongoQuery } from "sift";
import { SeederContext } from "./context.interface";

type BaseType<T> = number | MongoQuery<T>;
export type SeedRelationQuery<T> = BaseType<T> | BaseType<T>[];
export type SeedRelationFn<T> = (ctx: SeederContext, entities: T[]) => T | T[];
export type SeedRelationPicker<T> = SeedRelationFn<T> | SeedRelationQuery<T>;
export interface SeedRelationOptions {
  readonly many?: boolean;
}
