CREATE TABLE plot_prices (
    id SERIAL PRIMARY KEY,
    plots_owned_range_start INTEGER NOT NULL,
    plots_owned_range_end INTEGER NOT NULL,
    base_price INTEGER NOT NULL,
    multiplier DECIMAL(4,2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_plot_price CHECK (
        plots_owned_range_start >= 0 AND
        plots_owned_range_end > plots_owned_range_start AND
        base_price > 0 AND
        multiplier >= 1.00
    ),
    UNIQUE(plots_owned_range_start, plots_owned_range_end)
);
