import { Type } from "@nestjs/common";
import { SeedRelationQuery } from "../interfaces/seed-relation.interface";
import { SeederContext } from "../interfaces/context.interface";
import { pickRelated } from "./pick";

export type ClassRef<T> = () => new () => T;

export abstract class Ref<T> {
  public selfClass: Type<any>;
  public selfId: number;

  constructor(
    public propertyKey: string | symbol,
    public context: SeederContext,
    public refClass: Type<T>,
    public pick: SeedRelationQuery<T>,
    public options: any = {}
  ) {
    this.selfClass = context.currentClass;
    this.selfId = context.currentIndex;
  }

  abstract resolve(entities: any[]): Promise<any>
}

export class ForwardRef<T> extends Ref<T> {
  async resolve(entities: T[]) {
    const self = this.context.savedEntities.get(this.selfClass)[this.selfId];
    const idColumns = this.context.dataSource.getMetadata(this.refClass).primaryColumns
      .map(col => col.propertyName);
    self[this.propertyKey] = await pickRelated(idColumns, entities, this.pick);
    return this.context.dataSource.getRepository(this.selfClass).save(self);
  }
}
