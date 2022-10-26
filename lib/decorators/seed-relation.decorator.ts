import { Faker } from '@faker-js/faker';
import { SeedValueGenerator } from '../interfaces/generator.interface';
import { SeederContext } from '../interfaces/context.interface';
import { SeederFactory } from '../seeder/seeder.factory';
import { ClassRef, ForwardRef } from '../relationships/references';
import { SeedRelationQuery, SeedRelationOptions } from '../interfaces/seed-relation.interface';
import { pickRelated } from '../relationships/pick';

export function SeedRelation<T>(classRef: ClassRef<T>, pick?: SeedRelationQuery<T>, options: SeedRelationOptions = {}): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    let pickFn: SeedValueGenerator = async (_faker: Faker, context: SeederContext) => {
      const relatedClass = classRef();
      if (context.savedEntities.has(relatedClass)) {
        const idColumns = context.dataSource.getMetadata(relatedClass).primaryColumns.map(c => c.propertyName);
        return pickRelated<T>(idColumns, context.savedEntities.get(relatedClass), pick, options.many);
      } else {
        return new ForwardRef(propertyKey, context, relatedClass, pick, options);
      }
    }
    Reflect.defineMetadata(Symbol("Seeder relation factory"), new SeederFactory(propertyKey, pickFn), target.constructor);
  };
}
