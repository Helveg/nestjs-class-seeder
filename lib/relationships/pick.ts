import { ShapeQuery } from "@helveg/sift";
import sift from "@helveg/sift";
import { SeedRelationQuery } from "../interfaces/seed-relation.interface";
import { Logger } from "@nestjs/common";
import { inspect } from "util";

const logger = new Logger("SeedRelation");

export async function pickRelated<T>(idColumns: string[], entities: T[], pick: SeedRelationQuery<T>, many: boolean = false) {
  let picked: T | T[];
  if (pick === undefined) {
    picked = entities[Math.floor(Math.random() * entities.length)];
  } else if(Array.isArray(pick)) {
    picked = await Promise.all(pick.map(v => pickRelated(idColumns, entities, v, many)));
    if (many) {
      picked = Array.prototype.concat(...picked);
    }
  } else if (isQuery(pick)) {
    picked = entities.filter(sift(<any>pick));
    if (many) {
      return picked;
    } else if (picked.length == 0) {
      return null;
    } else {
      logger.warn(`${picked.length} found for to-one relationship with query ${inspect(pick)}.`)
      return picked[0];
    }
  } else if (typeof pick === "number") {
    picked = entities[pick];
  } else {
    ((_: never) => {})(pick)
  }
  return restrict(idColumns, picked);
}

function restrict<T>(cols: string[], pick: T | T[]): any {
  if (Array.isArray(pick)) return pick.map(v => restrict(cols, v));
  return Object.fromEntries(Object.entries(pick).filter(kv => cols.includes(kv[0])))
}

function isQuery<T>(arg: SeedRelationQuery<any>): arg is ShapeQuery<T> {
  return typeof arg === "object";
}
