-- Add after all tables are created
CREATE OR REPLACE FUNCTION calculate_plot_price(p_user_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    owned_plots INTEGER;
    price_record RECORD;
BEGIN
    -- Count currently owned plots
    SELECT COUNT(*) INTO owned_plots
    FROM farm_plots
    WHERE user_id = p_user_id
    AND plot_type != 'locked';

    -- Get price data for the current range
    SELECT * INTO price_record
    FROM plot_prices
    WHERE owned_plots >= plots_owned_range_start
    AND owned_plots <= plots_owned_range_end
    ORDER BY plots_owned_range_start ASC
    LIMIT 1;

    -- Calculate final price
    RETURN CEIL(price_record.base_price * price_record.multiplier);
END;
$$ LANGUAGE plpgsql;

-- World initialization functions
CREATE OR REPLACE FUNCTION initialize_user_world()
RETURNS TRIGGER AS $$
BEGIN
    -- Create 100x100 grid for new user
    INSERT INTO farm_plots (user_id, x_coord, y_coord, plot_type)
    SELECT
        NEW.id,
        x.coord,
        y.coord,
        CASE
            WHEN x.coord < 10 AND y.coord < 10 THEN 'grass'
            ELSE 'locked'
        END
    FROM
        generate_series(0, 99) x(coord)
        CROSS JOIN generate_series(0, 99) y(coord);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger after users table exists
CREATE TRIGGER after_user_created
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_world();
