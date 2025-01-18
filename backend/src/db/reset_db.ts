import { Pool } from "@x/postgres";
import { runMigrations } from "./migrate.ts";
import { seedDatabase } from "./seed_db.ts";

async function resetDatabase() {
  const dbName = Deno.env.get("DB_NAME") || "farmit";

  // Connect to postgres first
  const adminPool = new Pool({
    user: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASSWORD"),
    hostname: Deno.env.get("DB_HOST"),
    port: parseInt(Deno.env.get("DB_PORT") || "5432"),
    database: "postgres", // Important: Connect to postgres db first
  }, 1);

  try {
    const client = await adminPool.connect();
    try {
      // Drop if exists with force
      console.log(`Ensuring clean database state...`);
      await client.queryObject(`
        DROP DATABASE IF EXISTS ${dbName} WITH (FORCE)
      `);

      // Create fresh
      console.log(`Creating database ${dbName}...`);
      await client.queryObject(`
        CREATE DATABASE ${dbName}
      `);
    } finally {
      await client.release();
      await adminPool.end();
    }

    // Wait a moment for DB to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Now connect to the new database
    const appPool = new Pool({
      user: Deno.env.get("DB_USER"),
      password: Deno.env.get("DB_PASSWORD"),
      hostname: Deno.env.get("DB_HOST"),
      port: parseInt(Deno.env.get("DB_PORT") || "5432"),
      database: dbName,
    }, 1);

    try {
      await runMigrations();
      await seedDatabase();
      console.log("Database reset complete!");
    } finally {
      await appPool.end();
    }

  } catch (error) {
    console.error("Error resetting database:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  resetDatabase();
}
