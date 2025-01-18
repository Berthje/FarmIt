CREATE TYPE item_type_enum AS ENUM ('crops', 'tools');

CREATE TABLE auctions (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  current_bid INTEGER NOT NULL DEFAULT 0,
  ends_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  CONSTRAINT valid_item_reference CHECK (
    CASE item_type
      WHEN 'crops' THEN EXISTS(SELECT 1 FROM crops WHERE id = item_id)
      WHEN 'tools' THEN EXISTS(SELECT 1 FROM tools WHERE id = item_id)
    END
  )
);
