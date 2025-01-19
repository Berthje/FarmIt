CREATE OR REPLACE FUNCTION trigger_create_world()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_initial_world(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_create_world_after_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_create_world();
