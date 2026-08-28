import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function createDb() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  return drizzle(client, { schema });
}

export const db: ReturnType<typeof drizzle<typeof schema>> =
  globalThis.__db ?? createDb();

if (process.env.NODE_ENV !== "production") globalThis.__db = db;
