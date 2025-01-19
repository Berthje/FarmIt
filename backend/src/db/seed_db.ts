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
    ),
    numbered_users AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY id) as user_num
      FROM users
    ),
    auction_data AS (
      SELECT
        u.id as seller_id,
        c.id as crop_id,
        c.base_price as base_price,
        d.duration,
        ROW_NUMBER() OVER (ORDER BY c.id, d.duration) as rn
      FROM numbered_users u
      CROSS JOIN crops c
      CROSS JOIN durations d
      WHERE c.rarity IN ('rare', 'epic')
    )
    INSERT INTO auctions (
      seller_id,
      item_type,
      item_id,
      current_bid,
      min_bid,
      reserve_price,
      buy_now_price,
      ends_at
    )
    SELECT
      seller_id,
      'crops',
      crop_id,
      base_price,              -- Starting bid
      base_price,              -- Min bid
      base_price * 2,          -- Reserve price
      base_price * 3,          -- Buy now price
      CURRENT_TIMESTAMP + duration
    FROM auction_data
    WHERE rn <= 6
    ON CONFLICT DO NOTHING
  `);
}

async function seedAuctionBids() {
  await query(`
    WITH RECURSIVE bid_sequence AS (
      SELECT 1 as seq
      UNION ALL
      SELECT seq + 1 FROM bid_sequence WHERE seq < 3
    ),
    valid_bidders AS (
      SELECT
        a.id as auction_id,
        u.id as bidder_id,
        a.current_bid as base_bid
      FROM auctions a
      CROSS JOIN users u
      WHERE u.id != a.seller_id
      AND a.ends_at > CURRENT_TIMESTAMP
    )
    INSERT INTO auction_bids (auction_id, bidder_id, bid_amount, created_at)
    SELECT
      auction_id,
      bidder_id,
      (base_bid + (seq * 50)),
      CURRENT_TIMESTAMP - INTERVAL '1 hour' * (3 - seq)
    FROM valid_bidders
    CROSS JOIN bid_sequence
    ORDER BY auction_id, seq
    ON CONFLICT DO NOTHING
  `);

  await query(`
    UPDATE auctions a
    SET current_bid = (
      SELECT MAX(bid_amount)
      FROM auction_bids ab
      WHERE ab.auction_id = a.id
    )
    WHERE EXISTS (
      SELECT 1 FROM auction_bids ab
      WHERE ab.auction_id = a.id
    )
  `);
}

export async function seedDatabase() {
  console.log("Seeding database...");

  await seedUsers();
  await seedPlayerStats();
  await seedTools();
  await seedCrops();
  await seedInventory();
  await seedMarketListings();
  await seedAuctions();
  await seedAuctionBids();

  console.log("Database seeded with initial data!");
}
