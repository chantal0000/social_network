const spicedPg = require("spiced-pg");
const database = "socialnetwork";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

console.log("[db] connecting to:", database);
// add the information that the signer put in to the databank petition

module.exports.addUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password) 
               VALUES ($1, $2, $3, $4) 
               RETURNING id, first, last`;
    const param = [first, last, email, password];
    return db.query(q, param);
};

// login user

module.exports.login = (email) => {
    const q = `SELECT *
               FROM users 
               WHERE email = $1`;
    const param = [email];
    return db.query(q, param);
};

// secret code
module.exports.safeCode = (email, code) => {
    const q = `INSERT INTO reset_codes (email, code) 
    VALUES ($1, $2) 
    RETURNING *`;
    const param = [email, code];
    return db.query(q, param);
};

module.exports.compare = (email) => {
    const q = `SELECT code from reset_codes 
    WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
    AND email = $1`;
    const param = [email];
    return db.query(q, param);
};
//safe new password
module.exports.newPassword = (password, email) => {
    const q = `UPDATE users
    SET password = $1
    WHERE email = $2
    RETURNING *`;
    const param = [password, email];
    return db.query(q, param);
};
// upload new profile pic
module.exports.uploadImage = (url, id) => {
    const q = `
    UPDATE users
    SET url = $1
    WHERE id = $2
    RETURNING url`;
    const param = [url, id];
    return db.query(q, param);
};
//get users information
module.exports.getProfile = (id) => {
    return db.query(
        `SELECT users.first, users.last, users.url, users.bio 
    FROM users WHERE id=$1
    LIMIT 1`,
        [id]
    );
};

// update Bio
module.exports.updateBio = (bio, id) => {
    const q = `UPDATE users
    SET bio = $1
    WHERE id = $2
    RETURNING bio`;
    const param = [bio, id];
    return db.query(q, param);
};

//
module.exports.getRecentUsers = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC
    LIMIT 3`);
};

//
module.exports.searchUsers = (val) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 
OR last ILIKE $1
LIMIT 3`,
        [val + "%"]
    );
};

// friendship status

module.exports.friendshipCheck = (userId, viewedUserId) => {
    const q = `SELECT * FROM friendships
     WHERE (recipient_id = $1 AND sender_id = $2)
     OR (recipient_id = $2 AND sender_id = $1)`;

    const param = [userId, viewedUserId];
    return db.query(q, param);
};

// friend request
module.exports.friendshipRequest = (userId, viewedUserId) => {
    const q = `INSERT INTO friendships(sender_id, recipient_id)
    VALUES ($1, $2)`;
    const param = [userId, viewedUserId];
    return db.query(q, param);
};

// accept friends

module.exports.friendshipAccept = (userId, viewedUserId) => {
    const q = `UPDATE friendships
    SET accepted = true
    WHERE (recipient_id = $1 AND sender_id = $2)`;
    const param = [userId, viewedUserId];
    return db.query(q, param);
};

// unfriend and cancel request

module.exports.cancelOrUnfriend = (userId, viewedUserId) => {
    const q = `DELETE FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (sender_id = $1 AND recipient_id = $2)`;
    const param = [userId, viewedUserId];
    return db.query(q, param);
};

// friends and wannabees
module.exports.friendsAndWannabees = (userId) => {
    const q = `SELECT users.id, first, last, url, accepted
FROM friendships
JOIN users
ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    const param = [userId];
    return db.query(q, param);
};

// get last 10 messages

module.exports.last10Msg = () => {
    return db.query(`SELECT users.id, messages.user_id, messages.message, users.first, users.last,  users.url
    FROM messages
    JOIN users ON ( users.id = user_id)
    ORDER BY messages.user_id DESC
    LIMIT 10`);
};

//
