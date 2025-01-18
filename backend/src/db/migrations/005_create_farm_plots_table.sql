CREATE TABLE farm_plots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  x_coord INTEGER NOT NULL,
  y_coord INTEGER NOT NULL,
  crop_id INTEGER REFERENCES crops(id),
  planted_at TIMESTAMP,
  growth_stage INTEGER DEFAULT 0 CONSTRAINT valid_growth_stage CHECK (growth_stage >= 0),

  UNIQUE (user_id, x_coord, y_coord),
  CONSTRAINT valid_coordinates CHECK (
    x_coord >= 0 AND x_coord < 100 AND
    y_coord >= 0 AND y_coord < 100
  )
);
