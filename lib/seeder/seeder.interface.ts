import { DropContext, SeederContext } from "../interfaces/context.interface";

export interface Seeder {
  seed(context: SeederContext): Promise<any>;
  drop(context: DropContext): Promise<any>;
}
