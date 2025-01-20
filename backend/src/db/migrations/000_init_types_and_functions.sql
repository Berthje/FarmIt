-- Drop all types first
DROP TYPE IF EXISTS item_type_enum CASCADE;
DROP TYPE IF EXISTS rarity_enum CASCADE;
DROP TYPE IF EXISTS season_enum CASCADE;
DROP TYPE IF EXISTS plantable_category_enum CASCADE;
DROP TYPE IF EXISTS terrain_type_enum CASCADE;

-- Create ENUM types
CREATE TYPE item_type_enum AS ENUM ('plantable', 'tool', 'harvested_crop');
CREATE TYPE rarity_enum AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE season_enum AS ENUM ('spring', 'summer', 'fall', 'winter');
CREATE TYPE plantable_category_enum AS ENUM ('vegetable', 'grain'); -- Future: 'tree', 'fruit', 'flower', 'magical'
CREATE TYPE terrain_type_enum AS ENUM ('grass', 'stone', 'tree_sticks', 'tree_residue');

-- Common validation functions
CREATE OR REPLACE FUNCTION validate_item_exists(item_type item_type_enum, item_id integer)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN CASE item_type
    WHEN 'plantable' THEN EXISTS (
        SELECT 1
        FROM plantables
        WHERE
            id = item_id
    )
    WHEN 'tool' THEN EXISTS (
        SELECT 1
        FROM tools
        WHERE
            id = item_id
    )
    WHEN 'harvested_crop' THEN EXISTS (
        SELECT 1
        FROM harvested_crops
        WHERE
            id = item_id
    )
END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_initial_world(p_user_id INTEGER)
RETURNS VOID AS $$
DECLARE
  new_world_id INTEGER;
  random_value FLOAT;
  terrain terrain_type_enum;
  target_obstacles INTEGER;
  obstacle_count INTEGER := 0;
  starting_area_tiles terrain_type_enum[100];
  i INTEGER;
BEGIN
  -- Create world entry
  INSERT INTO worlds (user_id) VALUES (p_user_id) RETURNING id INTO new_world_id;

  -- Determine target number of obstacles (3-7)
  target_obstacles := 3 + floor(random() * 5)::INTEGER;

  -- Initialize starting area with grass
  FOR i IN 0..99 LOOP
    starting_area_tiles[i] := 'grass'::terrain_type_enum;
  END LOOP;

  -- Add exactly target_obstacles number of obstacles
  WHILE obstacle_count < target_obstacles LOOP
    i := floor(random() * 36)::INTEGER;
    IF starting_area_tiles[i] = 'grass' THEN
      starting_area_tiles[i] := 'tree_sticks'::terrain_type_enum;
      obstacle_count := obstacle_count + 1;
    END IF;
  END LOOP;

  -- Fill 100x100 grid
  FOR x IN 0..99 LOOP
    FOR y IN 0..99 LOOP
      IF (x BETWEEN 45 AND 54 AND y BETWEEN 45 AND 54) THEN
        terrain := starting_area_tiles[(y - 45) * 10 + (x - 45)];
      ELSE
        random_value := random();
        terrain := CASE
          WHEN random_value < 0.65 THEN 'grass'::terrain_type_enum
          WHEN random_value < 0.80 THEN 'tree_sticks'::terrain_type_enum
          WHEN random_value < 0.925 THEN 'tree_residue'::terrain_type_enum
          ELSE 'stone'::terrain_type_enum
        END;
      END IF;

      INSERT INTO
    world_tiles (
        world_id,
        x_coord,
        y_coord,
        locked,
        terrain_type,
        purchase_price
    )
VALUES (
        new_world_id,
        x,
        y,
        NOT (
            x BETWEEN 47 AND 52
            AND y BETWEEN 47 AND 52
        ),
        terrain,
        CASE
            WHEN x BETWEEN 47 AND 52
            AND y BETWEEN 47 AND 52  THEN 0 -- Initial area is free
            ELSE (
                CASE -- Base prices for different zones
                    WHEN x BETWEEN 42 AND 57
                    AND y BETWEEN 42 AND 57  THEN 50 -- First tier
                    WHEN x BETWEEN 37 AND 62
                    AND y BETWEEN 37 AND 62  THEN 150 -- Second tier
                    WHEN x BETWEEN 32 AND 67
                    AND y BETWEEN 32 AND 67  THEN 300 -- Third tier
                    WHEN x BETWEEN 27 AND 72
                    AND y BETWEEN 27 AND 72  THEN 600 -- Fourth tier
                    WHEN x BETWEEN 22 AND 77
                    AND y BETWEEN 22 AND 77  THEN 1200 -- Fifth tier
                    WHEN x BETWEEN 17 AND 82
                    AND y BETWEEN 17 AND 82  THEN 2400 -- Sixth tier
                    ELSE 4000 -- Outer tier
                END
            )
        END
    );
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- World validation
CREATE OR REPLACE FUNCTION validate_world(
  p_dimension_x INTEGER,
  p_dimension_y INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_dimension_x <= 0 OR p_dimension_y <= 0 THEN
    RAISE EXCEPTION 'World dimensions must be positive';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

/* Validate world tiles */
CREATE OR REPLACE FUNCTION validate_world_tile(
  p_x_coord INTEGER,
  p_y_coord INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_x_coord < 0 OR p_y_coord < 0 THEN
    RAISE EXCEPTION 'Tile coordinates must be non-negative';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- World Tile Calculation
CREATE OR REPLACE FUNCTION calculate_tile_price(p_world_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    owned_tiles INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO owned_tiles
    FROM world_tiles
    WHERE world_id = p_world_id
    AND locked = false;

    RETURN CASE
        WHEN owned_tiles < 100 THEN 0           -- Initial 10x10 grid (free)
        WHEN owned_tiles < 250 THEN 50         -- First tier
        WHEN owned_tiles < 500 THEN 150        -- Second tier
        WHEN owned_tiles < 1000 THEN 300       -- Third tier
        WHEN owned_tiles < 2500 THEN 600       -- Fourth tier
        WHEN owned_tiles < 5000 THEN 1200      -- Fifth tier
        WHEN owned_tiles < 7500 THEN 2400      -- Sixth tier
        ELSE 4000                              -- Final tier
    END;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if tile is adjacent to an unlocked tile
CREATE OR REPLACE FUNCTION is_adjacent_to_unlocked(
    p_world_id INTEGER,
    p_x_coord INTEGER,
    p_y_coord INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    has_adjacent BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1
        FROM world_tiles
        WHERE world_id = p_world_id
        AND locked = false
        AND (
            -- Check all 8 adjacent tiles
            (x_coord = p_x_coord - 1 AND y_coord = p_y_coord) OR     -- Left
            (x_coord = p_x_coord + 1 AND y_coord = p_y_coord) OR     -- Right
            (x_coord = p_x_coord AND y_coord = p_y_coord - 1) OR     -- Up
            (x_coord = p_x_coord AND y_coord = p_y_coord + 1) OR     -- Down
            (x_coord = p_x_coord - 1 AND y_coord = p_y_coord - 1) OR -- Top Left
            (x_coord = p_x_coord + 1 AND y_coord = p_y_coord - 1) OR -- Top Right
            (x_coord = p_x_coord - 1 AND y_coord = p_y_coord + 1) OR -- Bottom Left
            (x_coord = p_x_coord + 1 AND y_coord = p_y_coord + 1)    -- Bottom Right
        )
    ) INTO has_adjacent;

    RETURN has_adjacent;
END;
$$ LANGUAGE plpgsql;

-- Function to unlock tile
CREATE OR REPLACE FUNCTION unlock_tile(
    p_world_id INTEGER,
    p_x_coord INTEGER,
    p_y_coord INTEGER,
    p_user_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    tile_price INTEGER;
    user_coins INTEGER;
BEGIN
    IF NOT is_adjacent_to_unlocked(p_world_id, p_x_coord, p_y_coord) THEN
        RETURN FALSE;
    END IF;

    tile_price := calculate_tile_price(p_world_id);

    SELECT coins INTO user_coins
    FROM player_stats
    WHERE user_id = p_user_id;

    IF user_coins < tile_price THEN
        RETURN FALSE;
    END IF;

    BEGIN
        -- Deduct coins
        UPDATE player_stats
        SET coins = coins - tile_price
        WHERE user_id = p_user_id;

        -- Unlock and record purchase
        UPDATE world_tiles
        SET locked = false,
            purchase_price = tile_price,
            purchased_at = CURRENT_TIMESTAMP
        WHERE world_id = p_world_id
        AND x_coord = p_x_coord
        AND y_coord = p_y_coord;

        RETURN TRUE;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- Users validation
CREATE OR REPLACE FUNCTION validate_user(
  p_username VARCHAR,
  p_email VARCHAR
) RETURNS BOOLEAN AS $$
BEGIN
  IF LENGTH(p_username) < 3 THEN
    RAISE EXCEPTION 'Username must be at least 3 characters long';
  END IF;
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Player stats validation
CREATE OR REPLACE FUNCTION validate_player_stats(
  p_level INTEGER,
  p_experience BIGINT,
  p_coins BIGINT
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_level <= 0 THEN
    RAISE EXCEPTION 'Level must be positive';
  END IF;
  IF p_experience < 0 THEN
    RAISE EXCEPTION 'Experience cannot be negative';
  END IF;
  IF p_coins < 0 THEN
    RAISE EXCEPTION 'Coins cannot be negative';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Crop validation
CREATE OR REPLACE FUNCTION validate_crop(
  p_growth_time INTEGER,
  p_base_price INTEGER,
  p_season season_enum
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_growth_time <= 0 THEN
    RAISE EXCEPTION 'Growth time must be positive';
  END IF;
  IF p_base_price <= 0 THEN
    RAISE EXCEPTION 'Base price must be positive';
  END IF;
  IF p_season NOT IN ('spring', 'summer', 'fall', 'winter') THEN
    RAISE EXCEPTION 'Invalid season';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Tool validation
CREATE OR REPLACE FUNCTION validate_tool(
  p_durability INTEGER,
  p_base_price INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_durability <= 0 THEN
    RAISE EXCEPTION 'Tool durability must be positive';
  END IF;
  IF p_base_price <= 0 THEN
    RAISE EXCEPTION 'Tool base price must be positive';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Market listing validation
CREATE OR REPLACE FUNCTION validate_market_listing(
  p_quantity INTEGER,
  p_price_per_unit INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;
  IF p_price_per_unit <= 0 THEN
    RAISE EXCEPTION 'Price must be positive';
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Auction validation
CREATE OR REPLACE FUNCTION validate_auction(
  p_current_bid INTEGER,
  p_min_bid INTEGER,
  p_reserve_price INTEGER,
  p_buy_now_price INTEGER,
  p_ends_at TIMESTAMP
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_current_bid < 0 THEN
    RAISE EXCEPTION 'Current bid cannot be negative';
  END IF;

  IF p_min_bid <= 0 THEN
    RAISE EXCEPTION 'Minimum bid must be positive';
  END IF;

  IF p_reserve_price IS NOT NULL AND p_reserve_price <= p_min_bid THEN
    RAISE EXCEPTION 'Reserve price must be higher than minimum bid';
  END IF;

  IF p_buy_now_price IS NOT NULL THEN
    IF p_buy_now_price <= p_min_bid THEN
      RAISE EXCEPTION 'Buy now price must be higher than minimum bid';
    END IF;
    IF p_reserve_price IS NOT NULL AND p_buy_now_price <= p_reserve_price THEN
      RAISE EXCEPTION 'Buy now price must be higher than reserve price';
    END IF;
  END IF;

  IF p_ends_at <= CURRENT_TIMESTAMP THEN
    RAISE EXCEPTION 'End time must be in the future';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Plantable validation
CREATE OR REPLACE FUNCTION validate_plant(
    p_growth_time INTEGER,
    p_base_price INTEGER,
    p_harvest_min INTEGER,
    p_harvest_max INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    IF p_growth_time <= 0 THEN
        RAISE EXCEPTION 'Growth time must be positive';
    END IF;

    IF p_base_price <= 0 THEN
        RAISE EXCEPTION 'Base price must be positive';
    END IF;

    IF p_harvest_min < 1 THEN
        RAISE EXCEPTION 'Minimum harvest must be at least 1';
    END IF;

    IF p_harvest_max < p_harvest_min THEN
        RAISE EXCEPTION 'Maximum harvest must be greater than or equal to minimum harvest';
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
