import { Type } from "@nestjs/common";
import { DataSource } from "typeorm";

export interface SeederContext {
  readonly currentIndex: number;
  readonly currentRecord: Record<string, any>;
  readonly previousRecord: Record<string, any>;
  readonly currentBatchRecords: Record<string, any>[];
  readonly currentBatchSize: number;
  readonly currentRecords: Map<Type<any>, Record<string, any>[]>;
  readonly dataSource: DataSource;
}
