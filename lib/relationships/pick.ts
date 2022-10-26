import { SeedRelationQuery } from "../interfaces/seed-relation.interface";

export async function pickRelated<T>(idColumns: string[], entities: T[], pick: SeedRelationQuery, many: boolean = false) {
  let picked: T | T[];
  if (pick === undefined) {
    picked = entities[Math.floor(Math.random() * entities.length)];
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
