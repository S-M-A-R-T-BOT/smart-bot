DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_picks CASCADE;
DROP TABLE IF EXISTS sms_intervals CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  ph_num INT
);

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

INSERT INTO users (user_name, password_hash, ph_num)
VALUES
('Humma Kavula', 'MoroccanPollenHash', 8677401),
('Yon Yonson', 'BubbleHash', 911),
('Piccillo Pete', 'IndianCharasHash', 911);

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
