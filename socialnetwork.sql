DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
id SERIAL PRIMARY KEY,
first VARCHAR NOT NULL CHECK (first != ''),
last VARCHAR NOT NULL CHECK (last != ''),
url TEXT,
email VARCHAR NOT NULL CHECK (email != '') UNIQUE,
password VARCHAR NOT NULL CHECK (password != ''),
bio TEXT
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

   CREATE TABLE friendships(
      id SERIAL PRIMARY KEY,
      sender_id INT REFERENCES users(id) NOT NULL,
      recipient_id INT REFERENCES users(id) NOT NULL,
      accepted BOOLEAN DEFAULT false
  );

  CREATE TABLE messages (
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id) NOT NULL,
   message TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
INSERT INTO messages (user_id, message)
 VALUES (61, 'Hallo Quello');