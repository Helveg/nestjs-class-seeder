import { Injectable, Type } from '@nestjs/common';
import { SeederContext } from '../interfaces/context.interface';
import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';

@Injectable()
export class SeederService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly seeders: Seeder[],
    public refresh: boolean = false, public log: boolean = true
  ) {

  }

  async run(): Promise<any> {
    if (this.refresh) {
      await this.drop()
    }
    return await this.seed();
  }

  async createContext(): Promise<SeederContext> {
    return {
      dataSource: this.dataSource,
      currentRecords: new Map(),
    } as SeederContext;
  }

  async seed(): Promise<any> {
    const context: SeederContext = await this.createContext();
    // Seed seeders in forward order
    for (const seeder of this.seeders) {
      await seeder.seed(context);
      if (this.log) console.log(`${seeder.constructor.name} completed`);
    }
  }

  async drop(): Promise<any> {
    // Drop seeders in reverse order
    for (const seeder of this.seeders.slice().reverse()) {
        await seeder.drop();
        if (this.log) console.log(`${seeder.constructor.name} dropped`);
    }
  }
}
