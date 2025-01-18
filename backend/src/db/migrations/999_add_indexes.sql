-- Farm plots indexes
CREATE INDEX idx_farm_plots_user_id ON farm_plots(user_id);
CREATE INDEX idx_farm_plots_crop_id ON farm_plots(crop_id);
CREATE INDEX idx_farm_plots_coords ON farm_plots(x_coord, y_coord);

-- Inventory indexes
CREATE INDEX idx_inventory_user_id ON inventory(user_id);
CREATE INDEX idx_inventory_item_lookup ON inventory(item_type, item_id);

-- Market indexes
CREATE INDEX idx_market_listings_seller_id ON market_listings(seller_id);
CREATE INDEX idx_market_listings_item_lookup ON market_listings(item_type, item_id);

-- Auction indexes
CREATE INDEX idx_auctions_seller_id ON auctions(seller_id);
CREATE INDEX idx_auctions_item_lookup ON auctions(item_type, item_id);
CREATE INDEX idx_auctions_ends_at ON auctions(ends_at);
CREATE INDEX idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX idx_auction_bids_bidder_id ON auction_bids(bidder_id);
