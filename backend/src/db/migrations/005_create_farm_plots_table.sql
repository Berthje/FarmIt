CREATE TABLE farm_plots (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  x_coord INTEGER NOT NULL,
  y_coord INTEGER NOT NULL,
  crop_id INTEGER REFERENCES crops(id),
  planted_at TIMESTAMP,
  growth_stage INTEGER DEFAULT 0,
  UNIQUE (user_id, x_coord, y_coord),
  CONSTRAINT valid_farm_plot_data CHECK (validate_farm_plot(x_coord, y_coord, growth_stage))
);
