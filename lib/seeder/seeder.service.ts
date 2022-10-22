import { Injectable, Type } from '@nestjs/common';
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

  async seed(): Promise<any> {
      // Seed seeders in forward order
      for (const seeder of this.seeders) {
          await seeder.seed();
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
