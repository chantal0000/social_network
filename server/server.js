const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");

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
        sameSite: true,
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
    res.redirect("/login");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///REGISTER/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///LOGIN////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login", (req, res) => {
    console.log("email", req.body.email);
    db.login(req.body.email)
        .then((results) => {
            console.log(results.rows[0].password);
            if (results.rows[0]) {
                return bcrypt
                    .compare(req.body.password, results.rows[0].password)
                    .then(function (pwCompare) {
                        if (pwCompare) {
                            req.session.login = true;
                            req.session.user_id = results.rows[0].id;
                            res.json({ success: true });
                        } else {
                            res.json({ success: false });
                        }
                    });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            res.json({ error: err });
        });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///RESET////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/password/reset/start", (req, res) => {
    console.log("email", req.body.email);
    db.login(req.body.email)
        .then((results) => {
            console.log("results", results);
            if (results.rowCount === 0) {
                res.json({
                    success: false,
                    error: true,
                });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("my secret Code", secretCode);
                db.safeCode(req.body.email, secretCode)
                    .then(
                        (results) =>
                            console.log("email and code stored, yay!", results),
                        sendEmail(req.body.email, secretCode),
                        res.json({
                            success: true,
                            error: false,
                        })
                    )
                    .catch((error) => {
                        console.log("/password/reset/start error", error);
                        res.json({
                            sucess: false,
                            error: true,
                        });
                    });
            }
        })
        .catch((error) => {
            res.json({
                success: false,
                error: true,
            });
        });

    // Confirm that there is a user with the submitted email address
    // check the db for this email address

    // Generate a secret code and store it so it can be retrieved later

    // Put the secret code into an email message and send it to the user
});

app.post("/password/reset/verify", (req, res) => {
    console.log("verify");
    db.compare(req.body.email).then((results) => {
        //wie finde ich den code 1 raus?
        console.log("code1", results.rows[results.rows.length - 1].code);
        console.log("code2", req.body.reset_code);
        if (
            req.body.reset_code === results.rows[results.rows.length - 1].code
        ) {
            console.log("it's a match");
            //create new PW
        }
    });

    // Confirm that there is a user with the submitted email address

    // Generate a secret code and store it so it can be retrieved later

    // Put the secret code into an email message and send it to the user
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
