-- Worlds indexes
CREATE INDEX idx_worlds_user_id ON worlds(user_id);
CREATE INDEX idx_worlds_created_at ON worlds(created_at);

-- World tiles indexes
CREATE INDEX idx_world_tiles_world_id ON world_tiles(world_id);
CREATE INDEX idx_world_tiles_coords ON world_tiles(world_id, x_coord, y_coord);

-- Tools indexes
CREATE INDEX idx_tools_rarity ON tools(rarity);
CREATE INDEX idx_tools_price ON tools(base_price);

-- Inventory indexes
CREATE INDEX idx_inventory_user_id ON inventory(user_id);
CREATE INDEX idx_inventory_item_lookup ON inventory(item_type, item_id);
CREATE INDEX idx_inventory_quantity ON inventory(user_id, item_type, item_id);

-- Market indexes
CREATE INDEX idx_market_listings_seller_id ON market_listings(seller_id);
CREATE INDEX idx_market_listings_item_lookup ON market_listings(item_type, item_id);
CREATE INDEX idx_market_listings_price ON market_listings(price_per_unit);

-- Auction indexes
CREATE INDEX idx_auctions_seller_id ON auctions(seller_id);
CREATE INDEX idx_auctions_item_lookup ON auctions(item_type, item_id);
CREATE INDEX idx_auctions_ends_at ON auctions(ends_at);
CREATE INDEX idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX idx_auction_bids_bidder_id ON auction_bids(bidder_id);
CREATE INDEX idx_auction_bids_amount ON auction_bids(auction_id, bid_amount DESC);

-- Planted crops indexes
CREATE INDEX idx_planted_crops_tile ON planted_crops (tile_id);

CREATE INDEX idx_planted_crops_plantable ON planted_crops (plantable_id);

CREATE INDEX idx_planted_crops_growth ON planted_crops (growth_stage);

-- Toolbar slots indexes
CREATE INDEX idx_toolbar_slots_user ON toolbar_slots (user_id);