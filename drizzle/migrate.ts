import { readdir, readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.TURSO_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  "file:./local.db";
const authToken =
  process.env.DATABASE_AUTH_TOKEN ??
  process.env.TURSO_AUTH_TOKEN ??
  process.env.POSTGRES_PASSWORD;

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
  await client.execute(`
    CREATE TABLE IF NOT EXISTS __migrations (
      id TEXT PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);

  const migrationDirectory = new URL("./migrations", import.meta.url);
  const migrationFiles = (await readdir(migrationDirectory))
    .filter((fileName) => fileName.endsWith(".sql"))
    .sort();

  const appliedResult = await client.execute(
    "SELECT id FROM __migrations ORDER BY id",
  );

  const appliedMigrations = new Set<string>();

  for (const row of appliedResult.rows) {
    const migrationId = row.id;

    if (typeof migrationId === "string") {
      appliedMigrations.add(migrationId);
    }
  }

  for (const fileName of migrationFiles) {
    if (appliedMigrations.has(fileName)) {
      continue;
    }

    const migration = await readFile(
      new URL(`./migrations/${fileName}`, import.meta.url),
      "utf8",
    );

    await client.executeMultiple(migration);
    await client.execute({
      sql: "INSERT INTO __migrations (id, applied_at) VALUES (?, ?)",
      args: [fileName, new Date().toISOString()],
    });

    console.log(`Applied migration: ${fileName}`);
  }

  console.log("Database migration complete.");
}

run().finally(async () => {
  await client.close();
});
