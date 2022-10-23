import { faker } from "@faker-js/faker";
import { Provider, Type } from "@nestjs/common";
import { SeederContext } from "../interfaces/context.interface";
import { SeederFactory } from "../seeder/seeder.factory";
import { Seeder } from "../seeder/seeder.interface";

type Mutable<T> = {
     -readonly [K in keyof T]: T[K]
}

export interface ClassSeederOptions<T> {
  readonly count?: number;
  readonly seeder?: new () => ClassSeeder<T>;
}

export class ClassSeeder<T, RecordOfT extends Record<keyof T, any> = Record<keyof T, any>> implements Seeder {
  protected factories: SeederFactory[];
  constructor(protected readonly seedClass: Type<T>, protected readonly options: ClassSeederOptions<T>) {
    console.log("Creating class seeder instance for", seedClass, options)
    this.factories = getSeedFactories(seedClass);
  }

  async seed(ctx: SeederContext) {
    const batchSize = await this.getBatchSize();
    const repo = ctx.dataSource.getRepository(this.seedClass);
    const records = await this.createRecords(batchSize, ctx);
    return await repo.save(records);
  }

  async drop() {

  }

  async getBatchSize(): Promise<number> {
    return this.options.count || 10;
  }

  async createRecords(n: number, context: SeederContext): Promise<RecordOfT[]> {
    const ctx: Mutable<SeederContext> = context;
    ctx.currentBatchSize = n;
    ctx.currentBatchRecords = [];
    ctx.currentRecords.set(this.seedClass, ctx.currentBatchRecords);
    const records = Array<RecordOfT>(n);
    for (let i = 0; i < records.length; i++) {
      ctx.currentIndex = i;
      records[i] = ctx.previousRecord = await this.createRecord(context);
      ctx.currentBatchRecords.push(ctx.previousRecord);
    }
    return records;
  }

  async createRecord(context: SeederContext): Promise<RecordOfT> {
    const ctx: Mutable<SeederContext> = context;
    const instance: RecordOfT = ctx.currentRecord = {} as RecordOfT;
    for(const factory of this.factories) {
      instance[factory.propertyKey] = await factory.generate(faker, context);
    }
    return instance;
  }
}

export function createClassSeeder<T>(seedClass: Type<T>, options: ClassSeederOptions<T> = {}): Provider<ClassSeeder<T>> {
  const productClass = options.seeder || ClassSeeder<T>;
  console.log("picked cls seeder", productClass, options.seeder, ClassSeeder<T>)
  return {
    provide: Symbol(`Class seeder of '${seedClass.name}'`),
    useFactory: () => new productClass(seedClass, options),
  }
}

export function createClassSeeders(seedClasses: Type<any>[], options: ClassSeederOptions<any> | ClassSeederOptions<any>[] = {}): Provider<ClassSeeder<any>>[] {
  let optionsArray: ClassSeederOptions<any>[] = Array.isArray(options)
    ? options
    : Array.from({length: seedClasses.length}, () => options);
  return seedClasses.map((seedClass, i) => createClassSeeder(seedClass, optionsArray[i]));
}

export function getSeedFactories(seedClass: Type<any>): SeederFactory[] {
  return Reflect.getMetadataKeys(seedClass)
    .map(key => Reflect.getMetadata(key, seedClass))
    .filter(meta => meta instanceof SeederFactory);
}
