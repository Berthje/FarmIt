CREATE TABLE planted_crops (
    id SERIAL PRIMARY KEY,
    tile_id INTEGER REFERENCES world_tiles (id),
    plantable_id INTEGER REFERENCES plantables (id),
    planted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_watered_at TIMESTAMP WITH TIME ZONE,
    growth_stage INTEGER DEFAULT 0,
    health INTEGER DEFAULT 100,
    properties JSONB DEFAULT '{}',
    CONSTRAINT one_plant_per_tile UNIQUE (tile_id),
    CONSTRAINT valid_growth CHECK (
        growth_stage >= 0
        AND growth_stage <= 4
        AND health >= 0
        AND health <= 100
    )
);