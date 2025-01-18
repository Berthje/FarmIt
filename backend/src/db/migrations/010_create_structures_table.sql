CREATE TABLE structures (
    id SERIAL PRIMARY KEY,
    plot_id INTEGER REFERENCES farm_plots(id),
    structure_type structure_type_enum NOT NULL,
    built_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    durability INTEGER DEFAULT 100,
    last_maintained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
