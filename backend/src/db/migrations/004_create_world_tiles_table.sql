CREATE TABLE world_tiles (
  id SERIAL PRIMARY KEY,
  world_id INTEGER REFERENCES worlds(id),
  x_coord INTEGER NOT NULL,
  y_coord INTEGER NOT NULL,
  locked BOOLEAN NOT NULL DEFAULT TRUE,
  terrain_type terrain_type_enum DEFAULT 'grass',
  purchase_price INTEGER,
  purchased_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT unique_tile UNIQUE (world_id, x_coord, y_coord),
  CONSTRAINT valid_world_tile CHECK (validate_world_tile(x_coord, y_coord))
);
