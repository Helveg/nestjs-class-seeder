import { DataSource } from "typeorm";

export interface SeedlingContext {
  currentIndex: number;
  currentRecord: Record<string, any>;
  dataSource: DataSource;
}
