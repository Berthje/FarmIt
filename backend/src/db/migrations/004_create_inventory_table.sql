CREATE TYPE item_type_enum AS ENUM ('crops', 'tools');

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_type item_type_enum NOT NULL,
  item_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  CONSTRAINT valid_item_reference CHECK (
    CASE item_type
      WHEN 'crops' THEN EXISTS(SELECT 1 FROM crops WHERE id = item_id)
      WHEN 'tools' THEN EXISTS(SELECT 1 FROM tools WHERE id = item_id)
    END
  )
);
