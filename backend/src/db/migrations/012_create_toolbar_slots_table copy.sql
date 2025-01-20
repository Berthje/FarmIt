CREATE TABLE toolbar_slots (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    slot_index INTEGER CHECK (
        slot_index >= 0
        AND slot_index < 9
    ),
    item_type item_type_enum,
    item_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_slot UNIQUE (user_id, slot_index),
    CONSTRAINT valid_item CHECK (
        (
            item_type IS NULL
            AND item_id IS NULL
        )
        OR validate_item_exists (item_type, item_id)
    )
);