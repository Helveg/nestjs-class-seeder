import { faker } from "@faker-js/faker";
import { Logger, Provider, Type } from "@nestjs/common";
import { DropContext, SeederContext } from "../interfaces/context.interface";
import { Ref } from "../relationships/references";
import { SeederFactory } from "../seeder/seeder.factory";
import { Seeder } from "../seeder/seeder.interface";
import { inspect } from 'util';

type Mutable<T> = {
     -readonly [K in keyof T]: T[K]
}

export interface ClassSeederOptions<T> {
  readonly count?: number;
  readonly seeder?: new () => ClassSeeder<T>;
}

export class ClassSeeder<T, RecordOfT extends Record<keyof T, any> = Record<keyof T, any>> implements Seeder {
  protected factories: SeederFactory[];
  protected logger: Logger;

  constructor(protected readonly seedClass: Type<T>, protected readonly options: ClassSeederOptions<T>) {
    this.factories = getSeedFactories(seedClass);
    this.logger = new Logger(`ClassSeeder:${this.getName()}`);
    this.logger.debug(`Registered factory properties: ${this.factories.map(f => f.propertyKey).join(', ')}`);
  }

  getName() {
    return this.seedClass.name;
  }

  async seed(context: SeederContext) {
    this.logger.debug(`Start of seeding ...`);
    const ctx: Mutable<SeederContext> = context;
    const batchSize = await this.getBatchSize();
    const repo = ctx.dataSource.getRepository(this.seedClass);
    const records = await this.createRecords(batchSize, ctx);
    const refs = pilferReferences(records);
    ctx.unresolvedReferences = ctx.unresolvedReferences.concat(refs);
    this.logger.debug(`Saving records ...`);
    let saved = await repo.save(records);
    ctx.savedEntities.set(this.seedClass, saved);
    this.logger.debug(`Saved.`);
    const resolvePromises = [];
    const counter = ctx.unresolvedReferences.length;
    ctx.unresolvedReferences = ctx.unresolvedReferences.filter(ref => {
      if (ref.refClass === this.seedClass) resolvePromises.push(ref.resolve(saved));
      else return true;
    });
    this.logger.debug(`Resolving ${counter - ctx.unresolvedReferences.length} references ...`);
    if (resolvePromises.length) {
      await Promise.all(resolvePromises);
      saved = await repo.save(records);
      ctx.savedEntities.set(this.seedClass, saved);
      this.logger.debug(`Resolved.`);
    }
    this.logger.debug(`Finished.`);
    return saved;
  }

  async drop(ctx: DropContext) {
    const repo = ctx.dataSource.getRepository(this.seedClass);
    await repo.clear();
  }

  async getBatchSize(): Promise<number> {
    return this.options.count || 10;
  }

  async createRecords(n: number, context: SeederContext): Promise<RecordOfT[]> {
    this.logger.debug(`Generating ${n} records.`);
    const ctx: Mutable<SeederContext> = context;
    ctx.currentClass = this.seedClass;
    ctx.currentBatchSize = n;
    ctx.currentBatchRecords = [];
    ctx.currentRecords.set(this.seedClass, ctx.currentBatchRecords);
    const records = Array<RecordOfT>(n);
    for (let i = 0; i < records.length; i++) {
      ctx.currentIndex = i;
      records[i] = ctx.previousRecord = await this.createRecord(context);
      ctx.currentBatchRecords.push(ctx.previousRecord);
    }
    ctx.currentClass = undefined;
    this.logger.debug(`Generated records: ${inspect(records, {depth: 2, colors: true})}`);
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
  new Logger("ClassSeederFactory").debug(`Creating ${productClass.name} for ${seedClass.name}`);
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

function pilferReferences(records: Record<string, any>[]) {
  const refs: Ref[] = [];
  for (const record of records) {
    for(const [prop, value] of Object.entries(record)) {
      if (value instanceof Ref) {
        value.propertyKey = prop;
        refs.push(value);
        delete record[prop];
      }
    }
  }
  return refs;
}
