CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_quantity CHECK (quantity > 0),
  CONSTRAINT valid_item CHECK (validate_item_exists(item_type, item_id))
);
