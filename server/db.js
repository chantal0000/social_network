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

module.exports.newPassword = (password, email) => {
    const q = `UPDATE users
    SET password = $1
    WHERE email = $2
    RETURNING *`;
    const param = [password, email];
    return db.query(q, param);
};
