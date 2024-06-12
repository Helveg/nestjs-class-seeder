import { Injectable, Logger } from "@nestjs/common";
import { SeederContext } from "../interfaces/index.js";
import { DataSource } from "typeorm";
import { Seeder } from "./seeder.interface";

@Injectable()
export class SeederService {
  private logger = new Logger("Seeder");

  constructor(
    private readonly dataSource: DataSource,
    private readonly seeders: Seeder[],
    public refresh: boolean = false,
    public repeats: number = 1
  ) {}

  async run(): Promise<any> {
    if (this.refresh) {
      await this.drop();
    }
    return await this.seed();
  }

  async createContext(): Promise<SeederContext> {
    return {
      dataSource: this.dataSource,
      currentRecords: new Map(),
      savedEntities: new Map(),
      unresolvedReferences: [],
    } as SeederContext;
  }

  async seed(): Promise<any> {
    for (let i = 0; i < this.repeats; i++) {
      if (this.repeats > 1) {
        this.logger.log(`Repeating seeders ${i} out of ${this.repeats} times.`);
      }
      const context: SeederContext = await this.createContext();
      // Seed seeders in forward order
      for (const seeder of this.seeders) {
        await seeder.seed(context);
        this.logger.log(`${seeder.getName()} completed.`);
      }
    }
  }

  async drop(): Promise<any> {
    // Drop seeders in reverse order
    for (const seeder of this.seeders.slice().reverse()) {
      await seeder.drop({ dataSource: this.dataSource });
      this.logger.log(`${seeder.getName()} dropped.`);
    }
  }
}
