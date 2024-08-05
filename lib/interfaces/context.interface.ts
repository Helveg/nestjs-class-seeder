import { Type } from "@nestjs/common";
import { Ref } from "../relationships/references";
import { DataSource } from "typeorm";

export interface SeederContext {
  readonly currentIndex: number;
  readonly currentClass: Type;
  readonly currentRecord: Record<string, any>;
  readonly previousRecord: Record<string, any>;
  readonly currentBatchRecords: Record<string, any>[];
  readonly currentBatchSize: number;
  readonly currentRecords: Map<Type, Record<string, any>[]>;
  readonly savedEntities: Map<Type, any[]>;
  readonly dataSource: DataSource;
  readonly unresolvedReferences: Ref<any>[];
}

export interface DropContext {
  readonly dataSource: DataSource;
}
