const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");

// ///
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;
///

// MIDDLEWARE
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// GET ROUTES

app.get("/user/id.json", function (req, res) {
    res.json({
        user_id: req.session.user_id,
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

///

// app.post("register")
app.post("/register", (req, res) => {
    // call the bcrypt.hash function and pass it the password from req.body
    bcrypt
        .hash(req.body.password)
        .then((hash) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hash)
                .then((results) => {
                    req.session.user_id = results.rows[0].id;
                    req.session.login = true;
                    res.json({ success: true });
                    //redirect to profile page
                    // res.redirect("/profile");
                })
                .catch((err) => {
                    res.json({ error: err });
                });
        })
        .catch((err) => {
            console.log("err /register", err);
        });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
