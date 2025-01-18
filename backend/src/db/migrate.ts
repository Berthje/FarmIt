import { query } from "./db.ts";
import { resolve } from "https://deno.land/std@0.203.0/path/mod.ts";

export async function runMigrations() {
	console.log("Running migrations...");

	const migrationsDir = resolve("./src/db/migrations/");
	const migrationFiles: string[] = [];

	for await (const file of Deno.readDir(migrationsDir)) {
		if (file.isFile && file.name.endsWith(".sql")) {
			migrationFiles.push(`${migrationsDir}/${file.name}`);
		}
	}

	const tableNames = migrationFiles
		.filter((file) => file.toLowerCase().includes("create_") && file.toLowerCase().includes("_table"))
		.map((file) => {
			const match = file.match(/create_(.+?)_table/i);
			return match && match[1] ? match[1].toLowerCase() : null;
		})
		.filter(Boolean);

	if (tableNames.length > 0) {
		console.log("Dropping existing tables...");
		const dropQuery = `DROP TABLE IF EXISTS ${tableNames.join(", ")} CASCADE;`;
		await query(dropQuery);
	}

	migrationFiles.sort();

	for (const migration of migrationFiles) {
		const sql = await Deno.readTextFile(migration);
		await query(sql);
		console.log(`Executed migration: ${migration}`);
	}

	console.log("All migrations applied!");
}

if (import.meta.main) {
	await runMigrations();
}
