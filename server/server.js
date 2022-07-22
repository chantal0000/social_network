const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
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

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

//this gives sockets access to our request object upon connectsion! So that means we know
// which userid belongs to which socket upon connecting!
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(cookieSessionMiddleware);
// GET ROUTES

app.get("/user/id.json", function (req, res) {
    res.json({
        user_id: req.session.user_id,
    });
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
            // console.log(results.rows[0].password);
            if (results.rows[0]) {
                return bcrypt
                    .compare(req.body.password, results.rows[0].password)
                    .then(function (pwCompare) {
                        if (pwCompare) {
                            req.session.login = true;
                            req.session.user_id = results.rows[0].id;
                            res.json({ success: true });
                        } else {
                            console.log("smth went wrong");
                            res.json({ success: false, error: true });
                        }
                    });
            } else {
                console.log("smth went wrong");
                res.json({ success: false, error: true });
            }
        })
        .catch((err) => {
            console.log("wrong", err);
            res.json({ error: true, succes: false });
        });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///RESET////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/password/reset/start", (req, res) => {
    // console.log("email", req.body.email);
    db.login(req.body.email)
        .then((results) => {
            // console.log("results", results);
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
});

app.post("/password/reset/verify", (req, res) => {
    console.log("verify");
    db.compare(req.body.email).then((results) => {
        console.log("code1", results.rows[results.rows.length - 1].code);
        console.log("code2", req.body.reset_code);
        if (
            req.body.reset_code === results.rows[results.rows.length - 1].code
        ) {
            console.log("it's a match");
            //create new PW
            bcrypt
                .hash(req.body.new_password)
                .then((hash) => {
                    db.newPassword(hash, req.body.email)
                        .then((results) => {
                            // req.session.login = true;

                            console.log(
                                "you updated the password in db",
                                results
                            );
                            //redirect to profile page
                            // res.redirect("/profile");
                            req.session.user_id = results.rows[0].id;
                            res.json({ success: true, error: false });
                        })
                        .catch((err) => {
                            console.log("error", err);
                            res.json({ error: err });
                        });
                })
                .catch((err) => {
                    console.log("err /save reset pw", err);
                });
        } else {
            console.log("error in matching emails");
            res.json({
                success: false,
                error: true,
            });
        }
    });

    // Confirm that there is a user with the submitted email address

    // Generate a secret code and store it so it can be retrieved later

    // Put the secret code into an email message and send it to the user
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////UPLOAD PROFILE IMG////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            // callback(null, `${randomString}.jpg`);
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});

// uploader = multer({ storage: storage });
const upload = multer({
    storage,
    limits: { fileSize: 2097152 },
});
///////////////////////////////////////////////////

//////////////////////////////////////////////////

app.post("/upload", upload.single("image"), s3.upload, (req, res) => {
    console.log("in upload");
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;

    // console.log("this will be containi...........")
    console.log("url", url);
    console.log("id", req.session.user_id);
    db.uploadImage(url, req.session.user_id)

        .then((results) => {
            console.log("MYrows:", results.rows);
            res.json({
                data: results.rows[0].url,
                success: true,
            });
        })
        .catch((err) => {
            console.log("error uploadng", err);
        });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////UPLOAD PROFILE IMG/ INFO////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/user", (req, res) => {
    console.log("i am in user");
    db.getProfile(req.session.user_id).then((results) => {
        // console.log("results user_id, get ingo", results);
        res.json({
            userInfo: results.rows[0],
        });
    });
});
//////////////////////////////////////////////////
app.post("/updateBio", (req, res) => {
    // console.log("req.body", req.body.draftBio);
    // console.log("user_id is:", req.session.user_id);
    db.updateBio(req.body.draftBio, req.session.user_id)
        .then((results) => {
            console.log("results db", results.rows);
            res.json({
                updatedBio: results.rows[0],
            });
        })
        .catch((err) => {
            console.log("error updatebio server", err);
        });
});

//////////
//////////
app.get("/findusers", (req, res) => {
    db.getRecentUsers()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((error) => {
            console.log("error server find", error);
        });
});

//////////
app.get("/findusers/:search", (req, res) => {
    db.searchUsers(req.params.search)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((error) => {
            console.log("smth wrong findinf user", error);
        });
});
/////////
app.get("/api/user/:id", (req, res) => {
    console.log("api/user/:id", req.params);
    if (req.session.user_id == req.params.id) {
        res.json({
            myProfile: true,
        });
    }
    db.getProfile(req.params.id)
        .then((results) => {
            if (results.rows[0]) {
                res.json({ profile: results.rows[0] });
            } else {
                res.json({});
            }
        })
        .catch((error) => {
            console.log("eroor in otherPopel", error);
        });
});

/////// check frienship

app.get("/api/relationship/:id", (req, res) => {
    console.log("req.params.", req.params.id);
    console.log("req.session.user_id", req.session.user_id);

    db.friendshipCheck(req.session.user_id, req.params.id)
        .then((result) => {
            console.log("results.rows leer2?", result);
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.json({ notFriends: true });
            }
        })
        .catch((error) => {
            console.log("error in server friendcheck", error);
        });
});
//////  friend request, cancel, accept

app.post("/api/friendshipButton/:id", (req, res) => {
    console.log("req.params.id", req.params.id);
    console.log(req.session.user_id);
    console.log("buttontext here:", req.body.buttonText);

    if (req.body.buttonText === "Send Friend Request") {
        console.log("friend request send");
        db.friendshipRequest(req.session.user_id, req.params.id)
            .then((results) => {
                res.json({
                    resultRequest: results.rows[0],
                    buttonText: "Cancel request",
                });
            })
            .catch((error) => {
                console.log("error server friend req", error);
            });
    } else if (req.body.buttonText === "Accept friend request") {
        console.log("accepz");
        db.friendshipAccept(req.session.user_id, req.params.id)
            .then((results) => {
                console.log("ISSUE results.rows", results.rows);
                res.json({
                    resultAccept: results.rows[0],
                    buttonText: "End Friendship",
                });
            })
            .catch((error) => {
                console.log(error);
            });
    } else if (
        req.body.buttonText === "Cancel request" ||
        req.body.buttonText === "End Friendship"
    ) {
        console.log("cancel friend");
        db.cancelOrUnfriend(req.session.user_id, req.params.id)
            .then((results) => {
                res.json({
                    resultCancel: results.rows[0],
                    buttonText: "Send Friend Request",
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
});
//

/////////
app.get("/friends-wannabees", async (req, res) => {
    try {
        const results = await db.friendsAndWannabees(req.session.user_id);
        const friendsAndMore = results.rows;
        console.log("resultsin server friendsandwanna", results);
        res.json({
            sucess: true,
            friendsAndMore,
        });
    } catch (error) {
        console.log("error friends aand wanna", error);
        res.json({
            success: false,
            error: true,
        });
    }
});
// GET /friends-wannabees route (NEW) -
// this route will retrieve the list of friends and
// wannabees from the
// database and send it back to the client.

//////
// BELOW IS ALL THE CODE FOR MY SOCKETS COMMUNICATION
io.on("connection", async (socket) => {
    try {
        if (!socket.request.session.user_id) {
            return socket.disconnect(true);
        }
        const userId = socket.request.session.user_id;
        console.log(
            `User with id: ${userId} and socket.id ${socket.id}, just connected`
        );

        //in here we do our emitting on every new connection! Like when the user first
        // connect we want to sent them the chat history
        // 1. get the messages from the database
        try {
            const { rows: messages } = await db.last10Msg();
            console.log("messages received from [db]", messages);
            // ...
            // 2. send them over to the socket that just connected
            socket.emit("last-10-messages", {
                messages,
            });
        } catch (error) {
            console.log("error 10 msg", error);
        }

        try {
            socket.on("new-message", async (newMsg) => {
                console.log("new-message:", newMsg);
                // 1. we want to know who send the message
                console.log("author of the msg was user with id:", userId);
                // 2. we need to add this msg to the chats table
                // 3. we want to retrieve user information about the author
                // 4. compose a message object that contains user info, and message
                // 5. send back to all connect sockets, that there is a new msg to add
                io.emit("add-new-message", newMsg);
            });
        } catch (error) {
            console.log("error");
        }
    } catch (error) {
        console.log("eror", error);
    }
});
// chat messages "/chat"
// app.get("/chat", async (req, res) => {
//     try {
//         const results = await db.last10Msg(req.session.user_id);
//         const messages = results.rows;
//         console.log("results in last10Msg", results);
//         res.json({
//             sucess: true,
//             messages,
//         });
//     } catch (error) {
//         console.log("error last10Msg", error);
//         res.json({
//             success: false,
//             error: true,
//         });
//     }
// });

///
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
