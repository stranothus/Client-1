/* get requirements */

const fs = require("fs");
const express = require("express");
const multer = require("multer");
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { genSalt, genHash, checkHash } = require("./utils/encrypt.js");
const sendEmail = require("./utils/sendEmail.js");
const createHTML = require("./utils/createHTML.js");

dotenv.config();

const domainName = "https://localhost:3030";
const dbPass = process.env["db_pass"];


const log = (type, log) => {
	fs.readFile(__dirname + `/logs.txt`, "utf-8", (err, content) => {
		if(err) {
			console.error(err);
		}

		content += `\n\n${Date()} - [${type}] ${log}`;

		fs.writeFile(__dirname + `/logs.txt`, content, () => {});
	});
};


/* initiate requirements */


const app = express();


const storage = multer.diskStorage({
	destination : function (req, file, cb) {
		cb(null, __dirname + "/public/images");
	},
	filename : function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage : storage });
const loggedIn = (req, res, next) => {
    if(req.cookies.token) {
        try {
            req.loggedIn = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        } catch(e) {
            req.loggedIn = false;
        }
    } else {
        req.loggedIn = false;
    }

    next();
}


/* create middleware */


app.use(express.json());
app.use(upload.array("file"));
app.use(cookieParser());
app.use(express.static(__dirname + "/public/"));
app.use(loggedIn);


/* create functions for later use */

const DB = new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb+srv://Stranothus:${dbPass}@cluster0.u2xxq.mongodb.net/users?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        let dbo = db.db("users");
        dbo.collection("accounts").findOne({ "emails" : email }, async function(err, result) {
            if(err) console.error(err);

            resolve(result);
        });
    });
});


/**
 * Get a user's info from the database based off of email
* 
* @param email {string} - the user to access
* 
* @param callback {function} - the cb function to run with the user file as a parameter
* 
* @returns {void}
*/

const userInfo = (email, callback) =>  {
    DB.db("users").collection("accounts").findOne({ "emails" : email }, (err, result) => {
        if(err) console.error(err);

        callback(result);
    });
};


/* Serving pages */


app.get("/", (req, res) => {
    if(req.loggedIn) {
        res.redirect("/home");
    } else {
        res.redirect("/signup");
    }
});


/* serve static files */


app.get("/about", (req, res) => {
	res.sendFile(__dirname + "/public/views/about.html");
});


app.get("/blog", (req, res) => {
	res.sendFile(__dirname + "/public/views/blog.html");
});


app.get("/books", (req, res) => {
	res.sendFile(__dirname + "/public/views/books.html");
});


app.get("/create-story", (req, res) => {
	res.sendFile(__dirname + "/public/views/create-story.html");
});


app.get("/create-write", (req, res) => {
	res.sendFile(__dirname + "/public/views/create-write.html");
});


app.get("/footer", (req, res) => {
	res.sendFile(__dirname + "/public/views/footer.html");
});


app.get("/forgot-password", (req, res) => {
	res.sendFile(__dirname + "/public/views/forgot-password.html");
});


app.get("/home", (req, res) => {
	res.sendFile(__dirname + "/public/views/home.html");
});


app.get("/login", (req, res) => {
	res.sendFile(__dirname + "/public/views/login.html");
});


app.get("/loginF1", (req, res) => {
	res.sendFile(__dirname + "/public/views/loginF1.html");
});


app.get("/loginF2", (req, res) => {
	res.sendFile(__dirname + "/public/views/loginF2.html");
});


app.get("/quick-write/:name", (req, res) => {
	res.sendFile(__dirname + "/public/views/quick-write.html");
});


app.get("/reset-password", (req, res) => {
	res.sendFile(__dirname + "/public/views/reset-password.html");
});


app.get("/email-sent", (req, res) => {
	res.sendFile(__dirname + "/public/views/reset-sent.html");
});


app.get("/short-story/:name", (req, res) => {
	res.sendFile(__dirname + "/public/views/short-story.html");
});


app.get("/signup", (req, res) => {
	res.sendFile(__dirname + "/public/views/signup.html");
});


/* serving files based off of account type */


app.get("/api/stories-script", (req, res) => {
    if(req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            res.sendFile(__dirname + "/public/scripts/stories/admin.js");
        } else {
            res.sendFile(__dirname + "/public/scripts/stories/normal.js");
        }
    } else {
        res.sendFile(__dirname + "/public/scripts/stories/normal.js");
    }
});


app.get("/api/story-script", (req, res) => {
    if(req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            res.sendFile(__dirname + "/public/scripts/story/admin.js");
        } else {
            res.sendFile(__dirname + "/public/scripts/story/user.js");
        }
    } else {
        res.sendFile(__dirname + "/public/scripts/story/anon.js");
    }
});


app.get("/api/blog-script", (req, res) => {
    if(req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            res.sendFile(__dirname + "/public/scripts/blog/admin.js");
        } else {
            res.sendFile(__dirname + "/public/scripts/blog/user.js");
        }
    } else {
        res.sendFile(__dirname + "/public/scripts/blog/anon.js");
    }
});


app.get("/api/write-script", (req, res) => {
    if(req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            res.sendFile(__dirname + "/public/scripts/write/admin.js");
        } else {
            res.sendFile(__dirname + "/public/scripts/write/user.js");
        }
    } else {
        res.sendFile(__dirname + "/public/scripts/write/anon.js");
    }
});


app.get("/mail-list", (req, res) => {
    if(req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            res.sendFile(__dirname + "/public/views/mail-list/admin.html");
        } else {
            if(req.loggedIn["mail list"]) {
                res.sendFile(__dirname + "/public/views/mail-list/user/on.html");
            } else {
                res.sendFile(__dirname + "/public/views/mail-list/user/off.html");
            }
        }
    } else {
        res.sendFile(__dirname + "/public/views/login.html");
    }
});


/* api */


app.post("/api/create-story", (req, res) => {
	var body = req.body;
	var image = req.files[0] || { filename : "anna.jpeg" };

    if(body.title && body.story && req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            let obj = {
                "image" : "/images/" + image.filename,
                "title" : body.title,
                "created" : String(new Date()),
                "preview" : body.story.substring(0, 100),
                "content" : body.story,
                "replies" : []
            };

            DB.db("writing").collection("stories").insertOne(obj, function(err, result) {
                if(err) console.error(err);

                log("POST", "New story created");
                res.status(200).redirect("/books");
            });
        } else {
            log("POST", "Non admin story creation attempt");
            res.status(403).redirect("/books");
        }
    } else {
        if(req.loggedIn) {
            log("POST", "Malformed story creation attempt");
            res.status(400).send();
        } else {
            log("POST", "Non logged in story creation attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.post("/api/edit-story", (req, res) => {
	var body = req.body;
	var image = req.files[0] || { filename : "anna.jpeg" };

    if(req.loggedIn && body.created && body.title && body.story) {
        if(req.loggedIn.perms === "admin") {
            let dbo = db.db("writing");
            let obj = {
                image : "/images/" + image.filename,
                title : body.title,
                preview : body.story.substring(0, 100),
                content : body.story,
                replies : []
            };

            DB.db("writing").collection("stories").updateOne({ "created" : body.created }, { "$set" : obj }, function(err, result) {
                if(err) console.error(err);

                log("PUT", "Story edited");
                res.status(200).redirect("/books");
            });
        } else {
            log("PUT", "Non admin story edit attempt");
            res.status(403).redirect("/books");
        }
    } else {
        if(req.loggedIn) {
            log("PUT", "Malformed story edit attempt");
            res.status(400).send();
        } else {
            log("PUT", "Non looged in story edit attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.post("/api/delete-story", (req, res) => {
	var body = req.body;

    if(req.loggedIn && body.created) {
        if(req.loggedIn.perms === "admin") {
            DB.db("writing").collection("stories").deleteOne({ "created" : body.created }, function(err, result) {
                if(err) console.error(err);

                log("DELETE", "Story deleted");
                res.status(200).redirect("/books");
            });
        } else {
            log("DELETE", "Non admin story deletion attempt");
            res.status(403).redirect("/books");
        }
    } else {
        if(req.loggedIn) {
            log("DELETE", "Malformed story deletion attempt");
            res.status(400).send();
        } else {
            log("DELETE", "Non logged in story deletion attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.get("/api/short-story/:title", (req, res) => {
	var params = req.params;

    DB.db("writing").collection("stories").findOne({ "title" : params.title }, function(err, result) {
        if(err) console.error(err);

        res.json(result);
    });
});


app.post("/api/create-write", (req, res) => {
	var body = req.body;
	var image = req.files[0] || { filename : "anna.jpeg" };

    if(body.title && body.write && req.loggedIn) {
        if(req.loggedIn.perms === "admin") {
            let obj = {
                "image" : "/images/" + image.filename,
                "title" : body.title,
                "created" : String(new Date()),
                "preview" : body.write.substring(0, 100),
                "content" : body.write,
                "replies" : []
            };

            DB.db("writing").collection("quick writes").insertOne(obj, function(err, result) {
                if(err) console.error(err);

                log("POST", "Quick write creation");
                res.status(200).redirect("/books");
            });
        } else {
            log("POST", "Non admin quick write creation attempt");
            res.status(403).redirect("/books");
        }
    } else {
        if(req.loggedIn) {
            log("POST", "Malformed quick write creation attempt");
            res.status(400).send();
        } else {
            log("POST", "Non logged in quick write creation attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.post("/api/edit-write", (req, res) => {
	var body = req.body;
	var image = req.files[0] || { filename : "anna.jpeg" };

    if(req.loggedIn && body.created && body.write) {
        if(req.loggedIn.perms === "admin") {
            let obj = {
                image : "/images/" + image.filename,
                title : body.title,
                preview : body.write.substring(0, 100),
                content : body.write,
                replies : []
            };

            DB.db("writing").collection("quick writes").updateOne({ "created" : body.created }, { "$set" : obj }, function(err, result) {
                if(err) console.error(err);

                log("PUT", "Quick write edited");
                res.status(200).redirect("/books");
            });
        } else {
            log("PUT", "Non admin quick write edit attempt");
            res.status(403).redirect("/books");
        }
    } else {
        if(req.loggedIn) {
            log("PUT", "Malformed quick write edit attempt");
            res.status(400).send();
        } else {
            log("PUT", "Non logged in quick write edit attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.post("/api/delete-write", (req, res) => {
	var body = req.body;

    if(req.loggedIn && body.created) {
        if(req.loggedIn.perms === "admin") {
            DB.db("writing").collection("quick writes").deleteOne({ "created" : body.created }, function(err, result) {
                if(err) console.error(err);

                log("DELETE", "Quick write deleted");
                res.status(200).redirect("/books");
            });
        } else {
            log("DELETE", "Non admin quick write deletion attempt");
            res.status(403).redirect("/books");
        }
    } else {
        if(req.loggedIn) {
            log("DELETE", "Malformed quick write deletion attempt");
            res.status(400).send();
        } else {
            log("DELETE", "Non logged in quick write deletion attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.get("/api/quick-write/:title", (req, res) => {
	var params = req.params;

    DB.db("writing").collection("quick writes").findOne({ "title" : params.title }, function(err, result) {
        if(err) console.error(err);

        res.json(result);
    });
});


app.post("/story-post", (req, res) => {
	var body = req.body;

	switch(body.target) {
		case "write-post" :
            if(req.loggedIn && body.content && body.created) {
                if(req.loggedIn.perms !== "banned") {
                    let postObj = {
                        "name" : req.loggedIn.name,
                        "created" : String(new Date()),
                        "content" : body.content
                    };

                    DB.db("writing").collection("quick writes").updateOne({ "created" : body.created }, { "$push" : { "replies" : postObj }}, function(err, result) {
                        if(err) console.error(err);

                        log("POST", "Quick write reply posted");
                        res.status(200).redirect("/quick-write/" + body.title);
                    });
                } else {
                    log("POST", "Banned account quick write reply post attempt");
                    res.status(403).redirect("/quick-write/" + body.title);
                }
            } else {
                if(req.loggedIn) {
                    log("POST", "Malformed quick write reply post attempt");
                    res.status(400).send();
                } else {
                    log("POST", "Non logged in quick write reply post attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "write-edit" :
            if(req.loggedIn && body.content && body.postCreated && body.replyCreated) {
                if(req.loggedIn.perms !== "banned") {
                    let postObj = {
                        "replies.$created" : body.replyCreated,
                        "replies.$content" : body.content
                    };

                    let match;

                    if(req.loggedIn.perms === "admin") {
                        match = {
                            "created" : body.replyCreated
                        };
                    } else {
                        match = {
                            "created" : body.replyCreated,
                            "name" : req.loggedIn.name
                        };
                    }

                    DB.db("writing").collection("quick writes").updateOne({ "created" : body.postCreated, "replies" : { "$elemMatch" : match }}, { "$set" : postObj }, function(err, result) {
                        if(err) console.error(err);
                        
                        log("PUT", "Quick write reply edit");
                        res.status(200).redirect("/quick-write/" + body.title);
                    });
                } else {
                    log("PUT", "Banned account quick write reply edit attempt");
                    res.status(403).redirect("/quick-write/" + body.title);
                }
            } else {
                if(req.loggedIn) {
                    log("PUT", "Malformed quick write reply edit attempt");
                    res.status(400).send();
                } else {
                    log("PUT", "Non logged in quick write reply edit attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "write-delete" :
            if(req.loggedIn && body.postCreated && body.replyCreated) {
                if(req.loggedIn.perms !== "banned") {
                    let match;

                    if(req.loggedIn.perms === "admin") {
                        match = {
                            "created" : body.replyCreated
                        };
                    } else {
                        match = {
                            "created" : body.replyCreated,
                            "name" : req.loggedIn.name
                        };
                    }

                    DB.db("writing").collection("quick writes").updateOne({ "created" : body.postCreated }, { "$pull" : { "replies" : match }}, function(err, result) {
                        if(err) console.error(err);
                        
                        log("DELETE", "Quick write reply deleted");
                        res.status(200).redirect("/quick-write/" + body.title);
                    });
                } else {
                    log("DELETE", "Banned acount quick write reply deletion attempt");
                    res.status(403).redirect("/quick-write/" + body.title);
                }
            } else {
                if(req.loggedIn) {
                    log("DELETE", "Malformed quick write reply deletion attempt");
                    res.status(400).send();
                } else {
                    log("DELETE", "Non logged in quick write reply deletion attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "story-create" :
            if(req.loggedIn && body.content && body.created) {
                if(req.loggedIn.perms !== "banned") {
                    let postObj = {
                        "name" : req.loggedIn.name,
                        "created" : String(new Date()),
                        "content" : body.content
                    };

                    DB.db("writing").collection("stories").updateOne({ "created" : body.created }, { "$push" : { "replies" : postObj }}, function(err, result) {
                        if(err) console.error(err);

                        log("POST", "Story reply posted");
                        res.status(200).redirect("/short-story/" + body.title);
                    });
                } else {
                    log("POST", "Banned account story reply post attempt");
                    res.status(403).redirect("/short-story/" + body.title);
                }
            } else {
                if(req.loggedIn) {
                    log("POST", "Malformed story reply post attempt");
                    res.status(400).send();
                } else {
                    log("POST", "Non logged in story reply post attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "story-edit" :
            if(req.loggedIn && body.content && body.postCreated && body.replyCreated) {
                if(req.loggedIn.perms !== "banned") {
                    let postObj = {
                        "replies.$.created" : body.replyCreated,
                        "replies.$content" : body.content
                    };

                    let match;

                    if(req.loggedIn.perms === "admin") {
                        match = {
                            "created" : body.replyCreated
                        };
                    } else {
                        match = {
                            "created" : body.replyCreated,
                            "name" : req.loggedIn.name
                        };
                    }

                    DB.db("writing").collection("stories").updateOne({ "created" : body.postCreated, "replies" : { "$elemMatch" : match }}, { "$set" : postObj }, function(err, result) {
                        if(err) console.error(err);

                        log("PUT", "Story reply edit");
                        res.status(200).redirect("/short-story/" + body.title);
                    });
                } else {
                    log("PUT", "Banned account story reply edit attempt");
                    res.status(403).redirect("/short-story/" + body.title);
                }
            } else {
                if(req.loggedIn) {
                    log("PUT", "Malformed story reply edit attempt");
                    res.status(400).send();
                } else {
                    log("PUT", "Non logged in story reply edit attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "story-delete" :
            if(req.loggedIn && body.postCreated && body.replyCreated) {
                if(req.loggedIn.perms !== "banned") {
                    let match;

                    if(req.loggedIn.perms === "admin") {
                        match = {
                            "created" : body.replyCreated
                        };
                    } else {
                        match = {
                            "created" : body.replyCreated,
                            "name" : req.loggedIn.name
                        };
                    }

                    DB.db("writing").collection("stories").updateOne({ "created" : body.postCreated }, { "$pull" : { "replies" : match }}, function(err, result) {
                        if(err) console.error(err);

                        log("DELETE", "Story reply deleted");
                        res.status(200).redirect("/short-story/" + body.title);
                    });
                } else {
                    log("DELETE", "Banned acount story reply deletion attempt");
                    res.status(403).redirect("/short-story/" + body.title);
                }
            } else {
                if(req.loggedIn) {
                    log("DELETE", "Malformed story reply deletion attempt");
                    res.status(400).send();
                } else {
                    log("DELETE", "Non logged in story reply deletion attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		default :
			console.log(`Oop ${body.target} not exist, master of code, Quinn`);
	}
});


app.get("/api/confirmation-email", (req, res) => {
    if(req.loggedIn) {
        if(!req.loggedIn.confirmed) {
            DB.db("users").collection("accounts").findOne({ "email" : req.loggedIn.email }, function(err, result) {
                if(err) console.error(err);

                let token = jwt.sign(result, process.env.VERIFICATION_SECRET);

                sendEmail({
                    from : "bananablog001@gmail.com",
                    to : req.loggedIn.email,
                    subject : "Confirm your BananaBlog Account",
                    html : createHTML(`Confirm Account`, `
                        <header>
                            <h1>Confirm your account</h1>
                        </header>
                        <div id = "main">
                            <p>Follow the link below to confirm your BananaBlog account.</p>
                            <a href = "${domainName}/confirm-password?token=${token}">Confirm Account</a>
                        </div>
                    `)
                });

                log("POST", "Confirmation email sent");

                res.status(200).redirect("/email-sent");
            });
        } else {
            log("POST", "Unnecessary confirmation email attempt");
            res.status(403).redirect("/home");
        }
    } else {
        log("POST", "Malformed confirmation email attempt");
        res.status(401).redirect("/login");
    }
});


app.post("/api/login", (req, res) => {
	var body = req.body;

    if(body.email && body.password) {
        DB.db("users").collection("accounts").findOne({ "email" : body.email }, async function(err, result) {
            if(err) console.error(err);
            
            if(checkHash(body.password, result.hash)) {
                let token = jwt.sign(result, process.env.TOKEN_SECRET);

                log("POST", "Successful login to " + body.email + " with pasword " + body.password);

                res.cookie("token", token);
                res.status(200).redirect("/home");
            } else {
                log("POST", "Failed login to " + body.email + " with password " + body.password);
                res.status(400).redirect("/login");
            }
        });
    } else {
        log("POST", "Malformed login attempt");
        res.status(400).send();
    }
});


app.post("/api/create-account", (req, res) => {
	var body = req.body;

	if(body.name && body.password && body.email) {
        DB.db("users").collection("accounts").find({ "emails" : body.email }).toArray(async function(err, results) {
            if(err) console.error(err);

            if(!results.length) {
                let salt = await genSalt(Math.floor(Math.random() * 10));
                let hash = await genHash(body.password, salt);

                let userObj = {
                    "name" : body.name,
                    "email" : body.email,
                    "hash" : hash,
                    "perms" : "standard",
                    "mail list" : false,
                    "created" : String(new Date()),
                    "confirmed" : false
                };

                DB.db("users").collection("accounts").insertOne(userObj, function(err, result) {
                    if (err) console.error(err);

                    log("POST", "New account created for " + body.email);

                    let token = jwt.sign(userObj, process.env.TOKEN_SECRET);
                    res.cookie("token", token);

                    res.status(200).redirect("/api/confirmation-email");
                });
            } else {
                log("POST", "Duplicate account creation attempt");
                res.status(403).redirect("/login");
            }
        });
	} else {
        log("POST", "Malformed account creation attempt");
		res.status(400).send();
	}
});


app.post("/api/ban-account", (req, res) => {
	var body = req.body;

    if(req.loggedIn && body.name) {
        if(req.loggedIn.perms === "admin") {
            // user permissions become banned
            DB.db("users").collection("accounts").updateOne({ "name" : body.name }, { "perms" : "banned" }, () => db.close);
            // blog replies are deleted
            DB.db("writing").collection("blog").updateMany({ }, { "$pull" : { "replies" : { "name" : body.name }}}, () => db.close);
            // story replies are deleted
            DB.db("writing").collection("stories").updateMany({ }, { "$pull" : { "replies" : { "name" : body.name }}}, () => db.close);
            // quick write replies are deleted
            DB.db("writing").collection("quick writes").updateMany({ }, { "$pull" : { "replies" : { "name" : body.name }}}, () => db.close);

            log("POST", "Account " + body.name + " banned");

            res.status(200).send();
        } else {
            log("POST", "Non admin account ban attempt");
            res.status(403).redirect("/home");
        }
    } else {
        if(req.loggedIn) {
            log("POST", "Malformed account ban attempt");
            res.status(400).send();
        } else {
            log("POST", "Non logged in account ban attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.get("/confirm-password", (req, res) => {
	let queries = req.query;
    let token = jwt.verify(queries.token, process.env.VERIFICATION_SECRET);
    res.cookie("token", queries.token);

	res.send(`
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset = "utf-8">
				<title>Confirm Password</title>
				<link href="/styles/confirm-password.css" rel="stylesheet" type="text/css" />
			</head>
			<body>
				<h1>Did you create a BananaBlog account for ${token.email}?</h1>
				<form method = "POST" action = "/api/confirm-password">
					<input type = "hidden" name = "answer" value = "is me">
					<button>Yes, I created an account</button>
				</form>
				<form method = "POST" action = "/api/confirm-password">
					<input type = "hidden" name = "answer" value = "is not me">
					<button>No, I didn't create an account</button>
				</form>
			</body>
		</html>`);
});


app.post("/api/confirm-password", (req, res) => {
	let body = req.body;
    let token = jwt.verify(req.cookies.token, process.env.VERIFICATION_SECRET);
	
    if(token && body.answer) {
        if(body.answer === "is not me") {
            DB.db("users").collection("accounts").deleteOne({ "email" : token.email }, function(err, result) {
                if(err) console.error(err);

                log("POST", "Account denied " + token.email);
                
                res.clearCookie("token");
                res.status(200).redirect("/home");
            });
        } else {
            DB.db("users").collection("accounts").updateOne({ "email" : token.email }, { "$set" : { "confirmed" : true }}, function(err, result) {
                if(err) console.error(err);

                log("POST", "Account confirmed " + token.email);
                
                res.cookie("token", jwt.sign(result, process.env.TOKEN_SECRET));
                res.status(200).redirect("/home");
            });
        }
    } else {
        log("POST", "Malformed account confirmation");
        res.status(401).send();
    }
});


app.post("/api/forgot-password", (req, res) => {
	let body = req.body;

    if(body.email) {
        // find account associated with email
        DB.db("users").collection("accounts").findOne({ "email" : body.email }, function(err, result) {
            if(err) console.error(err);

            // create a VERIFICATION_SECRET jwt for the account
            let token = jwt.sign(result, process.env.VERIFICATION_SECRET);

            // email the account with a reset link with the jwt
            sendEmail({
                from : "bananablog001@gmail.com",
                to : body.email,
                subject : "Reset your BananaBlog Account Password",
                html : createHTML(`Reset Password`, `
                    <header>
                        <h1>Reset your BananaBlog Password</h1>
                    </header>
                    <div id = "main">
                        <p>Follow the link below to reset your password.</p>
                        <a href = "${domainName}/api/reset-password-email?token=${token}">Reset Password</a>
                    </div>
                `)
            });

            log("POST", "Password reset email sent for " + body.email);
            
            res.status(200).redirect("/email-sent");
        });
    } else {
        log("POST", "Malformed password reset email attempt");
    }
});


app.get("/reset-password-email", (req, res) => {
	let queries = req.query;
    let token = queries.token;

    res.cookie("token", token);
	res.send(`
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset = "utf-8">
				<title>Reset Password</title>
				<link href="/styles/login.css" rel="stylesheet" type="text/css" />
			</head>
			<body>
				<form method = "POST" action = "/api/reset-password" id = "login">
					<h1>New password</h1>
					<input type = "password" name = "password" placeholder = "New password">
					<input type = "submit" value = "Set password">
				</form>
			</body>
		</html>`);
});


app.post("/api/reset-password", async (req, res) => {
	let body = req.body;
    let token = jwt.verify(req.cookies.token, process.env.VERIFICATION_SECRET);

    if(token) {
        let salt = await genSalt(Math.floor(Math.random() * 10));
        let hash = await genHash(body.password, salt);

        DB.db("users").collection("accounts").updateOne({ "email" : token.email }, { "hash" : hash }, function(err, result) {
            if(err) console.error(err);

            log("POST", "Password reset for " + body.email);
            
            res.cookie("token", jwt.sign(result, process.env.TOKEN_SECRET));
            res.status(200).redirect("/home");
        });
    } else {
        log("POST", "Malformed password reset via email");
        res.status(401).redirect("/home");
    }
});


app.post("/api/new-password", (req, res) => {
    let body = req.body;

    if(body.password && body.newPassword && body.email) {
        DB.db("users").collection("accounts").findOne({ "email" : body.email }, async function(err, result) {
            if(err) console.error(err);

            if(await checkHash(body.password, result.hash)) {
                let salt = await genSalt(Math.floor(Math.random() * 10));
                let hash = await genHash(body.newPassword, salt);

                DB.db("users").collection("accounts").updateOne({ "email" : body.email }, { "$set" : { "hash" : hash }}, function(err, result) {
                    if(err) console.error(err);

                    log("POST", "New password for " + body.email);

                    let token = req.loggedIn;
                    token.hash = hash;
                    token = jwt.sign(token, process.env.TOKEN_SECRET);

                    res.cookie("token", token);
                    res.status(200).redirect("/home");
                });
            } else {
                log("POST", "Incorrect password new password attempt");
                res.status(400).redirect("/reset-password");
            }
        })
    } else {
        log("POST", "Malformed new password attempt");
        res.status(400).redirect("/reset-password");
    }
});


app.get("/logout", (req, res) => {
    log("N/A", "Cookies cleared");

	res.clearCookie("token");
	res.redirect("/login");
});


app.get("/api/is-logged-in", (req, res) => {
    res.send(!!req.loggedIn);
});


app.post("/blog", (req, res) => {
	var body = req.body;

	switch(body.target) {
		case "create-post" :
            if(req.loggedIn && body.title && body.content && body.topics) {
                if(req.loggedIn.perms === "admin") {                            
                    let postObj = {
                        "title" : body.title,
                        "content" : body.content,
                        "created" : String(new Date()),
                        "topics" : body.topics.replace(/\s*,\s*/g, ",").split(","),
                        "replies" : []
                    };

                    DB.db("writing").collection("blog").insertOne(postObj, function(err, result) {
                        if(err) console.error(err);

                        log("POST", "New blog post created");
                        
                        res.status(200).redirect("/blog");
                    });
                } else {
                    log("POST", "Non admin blog post creation attempt");
                    res.status(400).send();
                }
            } else {
                if(req.loggedIn) {
                    log("POST", "Malformed blog post creation attempt");
                    res.status(400).send();
                } else {
                    log("POST", "Non logged in blog post creation attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "edit-post" :
            if(req.loggedIn && body.title && body.content && body.topics && body.created) {
                if(req.loggedIn.perms === "admin") {
                    let postObj = {
                        "title" : body.title,
                        "content" : body.content,
                        "topics" : body.topics.replace(/\s*,\s*/g, ",").split(","),
                    };

                    DB.db("writing").collection("blog").updateOne({ "created" : body.created }, { "$set" : postObj }, function(err, result) {
                        if(err) console.error(err);

                        log("PUT", "Blog post edited");
                        
                        res.status(200).redirect("/blog");
                    });
                } else {
                    log("PUT", "Non admin blog post edit attempt");
                    res.status(400).send();
                }
            } else {
                if(req.loggedIn) {
                    log("PUT", "Malformed blog post edit attempt");
                    res.status(400).send();
                } else {
                    log("PUT", "Non logged in blog post edit attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "delete-post" :
            if(req.loggedIn && body.created) {
                if(req.loggedIn.perms === "admin") {
                    DB.db("writing").collection("blog").deleteOne({ "created" : body.created }, function(err, result) {
                        if(err) console.error(err);

                        log("DELETE", "Blog post deleted");
                        
                        res.status(200).redirect("/blog");
                    });
                } else {
                    log("DELETE", "Non admin blog post deletion attempt");
                    res.status(400).send();
                }
            } else {
                if(req.loggedIn) {
                    log("DELETE", "Malformed blog post deletion attempt");
                    res.status(400).send();
                } else {
                    log("DELETE", "Non logged in blog post deletion attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "create-reply" :
            if(req.loggedIn && body.content && body.created) {
                if(req.loggedIn.perms !== "banned") {
                    let postObj = {
                        "name" : req.loggedIn.name,
                        "created" : String(new Date()),
                        "content" : body.content
                    };

                    DB.db("writing").collection("blog").updateOne({ "created" : body.created }, { "$push" : { "replies" : postObj }}, function(err, result) {
                        if(err) console.error(err);

                        log("POST", "Blog post reply created");

                        res.status(200).redirect("/blog");
                    });
                } else {
                    log("POST", "Banned account blog post reply creation attempt");
                    res.status(403).redirect("/blog");
                }
            } else {
                if(req.loggedIn) {
                    log("POST", "Malformed blog post reply creation attempt");
                    res.status(400).send();
                } else {
                    log("POST", "Non logged in blog post reply creation attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "edit-reply" :
            if(req.loggedIn && body.content && body.postCreated && body.replyCreated) {
                if(req.loggedIn.perms !== "banned") {
                    let postObj = {
                        "replies.$.created" : body.replyCreated,
                        "replies.$.content" : body.content
                    };

                    let match;

                    if(req.loggedIn.perms === "admin") {
                        match = {
                            "created" : body.replyCreated
                        };
                    } else {
                        match = {
                            "created" : body.replyCreated,
                            "name" : req.loggedIn.name
                        };
                    }

                    DB.db("writing").collection("blog").updateOne({ "created" : body.postCreated, "replies" : { "$elemMatch" : match }}, { "$set" : postObj }, function(err, result) {
                        if(err) console.error(err);

                        log("PUT", "Blog post reply edited");

                        res.status(200).redirect("/blog");
                    });
                } else {
                    log("PUT", "Banned account blog post reply edit");
                    res.status(403).redirect("/blog");
                }
            } else {
                if(req.loggedIn) {
                    log("PUT", "Malformed blog post reply edit");
                    res.status(400).send();
                } else {
                    log("PUT", "Non logged in blog post reply edit");
                    res.status(401).redirect("/login");
                }
            }
		break;
		case "delete-reply" :
            if(req.loggedIn && body.postCreated && body.replyCreated) {
                if(req.loggedIn.perms !== "banned") {
                    let match;

                    if(req.loggedIn.perms === "admin") {
                        match = {
                            "created" : body.replyCreated
                        };
                    } else {
                        match = {
                            "created" : body.replyCreated,
                            "name" : req.loggedIn.name
                        };
                    }

                    DB.db("writing").collection("blog").updateOne({ "created" : body.postCreated }, { "$pull" : { "replies" : match }}, function(err, result) {
                        if(err) console.error(err);

                        log("DELETE", "Blog post reply deleted");

                        res.status(200).redirect("/blog");
                    });
                } else {
                    log("DELETE", "Banned account blog post reply deletion attempt");
                    res.status(403).redirect("/blog");
                }
            } else {
                if(req.loggedIn) {
                    log("DELETE", "Malformed blog post reply deletion attempt");
                    res.status(400).json(req.body);
                } else {
                    log("DELETE", "Non logged in blog post reply deletion attempt");
                    res.status(401).redirect("/login");
                }
            }
		break;
		default :
			console.log("Oop that not exist, master of code, Quinn");
	}
});


app.post("/api/mail-list", (req, res) => {
	let body = req.body;

    if(req.loggedIn && body.title && body.content) {
        if(req.loggedIn.perms === "admin") {
            DB.db("users").collection("accounts").find({ "mail list" : true }, { "email" : 1, "_id" : 0 }).toArray(function(err, results) {
                if(err) console.error(err);

                let mailOptions = {
                    from : 'bananablog001@gmail.com',
                    subject : body.title,
                    text : body.content,
                    html : createHTML(body.title, `
                        <header>
                            <h1>${body.title}</h1>
                        </header>
                        <div id = "main">${body.content}</div>
                        <div id = "links">
                            <a href = "${domainName}/home" class = "link">
                                <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Bookshelf.jpg/1200px-Bookshelf.jpg">
                                <h2>Lorem Ispum</h2>
                            </a>
                            <a href = "${domainName}/blog" class = "link">
                                <img src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Writing_a_letter.jpg/800px-Writing_a_letter.jpg">
                                <h2>Lorem Ispum</h2>
                            </a>
                        </div>
                    `)
                };

                for(let i = 0; i < results.length; i++) {
                    mailOptions.to = results[i].email;

                    sendEmail(mailOptions);
                }

                log("POST", "Mail list email sent");

                res.status(200).redirect("/mail-list");
            });
        } else {
            log("POST", "Non admin mail list email attempt");
            res.status(403).send();
        }
    } else {
        if(req.loggedIn) {
            log("POST", "Malformed mail list email attempt");
            res.status(400).send();
        } else {
            log("POST", "Non logged in mail list email attempt");
            res.status(401).redirect("/login");
        }
    }
});


app.post("/api/mail-list-subscribe", (req, res) => {
    if(req.loggedIn) {
        DB.db("users").collection("accounts").updateOne({ "email" : req.loggedIn.email }, { "$set" : { "mail list" : true }}, function(err, result) {
            if(err) console.error(err);

            log("POST", "Email list added for " + req.loggedIn.email);

            let token = req.loggedIn;
            token["mail list"] = true;
            token = jwt.sign(token, process.env.TOKEN_SECRET);

            res.cookie("token", token);
            res.status(200).redirect("/mail-list");
        });
    } else {
        res.status(401).redirect("/login");
    }
});


app.post("/api/mail-list-unsubscribe", (req, res) => {
    if(req.loggedIn) {
        DB.db("users").collection("accounts").updateOne({ "email" : req.loggedIn.email }, { "$set" : { "mail list" : false }}, function(err, result) {
            if(err) console.error(err);

            log("POST", "Email list removed for " + req.loggedIn.email);

            let token = req.loggedIn;
            token["mail list"] = false;
            token = jwt.sign(token, process.env.TOKEN_SECRET);

            res.cookie("token", token);
            res.status(200).redirect("/mail-list");
        });
    } else {
        res.status(401).redirect("/login");
    }
});


/* GET info */


app.get("/api/blog-posts", (req, res) => {
    DB.db("writing").collection("blog").find({ }).toArray(function(err, results) {
        if(err) console.error(err);

        res.json(results);
    });
});


app.get("/api/stories", (req, res) => {
    DB.db("writing").collection("stories").find({ }).toArray(function(err, results) {
        if(err) console.error(err);

        res.json(results);
    });
});


app.get("/api/quick-writes", (req, res) => {
    DB.db("writing").collection("quick writes").find({ }).toArray(function(err, results) {
        if(err) console.error(err);

        res.json(results);
    });
});


app.get("/api/user", (req, res) => {
    res.json(req.loggedIn.name);
});


/* set up the port */


app.listen(3030, () => {
    log("N/A", "Server restarted");
	console.log("Listening on port 3030");
});