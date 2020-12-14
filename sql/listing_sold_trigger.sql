CREATE TRIGGER listing_sold AFTER INSERT ON purchase
FOR EACH ROW
UPDATE listing SET sold = 1
WHERE listing.id = NEW.listing_id