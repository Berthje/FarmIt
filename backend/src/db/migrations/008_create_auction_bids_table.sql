CREATE TABLE auction_bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id),
  bidder_id INTEGER REFERENCES users(id),
  bid_amount INTEGER NOT NULL CONSTRAINT positive_bid CHECK (bid_amount > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
