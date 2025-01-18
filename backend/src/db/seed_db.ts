import { query } from "./db.ts";

async function seedUsers() {
	await query(`
    INSERT INTO users (username, email, password_hash) VALUES
    ('farmer_john', 'john@farm.com', 'hash1'),
    ('crop_master', 'master@farm.com', 'hash2'),
    ('garden_guru', 'guru@farm.com', 'hash3')
    ON CONFLICT DO NOTHING
    RETURNING id
  `);
}

async function seedPlayerStats() {
	await query(`
    INSERT INTO player_stats (user_id, level, experience, coins)
    SELECT id, 1, 0, 1000 FROM users
    ON CONFLICT DO NOTHING
  `);
}

async function seedTools() {
	await query(`
    INSERT INTO tools (name, durability, rarity, base_price) VALUES
    ('Basic Hoe', 100, 'common', 50),
    ('Watering Can', 150, 'common', 75),
    ('Golden Scythe', 500, 'rare', 300),
    ('Magic Shears', 1000, 'epic', 1000)
    ON CONFLICT DO NOTHING
  `);
}

async function seedCrops() {
	await query(`
    INSERT INTO crops (name, growth_time, season, rarity, base_price) VALUES
    ('Wheat', 120, 'summer', 'common', 10),
    ('Corn', 180, 'summer', 'common', 15),
    ('Tomato', 240, 'summer', 'common', 20),
    ('Golden Apple', 480, 'fall', 'rare', 100),
    ('Magic Bean', 360, 'spring', 'epic', 200)
    ON CONFLICT DO NOTHING
  `);
}

async function seedFarmPlots() {
	await query(`
    INSERT INTO farm_plots (user_id, x_coord, y_coord)
    SELECT
      u.id,
      x.coord,
      y.coord
    FROM users u
    CROSS JOIN generate_series(0, 3) AS x(coord)
    CROSS JOIN generate_series(0, 3) AS y(coord)
    ON CONFLICT DO NOTHING
  `);
}

async function seedInventory() {
	await query(`
    INSERT INTO inventory (user_id, item_type, item_id, quantity)
    SELECT
      u.id,
      'crops',
      c.id,
      10
    FROM users u
    CROSS JOIN crops c
    WHERE c.rarity = 'common'
    ON CONFLICT DO NOTHING
  `);
}

async function seedMarketListings() {
	await query(`
    INSERT INTO market_listings (seller_id, item_type, item_id, quantity, price_per_unit)
    SELECT
      u.id,
      'crops',
      c.id,
      5,
      c.base_price * 2
    FROM users u
    CROSS JOIN crops c
    WHERE c.rarity = 'common'
    LIMIT 5
    ON CONFLICT DO NOTHING
  `);
}

async function seedAuctions() {
	await query(`
    WITH durations AS (
      SELECT unnest(ARRAY[
        INTERVAL '8 hours',
        INTERVAL '24 hours',
        INTERVAL '3 days'
      ]) as duration
    )
    INSERT INTO auctions (seller_id, item_type, item_id, current_bid, ends_at)
    SELECT
      u.id,
      'crops',
      c.id,
      c.base_price,
      CURRENT_TIMESTAMP + d.duration
    FROM users u
    CROSS JOIN crops c
    CROSS JOIN durations d
    WHERE c.rarity IN ('rare', 'epic')
    LIMIT 6
    ON CONFLICT DO NOTHING
  `);
}

export async function seedDatabase() {
	console.log("Seeding database...");

	await seedUsers();
	await seedPlayerStats();
	await seedTools();
	await seedCrops();
	await seedFarmPlots();
	await seedInventory();
	await seedMarketListings();
	await seedAuctions();

	console.log("Database seeded with initial data!");
}
