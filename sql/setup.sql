DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS sms_intervals CASCADE;
DROP TABLE IF EXISTS user_stocks CASCADE;

CREATE TABLE users (
  id BIGINT UNIQUE GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  ph_num BIGINT,
  email TEXT
);

-- add stocks table
-- user_picks should be junction table for stocks and users many to many relationship
CREATE TABLE stocks (
  id BIGINT UNIQUE GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL
);

CREATE TABLE user_stocks( 
  user_id BIGINT REFERENCES users(id),
  stock_id BIGINT REFERENCES stocks(id)
);

CREATE TABLE sms_intervals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sms_interval TEXT DEFAULT '0',
  value_plus INT DEFAULT 0,
  value_minus INT DEFAULT 0,
  users BIGINT REFERENCES users(id)
);



INSERT INTO users (username, password_hash, ph_num, email)
VALUES
('Humma Kavula', 'MoroccanPollenHash', 8677401, 'Humma@Morocco.com'),
('Yon Yonson', 'BubbleHash', 911, 'yon@bubbles.com'),
('Piccillo Pete', 'IndianCharasHash', 7165559280, 'Peter@piccillo.com');



INSERT INTO sms_intervals (sms_interval, value_plus, value_minus, users)
VALUES
('15 mintues', 20, 20, '1'),
('1 hour', 100, 20, '2');

INSERT INTO sms_intervals(users)
VALUES
('3');

INSERT INTO stocks (name, ticker)
VALUES
('Microsoft', 'MSFT'),
('Apple', 'AAPL'),
('Tesla', 'TSLA'),
('Facebook', 'META'),
('Google', 'GOOG'),
('Kittens', 'CATS'),
('Doggos', 'DOGS');

INSERT INTO user_stocks (stock_id, user_id)
VALUES
('1', '1'),
('2', '1'),
('3', '1'),
('1', '2'),
('4', '2'),
('5', '1'),
('2', '2'),
('6', '1');
