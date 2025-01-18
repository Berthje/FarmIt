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
  -- Get auction details
  DECLARE
    v_current_bid INTEGER;
    v_min_bid INTEGER;
    v_buy_now_price INTEGER;
  BEGIN
    SELECT current_bid, min_bid, buy_now_price
    INTO v_current_bid, v_min_bid, v_buy_now_price
    FROM auctions
    WHERE id = NEW.auction_id;

    -- Check if first bid meets minimum
    IF v_current_bid = 0 AND NEW.bid_amount < v_min_bid THEN
      RAISE EXCEPTION 'Bid must be at least the minimum bid amount of %', v_min_bid;
    END IF;

    -- Check if bid is high enough
    IF NEW.bid_amount <= v_current_bid THEN
      RAISE EXCEPTION 'Bid must be higher than current bid';
    END IF;

    -- Auto-complete if matches/exceeds buy now
    IF v_buy_now_price IS NOT NULL AND NEW.bid_amount >= v_buy_now_price THEN
      UPDATE auctions
      SET ends_at = CURRENT_TIMESTAMP
      WHERE id = NEW.auction_id;
    END IF;

    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_auction_bid_insert
  BEFORE INSERT ON auction_bids
  FOR EACH ROW
  EXECUTE FUNCTION validate_auction_bid_insert();
