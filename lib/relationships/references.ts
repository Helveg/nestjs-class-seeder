import { Type } from "@nestjs/common";
import { SeederContext, SeedRelationPicker } from "../interfaces";
import { pickRelated } from "./pick";

export type ClassRef<T> = () => new () => T;

export abstract class Ref<T> {
  public selfClass: Type;
  public selfId: number;

  constructor(
    public propertyKey: string | symbol,
    public readonly context: SeederContext,
    public readonly refClass: Type<T>,
    public readonly pick: SeedRelationPicker<T>,
    public readonly options: any = {},
  ) {
    this.selfClass = context.currentClass;
    this.selfId = context.currentIndex;
    this.context = { ...context };
  }

  abstract resolve(entities: any[]): Promise<any>;
}

export class ForwardRef<T> extends Ref<T> {
  async resolve(entities: T[]) {
    const self = this.context.savedEntities.get(this.selfClass)[this.selfId];
    const idColumns = this.context.dataSource
      .getMetadata(this.refClass)
      .primaryColumns.map((col) => col.propertyName);
    const toSave = {};
    for (const primaryColumn of idColumns) {
      toSave[primaryColumn] = self[primaryColumn];
    }
    toSave[this.propertyKey] = await pickRelated(
      this.context,
      idColumns,
      entities,
      this.pick,
    );
    return this.context.dataSource.getRepository(this.selfClass).save(toSave);
  }
}
