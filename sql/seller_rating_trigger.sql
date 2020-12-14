CREATE TRIGGER update_rating AFTER INSERT ON review
FOR EACH ROW
UPDATE seller SET seller_rating = 
(SELECT AVG(score) FROM
review
WHERE review.seller_id = NEW.seller_id)
WHERE seller.user_id = NEW.seller_id