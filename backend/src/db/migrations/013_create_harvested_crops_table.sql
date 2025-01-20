CREATE TABLE harvested_crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    plantable_id INTEGER REFERENCES plantables (id),
    base_price INTEGER NOT NULL,
    rarity rarity_enum DEFAULT 'common'
);