CREATE TABLE auction_bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id),
  bidder_id INTEGER REFERENCES users(id),
  bid_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT positive_bid CHECK (bid_amount > 0)
);

CREATE OR REPLACE FUNCTION validate_auction_bid_insert() RETURNS TRIGGER AS $$
BEGIN
  -- Check if bid is higher than current bid
  IF NEW.bid_amount <= (
    SELECT current_bid FROM auctions WHERE id = NEW.auction_id
  ) THEN
    RAISE EXCEPTION 'Bid must be higher than current bid';
  END IF;

  -- Check if auction is still open
  IF NOT EXISTS (
    SELECT 1 FROM auctions
    WHERE id = NEW.auction_id
    AND ends_at > CURRENT_TIMESTAMP
  ) THEN
    RAISE EXCEPTION 'Auction is closed or does not exist';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_auction_bid_insert
  BEFORE INSERT ON auction_bids
  FOR EACH ROW
  EXECUTE FUNCTION validate_auction_bid_insert();
