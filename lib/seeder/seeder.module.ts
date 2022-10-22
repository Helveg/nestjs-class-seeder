import {
  Module,
  DynamicModule,
  Provider,
  Type,
  ForwardReference,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { SeederService } from './seeder.service';

export interface SeederModuleOptions {
  seeders: Provider<Seeder>[];
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
}

@Module({})
export class SeederModule {
  static register(options: SeederModuleOptions): DynamicModule {
    const tokens = getInjectionTokens(options.seeders);
    return {
      module: SeederModule,
      imports: options.imports || [],
      providers: [
        ...(options.providers || []),
        ...options.seeders,
        {
          provide: SeederService,
          useFactory: (dataSource: DataSource, ...seeders: Seeder[]): SeederService => {
            return new SeederService(
              dataSource,
              seeders,
              process.argv.includes("-r") || process.argv.includes("--refresh"),
              !(process.argv.includes("-q") || process.argv.includes("--quiet")),
            );
          },
          inject: [DataSource, ...tokens],
        },
      ],
    };
  }
}

function getInjectionTokens(providers: Provider<any>[]) {
  return providers.map(prov => {
    if ("provide" in prov) {
      return prov.provide;
    } else {
      return prov;
    }
  });
}
