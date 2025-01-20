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

async function seedToolbarSlots() {
	await query(`
    WITH valid_tools AS (
      SELECT id FROM tools
    ),
    valid_plantables AS (
      SELECT id FROM plantables
    ),
    valid_harvested_crops AS (
      SELECT id FROM harvested_crops
    ),
    toolbar_data AS (
      SELECT
        user_id, slot_index, item_type, item_id,
        CASE
          WHEN item_type = 'tool' AND EXISTS (SELECT 1 FROM valid_tools WHERE id = item_id) THEN true
          WHEN item_type = 'plantable' AND EXISTS (SELECT 1 FROM valid_plantables WHERE id = item_id) THEN true
          WHEN item_type = 'harvested_crop' AND EXISTS (SELECT 1 FROM valid_harvested_crops WHERE id = item_id) THEN true
          ELSE false
        END as is_valid
      FROM (VALUES
        (1, 0, 'tool'::item_type_enum, 1),
        (1, 1, 'plantable'::item_type_enum, 1),
        (1, 2, 'tool'::item_type_enum, 2),
        (2, 0, 'plantable'::item_type_enum, 2),
        (2, 1, 'harvested_crop'::item_type_enum, 1),
        (2, 2, 'plantable'::item_type_enum, 3)
      ) as t(user_id, slot_index, item_type, item_id)
    )
    INSERT INTO toolbar_slots
      (user_id, slot_index, item_type, item_id, created_at, updated_at)
    SELECT
      user_id, slot_index, item_type, item_id,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM toolbar_data
    WHERE is_valid = true
    ON CONFLICT (user_id, slot_index)
    DO UPDATE SET
      item_type = EXCLUDED.item_type,
      item_id = EXCLUDED.item_id,
      updated_at = CURRENT_TIMESTAMP
  `);
}

async function seedPlantables() {
	await query(`
    INSERT INTO plantables (
      name,
      category,
      growth_time,
      grow_seasons,
      base_price,
      harvest_min,
      harvest_max,
      properties
    ) VALUES
    ('Beetroot Seeds', 'vegetable', 120, ARRAY['summer','fall']::season_enum[], 15, 1, 2, '{"water_needs": "medium"}'),
    ('Carrot Seeds', 'vegetable', 100, ARRAY['spring','fall']::season_enum[], 12, 1, 3, '{"water_needs": "medium"}'),
    ('Garlic Seeds', 'vegetable', 90, ARRAY['spring']::season_enum[], 18, 1, 1, '{"water_needs": "low"}'),
    ('Gingeroot Seeds', 'vegetable', 150, ARRAY['summer']::season_enum[], 25, 1, 2, '{"water_needs": "high"}'),
    ('Kohlrabi Seeds', 'vegetable', 110, ARRAY['spring','fall']::season_enum[], 20, 1, 2, '{"water_needs": "medium"}'),
    ('Onion Seeds', 'vegetable', 100, ARRAY['spring','summer']::season_enum[], 10, 1, 2, '{"water_needs": "medium"}'),
    ('Parsnip Seeds', 'vegetable', 95, ARRAY['fall']::season_enum[], 15, 1, 2, '{"water_needs": "medium"}'),
    ('Potato Seeds', 'vegetable', 140, ARRAY['spring','summer']::season_enum[], 20, 2, 4, '{"water_needs": "medium"}'),
    ('Purple Yam Seeds', 'vegetable', 160, ARRAY['summer']::season_enum[], 30, 1, 2, '{"water_needs": "high"}'),
    ('Radish Seeds', 'vegetable', 70, ARRAY['spring','summer','fall']::season_enum[], 8, 1, 3, '{"water_needs": "medium"}'),
    ('Sweet Potato Seeds', 'vegetable', 150, ARRAY['summer','fall']::season_enum[], 25, 2, 3, '{"water_needs": "medium"}'),
    ('Turnip Seeds', 'vegetable', 85, ARRAY['spring','fall']::season_enum[], 12, 1, 2, '{"water_needs": "medium"}')
    ON CONFLICT DO NOTHING
  `);
}

async function seedHarvestedCrops() {
	await query(`
    INSERT INTO harvested_crops (name, plantable_id, base_price)
    SELECT
      REPLACE(name, ' Seeds', ''),
      id as plantable_id,
      base_price * 1.5
    FROM plantables
    ON CONFLICT DO NOTHING
  `);
}

async function seedPlantedCrops() {
	await query(`
    INSERT INTO planted_crops
    (tile_id, plantable_id, planted_at, last_watered_at, growth_stage, health, properties)
    VALUES
    -- Carrot patch (early stage)
    (1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '12 hours', 1, 100,
    '{"type": "vegetable", "needs_water": false}'::jsonb),

    -- Wheat field (mid growth)
    (2, 2, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', 2, 90,
    '{"type": "grain", "needs_water": true}'::jsonb),

    -- Apple tree (mature)
    (3, 3, NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', 4, 95,
    '{"type": "tree", "fruit_count": 5}'::jsonb),

    -- Tomato plant (ready for harvest)
    (4, 4, NOW() - INTERVAL '6 days', NOW() - INTERVAL '8 hours', 4, 100,
    '{"type": "vegetable", "ready_to_harvest": true}'::jsonb),

    -- Potato plant (needs care)
    (5, 5, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 1, 50,
    '{"type": "vegetable", "needs_water": true}'::jsonb)
  `);
}

async function seedInventory() {
	await query(`
    INSERT INTO inventory (user_id, item_type, item_id, quantity)
    SELECT
      u.id,
      'plantable'::item_type_enum,
      p.id,
      10
    FROM users u
    CROSS JOIN plantables p
    WHERE p.rarity = 'common'
    ON CONFLICT DO NOTHING
  `);
}

async function seedMarketListings() {
	await query(`
    INSERT INTO market_listings (seller_id, item_type, item_id, quantity, price_per_unit)
    SELECT
      u.id,
      'plantable'::item_type_enum,
      p.id,
      5,
      p.base_price * 2
    FROM users u
    CROSS JOIN plantables p
    WHERE p.rarity = 'common'
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
        p.id as plantable_id,
        p.base_price as base_price,
        d.duration,
        ROW_NUMBER() OVER (ORDER BY p.id, d.duration) as rn
      FROM numbered_users u
      CROSS JOIN plantables p
      CROSS JOIN durations d
      WHERE p.rarity IN ('rare', 'epic')
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
      'plantable'::item_type_enum,
      plantable_id,
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
	await seedPlantables();
	await seedHarvestedCrops();
	await seedPlantedCrops();
	await seedInventory();
	await seedMarketListings();
	await seedAuctions();
	await seedAuctionBids();
	await seedToolbarSlots();

	console.log("Database seeded with initial data!");
}
