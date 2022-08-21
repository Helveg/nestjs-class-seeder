import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';

@Injectable()
export class SeederService {
  constructor(private readonly seeders: Seeder[]) {}

  async run(): Promise<any> {
    const promises = this.shouldRefresh()
      ? [this.drop(), this.seed()]
      : [this.seed()];

    return Promise.all(promises);
  }

  async seed(): Promise<any> {
      // Don't use `Promise.all` during insertion.
      // `Promise.all` will run all promises in parallel which is not what we want.
      for (const seeder of this.seeders) {
          await seeder.seed();
          console.log(`${seeder.constructor.name} completed`);
      }
  }
  async drop(): Promise<any> {
    // Drop in reverse order to avoid failed foreign key constraints.
    for (const seeder of this.seeders.slice().reverse()) {
        await seeder.drop();
        console.log(`${seeder.constructor.name} dropped`);
    }
  }

  shouldRefresh(): boolean {
    const argv = process.argv;
    return argv.includes('-r') || argv.includes('--refresh');
  }
}
