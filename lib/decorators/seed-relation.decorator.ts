import { Faker } from "@faker-js/faker";
import { SeedRelationPicker, SeedValueGenerator } from "../interfaces";
import { SeederContext } from "../interfaces";
import { SeederFactory } from "../seeder/seeder.factory";
import { ClassRef, ForwardRef } from "../relationships";
import { SeedRelationOptions } from "../interfaces";
import { pickRelated } from "../relationships/pick";

export function SeedRelation<T>(
  classRef: ClassRef<T>,
  pick?: SeedRelationPicker<T>,
  options: SeedRelationOptions = {}
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    let pickFn: SeedValueGenerator = async (
      _faker: Faker,
      context: SeederContext
    ) => {
      const relatedClass = classRef();
      if (context.savedEntities.has(relatedClass)) {
        const idColumns = context.dataSource
          .getMetadata(relatedClass)
          .primaryColumns.map((c) => c.propertyName);
        return pickRelated<T>(
          context,
          idColumns,
          context.savedEntities.get(relatedClass),
          pick,
          options.many
        );
      } else {
        return new ForwardRef(
          propertyKey,
          context,
          relatedClass,
          pick,
          options
        );
      }
    };
    Reflect.defineMetadata(
      Symbol("Seeder relation factory"),
      new SeederFactory(propertyKey, pickFn),
      target.constructor
    );
  };
}
