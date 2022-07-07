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
