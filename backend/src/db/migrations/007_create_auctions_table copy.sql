CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  current_bid INTEGER NOT NULL DEFAULT 0,
  ends_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_auction_data CHECK (validate_auction(current_bid, ends_at))
);
