import { resolve } from "https://deno.land/std@0.214.0/path/resolve.ts";
import { query } from "./db.ts";

export async function runMigrations() {
	console.log("Running migrations...");

	const migrationsDir = resolve("./src/db/migrations/");
	const migrationFiles = Array.from(Deno.readDirSync(migrationsDir))
		.filter((file) => file.name.endsWith(".sql"))
		.sort((a, b) => a.name.localeCompare(b.name)); // Ensure migrations run in order

	for (const file of migrationFiles) {
		const sql = await Deno.readTextFile(`${migrationsDir}/${file.name}`);
		console.log(`Executing migration: ${file.name}`);
		await query(sql);
	}

	console.log("All migrations applied!");
}
