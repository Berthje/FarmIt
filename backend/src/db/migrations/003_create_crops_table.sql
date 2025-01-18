CREATE TABLE crops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  growth_time INTEGER NOT NULL,
  season VARCHAR(20),
  rarity VARCHAR(20) DEFAULT 'common',
  base_price INTEGER NOT NULL,
  CONSTRAINT valid_crop_data CHECK (validate_crop(growth_time, base_price, season))
);
