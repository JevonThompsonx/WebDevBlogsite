import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { serverEnv } from "@/lib/env";

function createDatabaseClient() {
  if (
    serverEnv.DATABASE_AUTH_TOKEN &&
    serverEnv.DATABASE_AUTH_TOKEN.length > 0
  ) {
    return createClient({
      url: serverEnv.DATABASE_URL,
      authToken: serverEnv.DATABASE_AUTH_TOKEN,
    });
  }

  return createClient({
    url: serverEnv.DATABASE_URL,
  });
}

export const client = createDatabaseClient();
export const db = drizzle(client);
