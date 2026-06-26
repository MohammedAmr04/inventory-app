import "server-only";

type Database = Awaited<ReturnType<typeof createDb>>;

let _db: Database | null = null;

async function createDb() {
  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const schema = await import("./schema");

  const sqlite = new Database("retailx.db");
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  return drizzle(sqlite, { schema });
}

export async function getDb() {
  if (!_db) {
    _db = await createDb();
  }
  return _db;
}
