CREATE TABLE worlds (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  dimension_x INTEGER NOT NULL DEFAULT 100,
  dimension_y INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  CONSTRAINT valid_world CHECK (validate_world(dimension_x, dimension_y))
);
