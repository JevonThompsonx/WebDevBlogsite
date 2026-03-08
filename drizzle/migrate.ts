import { readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";

const databaseUrl = process.env.DATABASE_URL ?? "file:./local.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient(
  authToken && authToken.length > 0
    ? {
        url: databaseUrl,
        authToken,
      }
    : {
        url: databaseUrl,
      },
);

async function run(): Promise<void> {
  const migration = await readFile(
    new URL("./migrations/0000_initial.sql", import.meta.url),
    "utf8",
  );
  await client.executeMultiple(migration);
  console.log("Database migration complete.");
}

run().finally(async () => {
  await client.close();
});
