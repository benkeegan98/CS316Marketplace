CREATE TABLE user(
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(64) NOT NULL,
    major VARCHAR(64),
    class_year INTEGER,
    profile_pic  VARCHAR(256),
    security_question_answer VARCHAR(256),
    PRIMARY KEY (id),
    CONSTRAINT pwd_length CHECK(LENGTH(password)>=8),
    CONSTRAINT valid_yr CHECK(class_year>1920),
    CONSTRAINT unique_email UNIQUE(email)
);

CREATE TABLE message(
    msg_id INTEGER NOT NULL AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content VARCHAR(160),
    sent_datetime DATETIME,
    read_datetime DATETIME,
    PRIMARY KEY (msg_id),
    FOREIGN KEY (sender_id)
    REFERENCES user(id),
    FOREIGN KEY (receiver_id)
    REFERENCES user(id)
);

CREATE TABLE buyer(
    user_id INT NOT NULL,
    buyer_zip INT NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY(user_id) 
    REFERENCES user(id)
);

CREATE TABLE seller(
    user_id INT NOT NULL,
    seller_rating INT NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY(user_id)
    REFERENCES user(id)
);

CREATE TABLE review(
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY(buyer_id, seller_id),
    FOREIGN KEY(buyer_id)
    REFERENCES buyer(user_id),
    FOREIGN KEY(seller_id)
    REFERENCES seller(user_id)
);

CREATE TABLE listing(
    id INTEGER NOT NULL AUTO_INCREMENT,
    seller_id INTEGER NOT NULL,
    name VARCHAR(256) NOT NULL,
    price INTEGER NOT NULL,
    description VARCHAR(256) NOT NULL,
    sold BOOLEAN NOT NULL,
    ship BOOLEAN NOT NULL,
    pick_up BOOLEAN NOT NULL,
    category VARCHAR(256),
    weight INTEGER NOT NULL,
    zipcode INTEGER NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(seller_id)
    REFERENCES user(id),
    CONSTRAINT chk_zip CHECK(LENGTH(zipcode)=5)
);

CREATE TABLE purchase(
    id INTEGER NOT NULL AUTO_INCREMENT,
    buyer_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    total INTEGER NOT NULL,
    date_time DATETIME NOT NULL,
    retrieval_method VARCHAR(26) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(buyer_id)
    REFERENCES buyer(user_id),
    FOREIGN KEY(listing_id)
    REFERENCES listing(id),
    CONSTRAINT chk_retrieval CHECK(retrieval_method in ('ship','pick-up','other'))
);

CREATE TABLE in_favorites(
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    PRIMARY KEY(user_id, listing_id),
    FOREIGN KEY(user_id)
    REFERENCES user(id),
    FOREIGN KEY(listing_id)
    REFERENCES listing(id)
);

-- not in use
CREATE TABLE sells(
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    PRIMARY KEY(user_id),
    FOREIGN KEY(user_id)
    REFERENCES user(id),
    FOREIGN KEY(listing_id)
    REFERENCES listing(id)
);

CREATE TABLE keyword(
    id INTEGER NOT NULL AUTO_INCREMENT,
    listing_id INTEGER NOT NULL,
    word VARCHAR(56) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(listing_id)
    REFERENCES listing(id),
    CONSTRAINT unique_rows unique (listing_id, word)
);

CREATE TABLE image(
    listing_id INTEGER NOT NULL,
    image_path VARCHAR(256) NOT NULL,
    FOREIGN KEY(listing_id)
    REFERENCES listing(id) 
);


