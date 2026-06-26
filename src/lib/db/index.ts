import "server-only";
import path from "path";

type Database = Awaited<ReturnType<typeof createDb>>;

let _db: Database | null = null;

async function createDb() {
  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const schema = await import("./schema");

  const dbPath = process.env.RETAILX_DB_PATH || path.join(process.cwd(), "retailx.db");
  const sqlite = new Database(dbPath);
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
