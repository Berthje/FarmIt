CREATE TABLE market_listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_unit INTEGER NOT NULL CHECK (price_per_unit > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  CONSTRAINT valid_market_item_reference CHECK (
    CASE item_type
      WHEN 'crops' THEN EXISTS(SELECT 1 FROM crops WHERE id = item_id)
      WHEN 'tools' THEN EXISTS(SELECT 1 FROM tools WHERE id = item_id)
    END
  )
);
