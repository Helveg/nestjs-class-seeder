import { SeederContext } from "../interfaces/context.interface";

export interface Seeder {
  seed(context: SeederContext): Promise<any>;
  drop(): Promise<any>;
}
