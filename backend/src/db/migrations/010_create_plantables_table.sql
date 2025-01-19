CREATE TABLE plantables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category plant_category_enum NOT NULL,
    growth_time INTEGER NOT NULL,
    season season_enum,
    rarity rarity_enum DEFAULT 'common',
    base_price INTEGER NOT NULL,
    harvest_min INTEGER NOT NULL DEFAULT 1,
    harvest_max INTEGER NOT NULL DEFAULT 1,
    regrows BOOLEAN DEFAULT FALSE,
    regrow_time INTEGER,
    properties JSONB DEFAULT '{}',

    CONSTRAINT valid_plant_data CHECK (
        validate_plant(
            growth_time,
            base_price,
            harvest_min,
            harvest_max
        )
    )
);