CREATE TABLE tools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  durability INTEGER NOT NULL,
  rarity rarity_enum DEFAULT 'common',
  base_price INTEGER NOT NULL,
  CONSTRAINT valid_tool_data CHECK (validate_tool(durability, base_price))
);
