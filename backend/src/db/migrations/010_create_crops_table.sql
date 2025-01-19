CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    growth_time INTEGER NOT NULL,
    season season_enum,
    rarity rarity_enum DEFAULT 'common',
    base_price INTEGER NOT NULL,

    CONSTRAINT valid_crop_data CHECK (
        validate_crop (
            growth_time,
            base_price,
            season
        )
    )
);