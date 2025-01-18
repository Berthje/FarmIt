-- Farm plots indexes
CREATE INDEX idx_farm_plots_user ON farm_plots(user_id);
CREATE INDEX idx_farm_plots_location ON farm_plots(user_id, x_coord, y_coord);
CREATE INDEX idx_farm_plots_type ON farm_plots(plot_type);
CREATE INDEX idx_farm_plots_crops ON farm_plots(crop_id) WHERE crop_id IS NOT NULL;
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

