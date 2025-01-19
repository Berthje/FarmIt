import { query } from "./db.ts";

async function seedUsers() {
    await query(`
    INSERT INTO users (username, email, password_hash) VALUES
    ('farmer_john', 'john@farm.com', 'hash1'),
    ('crop_master', 'master@farm.com', 'hash2'),
    ('garden_guru', 'guru@farm.com', 'hash3')
    ON CONFLICT DO NOTHING
  `);
}

async function seedPlayerStats() {
    await query(`
    INSERT INTO player_stats (user_id, level, experience, coins)
    SELECT id, 1, 0, 1000 FROM users
    ON CONFLICT DO NOTHING
  `);
}

async function seedPlotPrices() {
    await query(`
    INSERT INTO plot_prices
    (plots_owned_range_start, plots_owned_range_end, base_price, multiplier)
    VALUES
    (0, 100, 100, 1.00),     -- First 100 plots: 100 coins
    (101, 200, 150, 1.25),   -- Next 100: 187 coins each
    (201, 300, 200, 1.50),   -- Next 100: 300 coins each
    (301, 400, 250, 1.75),   -- Next 100: 437 coins each
    (401, 500, 300, 2.00)    -- Final 100: 600 coins each
    ON CONFLICT DO NOTHING
  `);
}

async function seedFarmPlots() {
    await query(`
    WITH user_plots AS (
      SELECT
        u.id as user_id,
        x.coord as x_coord,
        y.coord as y_coord,
        CASE
          WHEN x.coord < 10 AND y.coord < 10 THEN 'grass'::plot_type_enum
          ELSE 'locked'::plot_type_enum
        END as plot_type,
        CASE
          WHEN x.coord < 10 AND y.coord < 10 THEN CURRENT_TIMESTAMP
          ELSE NULL
        END as purchase_date,
        CASE
          WHEN x.coord < 10 AND y.coord < 10 THEN 100
          ELSE NULL
        END as purchase_price
      FROM users u
      CROSS JOIN generate_series(0, 99) AS x(coord)
      CROSS JOIN generate_series(0, 99) AS y(coord)
    )
    INSERT INTO farm_plots (
      user_id,
      x_coord,
      y_coord,
      plot_type,
      purchase_date,
      purchase_price
    )
    SELECT
      user_id,
      x_coord,
      y_coord,
      plot_type,
      purchase_date,
      purchase_price
    FROM user_plots
    ON CONFLICT DO NOTHING
  `);
}

async function seedTools() {
    await query(`
    INSERT INTO tools (name, durability, rarity, base_price) VALUES
    ('Basic Hoe', 100, 'common', 50),
    ('Watering Can', 150, 'common', 75)
    ON CONFLICT DO NOTHING
  `);
}

async function seedCrops() {
    await query(`
    INSERT INTO crops (name, growth_time, season, rarity, base_price) VALUES
    ('Carrot', 60, 'spring', 'common', 10),
    ('Potato', 90, 'spring', 'common', 15),
    ('Turnip', 45, 'spring', 'common', 8),
    ('Corn', 120, 'summer', 'common', 20),
    ('Tomato', 90, 'summer', 'common', 18),
    ('Pumpkin', 180, 'fall', 'common', 30),
    ('Sweet Potato', 120, 'fall', 'uncommon', 45),
    ('Purple Yam', 150, 'fall', 'uncommon', 55)
    ON CONFLICT DO NOTHING
  `);
}

async function seedInitialInventory() {
    await query(`
    -- Give each user basic tools to start
    INSERT INTO inventory (user_id, item_type, item_id, quantity)
    SELECT
      u.id,
      'tools',
      t.id,
      1
    FROM users u
    CROSS JOIN tools t
    WHERE t.rarity = 'common'
    ON CONFLICT DO NOTHING;

    -- Give each user some starter crops
    INSERT INTO inventory (user_id, item_type, item_id, quantity)
    SELECT
      u.id,
      'crops',
      c.id,
      10
    FROM users u
    CROSS JOIN crops c
    WHERE c.rarity = 'common'
    AND c.season = 'spring'
    ON CONFLICT DO NOTHING;
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
      base_price,
      base_price,
      base_price * 2,
      base_price * 3,
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
    await seedPlotPrices();
    await seedFarmPlots();
    await seedCrops();
    await seedTools();
    await seedInitialInventory();
    await seedMarketListings();
    await seedAuctions();
    await seedAuctionBids();

    console.log("Database seeded with initial data!");
}
