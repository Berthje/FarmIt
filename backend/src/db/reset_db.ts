import { query } from "./db.ts";
import { runMigrations } from "./migrate.ts";
import { seedDatabase } from "./seed_db.ts";

async function resetDatabase() {
	console.log("Resetting database...");
	await query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
	await runMigrations();
	await seedDatabase();
	console.log("Database reset and seeded!");
}

await resetDatabase();
