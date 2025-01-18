import { runMigrations } from "./migrate.ts";
import { seedDatabase } from "./seed_db.ts";

async function resetDatabase() {
  await runMigrations();
  await seedDatabase();
  console.log("Database reset done!");
}

await resetDatabase();
