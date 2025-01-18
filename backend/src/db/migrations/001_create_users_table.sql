CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL CONSTRAINT valid_username CHECK (LENGTH(username) >= 3),
  email VARCHAR(100) UNIQUE NOT NULL CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password_hash VARCHAR(200) NOT NULL,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
