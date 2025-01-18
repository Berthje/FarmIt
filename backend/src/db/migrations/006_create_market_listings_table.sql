CREATE TABLE market_listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_market_listing_data CHECK (validate_market_listing(quantity, price_per_unit))
);
