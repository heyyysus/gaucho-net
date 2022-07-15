CREATE TABLE IF NOT EXISTS users 
(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(254),
    u_name VARCHAR(30),
    hash VARCHAR(60),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    authLevel INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts
(
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    parent INTEGER REFERENCES posts(post_id) DEFAULT NULL,
    body VARCHAR(300),
    isRoot BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS followers
(
    follower_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    f_user_id INTEGER REFERENCES users(user_id) NOT NULL
);
