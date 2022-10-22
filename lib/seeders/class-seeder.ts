import { Provider, Type } from "@nestjs/common";
import { Seeder } from "seeder/seeder.interface";

export class ClassSeeder implements Seeder {
  constructor(protected readonly seedClass: Type<any>) {
    console.log("Constructed seeder for", seedClass)
  }

  async seed() {

  }

  async drop() {

  }
}

export function createClassSeeder(seedClass: Type<any>): Provider<ClassSeeder> {
  return {
    provide: Symbol(`Class provider of '${seedClass.name}'`),
    useFactory: () => new ClassSeeder(seedClass)
  }
}

export function createClassSeeders(seedClasses: Type<any>[]): Provider<ClassSeeder>[] {
  return seedClasses.map(seedClass => createClassSeeder(seedClass));
}
