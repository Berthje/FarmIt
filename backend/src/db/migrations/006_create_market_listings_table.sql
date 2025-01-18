CREATE TABLE market_listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  item_type VARCHAR(20) NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
