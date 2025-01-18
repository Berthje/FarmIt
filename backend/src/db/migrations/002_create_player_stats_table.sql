CREATE TABLE player_stats (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  level INTEGER DEFAULT 1,
  experience BIGINT DEFAULT 0,
  coins BIGINT DEFAULT 0,
  CONSTRAINT valid_player_stats CHECK (validate_player_stats(level, experience, coins))
);
