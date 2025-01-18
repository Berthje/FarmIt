CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  current_bid INTEGER NOT NULL DEFAULT 0,
  min_bid INTEGER NOT NULL,
  reserve_price INTEGER,
  buy_now_price INTEGER,
  ends_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_auction_data CHECK (
    validate_auction(current_bid, min_bid, reserve_price, buy_now_price, ends_at)
  )
);
