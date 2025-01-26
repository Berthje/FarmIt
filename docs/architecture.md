# Architecture Documentation

## 1. System Overview

### Tech Stack

- **Backend**: Deno with Oak framework
- **Database**: PostgreSQL
- **Frontend**: React with TailwindCSS
- **API Design**: Follows RESTful principles, ensuring a stateless communication
  between client and server.

---

## 2. Database Schema Details

### Enums

- **item_type_enum**: ('plantable', 'tool')
- **rarity_enum**: ('common', 'uncommon', 'rare', 'epic', 'legendary')
- **season_enum**: ('spring', 'summer', 'fall', 'winter')
- **plantable_category_enum**: ('vegetable', 'grain')

### Tables

#### users

- `id`: SERIAL PRIMARY KEY (unique identifier)
- `username`: VARCHAR(50) UNIQUE (player's unique name)
- `email`: VARCHAR(100) UNIQUE (contact/login)
- `password_hash`: VARCHAR(200) (secured password)
- `oauth_provider`: VARCHAR(50) (external auth provider)
- `oauth_id`: VARCHAR(100) (external auth ID)
- `created_at`: TIMESTAMP (account creation time)

#### player_stats

- `user_id`: INTEGER PK/FK (links to users)
- `level`: INTEGER DEFAULT 1 (player progression)
- `experience`: BIGINT DEFAULT 0 (accumulated XP)
- `coins`: BIGINT DEFAULT 0 (in-game currency)

#### tools

- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(50) (tool name)
- `durability`: INTEGER (usage limit)
- `rarity`: rarity_enum (tool tier)
- `base_price`: INTEGER (shop price)

#### inventory

- `id`: SERIAL PRIMARY KEY
- `user_id`: INTEGER FK (item owner)
- `item_type`: item_type_enum (crops/tools)
- `item_id`: INTEGER (specific item)
- `quantity`: INTEGER (stack size)
- `created_at`: TIMESTAMP (acquisition time)

#### market_listings

- `id`: SERIAL PRIMARY KEY
- `seller_id`: INTEGER FK (seller)
- `item_type`: item_type_enum (listing type)
- `item_id`: INTEGER (specific item)
- `quantity`: INTEGER (amount for sale)
- `price_per_unit`: INTEGER (cost per item)
- `created_at`: TIMESTAMP (listing time)

#### auctions

- `id`: SERIAL PRIMARY KEY
- `seller_id`: INTEGER FK (auctioneer)
- `item_type`: item_type_enum (auction type)
- `item_id`: INTEGER (auctioned item)
- `current_bid`: INTEGER (highest bid)
- `min_bid`: INTEGER (starting price)
- `reserve_price`: INTEGER (hidden minimum)
- `buy_now_price`: INTEGER (instant purchase)
- `ends_at`: TIMESTAMP (auction end)
- `created_at`: TIMESTAMP (start time)

#### auction_bids

- `id`: SERIAL PRIMARY KEY
- `auction_id`: INTEGER FK (auction reference)
- `bidder_id`: INTEGER FK (bidder)
- `bid_amount`: INTEGER (bid value)
- `created_at`: TIMESTAMP (bid time)

#### worlds

- `id`: SERIAL PRIMARY KEY
- `user_id`: INTEGER FK (references users)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `last_visited`: TIMESTAMP WITH TIME ZONE

#### world_tiles

- `id`: SERIAL PRIMARY KEY
- `world_id`: INTEGER FK (references worlds)
- `x_coord`: INTEGER NOT NULL
- `y_coord`: INTEGER NOT NULL
- `locked`: BOOLEAN DEFAULT TRUE
- `terrain_type`: VARCHAR(50) DEFAULT 'grass'

#### plantables

- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(50) (plant name)
- `category`: plantable_category_enum
- `growth_time`: INTEGER (minutes to mature)
- `seasons`: season_enum[] (valid growing seasons)
- `rarity`: rarity_enum
- `base_price`: INTEGER
- `harvest_min`: INTEGER
- `harvest_max`: INTEGER
- `regrows`: BOOLEAN
- `regrow_time`: INTEGER
- `properties`: JSONB

#### planted_crops

- `id`: SERIAL PRIMARY KEY
- `tile_id`: INTEGER FK (references world_tiles)
- `plantable_id`: INTEGER FK (references plantables)
- `planted_at`: TIMESTAMP WITH TIME ZONE
- `last_watered_at`: TIMESTAMP WITH TIME ZONE
- `growth_stage`: INTEGER (0-4)
- `health`: INTEGER (0-100)
- `properties`: JSONB

### Growth Stages

0. Seed (Just planted)
1. Sprout (Initial growth)
2. Growing (Mid development)
3. Maturing (Nearly ready)
4. Harvestable (Ready for collection)

### Constraints

- One plant per tile (UNIQUE constraint)
- Valid growth_stage (0-4)
- Valid health range (0-100)
- Valid tile reference
- Valid plantable reference

---

## 3. Validation Functions

### validate_user()

- Validates username length (min 3 chars)
- Validates email format

### validate_player_stats()

- Validates level is positive
- Validates experience is non-negative
- Validates coins are non-negative

### validate_plant()

- Validates growth_time is positive
- Validates base_price is positive
- Validates harvest_min/max ranges

### validate_tool()

- Validates durability is positive
- Validates base_price is positive

### validate_market_listing()

- Validates quantity is positive
- Validates price_per_unit is positive

### validate_auction()

- Validates bid amounts hierarchy
- Validates end time is future
- Validates price relationships

### validate_world()

- Validates world dimensions
- Ensures positive dimensions

### validate_world_tile()

- Validates x_coord/y_coord non-negative
- Ensures unique tiles per world

### validate_item_exists()

- Validates plantable items exist
- Validates tool items exist

---

### Indexes

- **World indexes**
  - `idx_worlds_user_id`
  - `idx_worlds_created_at`

- **World tiles indexes**
  - `idx_world_tiles_world_id`
  - `idx_world_tiles_coords`

- **Tools indexes**
  - `idx_tools_rarity`
  - `idx_tools_price`

- **Inventory indexes**
  - `idx_inventory_user_id`
  - `idx_inventory_item_lookup`
  - `idx_inventory_quantity`

- **Market indexes**
  - `idx_market_listings_seller_id`
  - `idx_market_listings_item_lookup`
  - `idx_market_listings_price`

- **Auction indexes**
  - `idx_auctions_seller_id`
  - `idx_auctions_item_lookup`
  - `idx_auctions_ends_at`
  - `idx_auction_bids_auction_id`
  - `idx_auction_bids_bidder_id`
  - `idx_auction_bids_amount`

- **Planted crops indexes**
  - `idx_planted_crops_tile`
  - `idx_planted_crops_plantable`
  - `idx_planted_crops_growth`

---
