DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS user_picks CASCADE;
DROP TABLE IF EXISTS sms_intervals CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  ph_num BIGINT,
  email TEXT
);

-- add stocks table
-- user_picks should be junction table for stocks and users many to many relationship
CREATE TABLE stocks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,

)

CREATE TABLE user_picks( 
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticker TEXT[],
  users BIGINT REFERENCES users(id)
);

CREATE TABLE sms_intervals (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sms_interval TEXT DEFAULT '0',
  value_plus INT DEFAULT 0,
  value_minus INT DEFAULT 0,
  users BIGINT REFERENCES users(id)
);

INSERT INTO users (user_name, password_hash, ph_num, email)
VALUES
('Humma Kavula', 'MoroccanPollenHash', 8677401, 'Humma@Morocco.com'),
('Yon Yonson', 'BubbleHash', 911, 'yon@bubbles.com'),
('Piccillo Pete', 'IndianCharasHash', 7165559280, 'Peter@piccillo.com');

INSERT INTO user_picks (ticker, users)
VALUES
(
  '{GOOGL, AAPL, IBM, NVDA, MSFT}',
  '1'
),
(
  '{AAPL, IBM, NVDA}',
  '2'
),
(
  '{}',
  '3'
);

INSERT INTO sms_intervals (sms_interval, value_plus, value_minus, users)
VALUES
('15 mintues', 20, 20, '1'),
('1 hour', 100, 20, '2'),
('1 day', 200, 100, '3');
