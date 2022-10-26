import {
  Module,
  DynamicModule,
  Provider,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SeederOptions } from './seeder';
import { Seeder } from './seeder.interface';
import { SeederService } from './seeder.service';

export interface SeederModuleOptions extends SeederOptions {
  seeders: Provider<Seeder>[];
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
            return new SeederService(dataSource, seeders, options.refresh);
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
