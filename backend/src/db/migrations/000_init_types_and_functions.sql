-- Drop all types first
DROP TYPE IF EXISTS item_type_enum CASCADE;
DROP TYPE IF EXISTS rarity_enum CASCADE;
DROP TYPE IF EXISTS season_enum CASCADE;
DROP TYPE IF EXISTS plot_type_enum CASCADE;
DROP TYPE IF EXISTS structure_type_enum CASCADE;

-- Create ENUM types
CREATE TYPE item_type_enum AS ENUM ('crops', 'tools');
CREATE TYPE rarity_enum AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE season_enum AS ENUM ('spring', 'summer', 'fall', 'winter');
CREATE TYPE plot_type_enum AS ENUM ('locked', 'grass', 'farmland', 'tree', 'structure');
CREATE TYPE structure_type_enum AS ENUM ('house', 'barn', 'silo', 'well', 'fence', 'path', 'decoration');

-- Common validation functions
CREATE OR REPLACE FUNCTION validate_item_exists(item_type item_type_enum, item_id integer)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN CASE item_type
    WHEN 'crops' THEN EXISTS(SELECT 1 FROM crops WHERE id = item_id)
    WHEN 'tools' THEN EXISTS(SELECT 1 FROM tools WHERE id = item_id)
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
  p_season VARCHAR
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

-- Farm plot validation
CREATE OR REPLACE FUNCTION validate_farm_plot(
  p_x_coord INTEGER,
  p_y_coord INTEGER,
  p_growth_stage INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  IF p_x_coord < 0 OR p_x_coord >= 100 OR p_y_coord < 0 OR p_y_coord >= 100 THEN
    RAISE EXCEPTION 'Invalid coordinates (must be 0-99)';
  END IF;
  IF p_growth_stage < 0 THEN
    RAISE EXCEPTION 'Growth stage cannot be negative';
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

-- World Functions
CREATE OR REPLACE FUNCTION update_farm_plot_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farm_plot_timestamp
    BEFORE UPDATE ON farm_plots
    FOR EACH ROW
    EXECUTE FUNCTION update_farm_plot_timestamp();
    
CREATE OR REPLACE FUNCTION initialize_user_world(p_user_id INTEGER)
RETURNS VOID AS $$
DECLARE
    x INTEGER;
    y INTEGER;
BEGIN
    -- Create 100x100 grid
    FOR x IN 0..99 LOOP
        FOR y IN 0..99 LOOP
            INSERT INTO farm_plots (
                user_id,
                x_coord,
                y_coord,
                plot_type
            ) VALUES (
                p_user_id,
                x,
                y,
                CASE
                    WHEN x < 10 AND y < 10 THEN 'grass'  -- Initial 10x10 area
                    ELSE 'locked'                        -- Locked plots
                END
            );
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_user_world()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM initialize_user_world(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_created
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_world();
