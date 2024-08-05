import { NestFactory } from "@nestjs/core";
import { SeederModule, SeederModuleOptions } from "./seeder.module";
import { SeederService } from "./seeder.service";
import { Seeder } from "./seeder.interface";
import {
  DynamicModule,
  ForwardReference,
  LogLevel,
  Provider,
  Type,
} from "@nestjs/common";

export interface SeederOptions {
  imports?: Array<
    Type | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
  refresh?: boolean;
  repeats?: number;
  debug?: boolean;
  quiet?: boolean;
}

export interface SeederRunner {
  run(seeders: Provider<Seeder>[]): Promise<void>;
}

async function bootstrap(options: SeederModuleOptions) {
  const logger: LogLevel[] = options.quiet
    ? ["error"]
    : ["log", "warn", "error"];
  if (options.debug) logger.push("debug");

  const app = await NestFactory.createApplicationContext(
    SeederModule.register(options),
    { logger }
  );
  const seedersService = app.get(SeederService);
  await seedersService.run();

  return await app.close();
}

export const seeder = (options: SeederOptions): SeederRunner => {
  return {
    run(seeders: Provider<Seeder>[] = []): Promise<void> {
      return bootstrap({
        ...options,
        seeders,
      });
    },
  };
};
