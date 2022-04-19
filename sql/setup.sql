DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS sms_intervals CASCADE;
DROP TABLE IF EXISTS user_stocks CASCADE;

CREATE TABLE users (
  user_id BIGINT UNIQUE GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  ph_num BIGINT,
  email TEXT
);

-- stocks table is just a list of stocks that SOMEBODY is tracking.
-- user_stocks is a junction table that tells us WHO is tracking each stock in the stocks table
CREATE TABLE stocks (
  stock_id BIGINT UNIQUE GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL
);

CREATE TABLE user_stocks( 
  user_id BIGINT REFERENCES users(user_id),
  stock_id BIGINT REFERENCES stocks(stock_id)
);

CREATE TABLE sms_intervals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sms_interval TEXT DEFAULT '0',
  value_plus INT DEFAULT 0,
  value_minus INT DEFAULT 0,
  users BIGINT REFERENCES users(user_id)
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
