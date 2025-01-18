CREATE TABLE auction_bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id),
  bidder_id INTEGER REFERENCES users(id),
  bid_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_bid_amount CHECK (validate_auction_bid(bid_amount, (SELECT current_bid FROM auctions WHERE id = auction_id)))
);
