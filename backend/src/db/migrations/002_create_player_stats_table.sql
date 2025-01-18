CREATE TABLE player_stats (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  level INTEGER DEFAULT 1 CONSTRAINT positive_level CHECK (level > 0),
  experience BIGINT DEFAULT 0 CONSTRAINT positive_experience CHECK (experience >= 0),
  coins BIGINT DEFAULT 0 CONSTRAINT positive_coins CHECK (coins >= 0),
);
