import { query } from "./db.ts";

async function seedUsers() {
  await query(`
    INSERT INTO users (username, email, password_hash)
    VALUES ('usertest', 'usertest@example.com', 'hashed_password')
    ON CONFLICT DO NOTHING;
  `);
}

async function seedGameData() {
  await query(`
    INSERT INTO game_data (user_id, score, level)
    VALUES (1, 100, 1)
    ON CONFLICT DO NOTHING;
  `);
}

export async function seedDatabase() {
  console.log("Seeding database...");

  await seedUsers();
  await seedGameData();

  console.log("Database seeded with initial data!");
}
