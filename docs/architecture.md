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

- **item_type_enum**: ('crops', 'tools')
- **rarity_enum**: ('common', 'uncommon', 'rare', 'epic', 'legendary')
- **season_enum**: ('spring', 'summer', 'fall', 'winter')

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

#### crops

- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(50) (crop name)
- `growth_time`: INTEGER (minutes to mature)
- `season`: season_enum (growing season)
- `rarity`: rarity_enum (crop value tier)
- `base_price`: INTEGER (minimum value)

#### tools

- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(50) (tool name)
- `durability`: INTEGER (usage limit)
- `rarity`: rarity_enum (tool tier)
- `base_price`: INTEGER (shop price)

#### farm_plots

- `id`: SERIAL PRIMARY KEY
- `user_id`: INTEGER FK (plot owner)
- `x_coord`: INTEGER (horizontal position)
- `y_coord`: INTEGER (vertical position)
- `crop_id`: INTEGER FK (planted crop)
- `planted_at`: TIMESTAMP (planting time)
- `growth_stage`: INTEGER (crop progress)

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

---

## 3. Validation Functions

### validate_user()

- Ensures username length is within the accepted range.
- Validates email format using regex patterns.

### validate_player_stats()

- Validates `level`, `experience`, and `coins` to ensure no negative or invalid
  values.

### validate_crop()

- Checks that growth time is reasonable.
- Validates season is a valid `season_enum` value.
- Ensures base price is positive.

### validate_tool()

- Validates durability is non-negative.
- Checks base price validity.

### validate_farm_plot()

- Verifies coordinates are unique per user.
- Ensures `growth_stage` is valid based on `planted_at`.

### validate_market_listing()

- Checks `quantity` and `price_per_unit` for positive integers.
- Ensures `item_id` and `item_type` alignment.

### validate_auction()

- Validates bid amounts, ensuring `min_bid <= current_bid`.
- Confirms `ends_at` is a valid future timestamp.

### validate_auction_bid()

- Ensures `bid_amount` is greater than `current_bid`.
- Handles bid auto-completion logic.

---

## 4. Performance Optimizations

### Indexes

- **User-based queries**: `idx_users_user_id`, `idx_player_stats_user_id`
- **Item lookups**: `idx_inventory_item_lookup`
- **Auction management**: `idx_auctions_item_id`, `idx_auctions_seller_id`
- **Bid tracking**: `idx_auction_bids_auction_id`, `idx_auction_bids_bidder_id`

---

## 5. Security Features

- **Password Hashing**: Uses industry-standard algorithms (e.g., bcrypt) to
  securely store passwords.
- **Input Validation**: Ensures all inputs are sanitized to prevent SQL
  injection and XSS attacks.
- **Transaction Isolation**: Implements proper isolation levels to avoid race
  conditions and ensure data integrity.
- **Anti-Exploitation Measures**: Includes rate-limiting and bot-detection
  algorithms.
