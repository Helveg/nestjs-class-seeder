import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';

@Injectable()
export class SeederService {
  constructor(private readonly seeders: Seeder[], public refresh: boolean = false, public log: boolean = true) {}

  async run(): Promise<any> {
    if (this.refresh) {
      await this.drop()
    }
    return await this.seed();
  }

  async seed(): Promise<any> {
      // Don't use `Promise.all` during insertion.
      // `Promise.all` will run all promises in parallel which is not what we want.
      for (const seeder of this.seeders) {
          await seeder.seed();
          if (this.log) console.log(`${seeder.constructor.name} completed`);
      }
  }
  async drop(): Promise<any> {
    // Drop in reverse order to avoid failed foreign key constraints.
    for (const seeder of this.seeders.slice().reverse()) {
        await seeder.drop();
        if (this.log) console.log(`${seeder.constructor.name} dropped`);
    }
  }
}
