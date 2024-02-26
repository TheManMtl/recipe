const User = require("../models/users.model");
const Auth = require("../utils/auth");
//const reduce = require('image-blob-reduce')();



//Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    var isValidResult = isUserValid(req, res);
    if (isValidResult === true) {


        const user = new User({
            username: req.body.username,
            email: req.body.email,
            fullName: req.body.fullName,
            isDeleted: 0,
            // FIXME: only admin can create admins, anonymous registration only creates users
            role: req.body.role || 'User',
            password: Auth.hash(req.body.password),
            profileImg: Buffer.from(req.body.profileImg, "base64"),
            mimeType: req.body.mimeType,
            //ElementInternal
        });

        User.create(user, (err, data) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.search("email") == -1) {
                        res.status(409).send({
                            message: "This username is already in use"
                        });
                    } else {
                        res.status(409).send({
                            message: "This email is already in use"
                        });
                    }
                } else {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the ToDo."
                    });
                }
            } else {
                delete data["password"];
                res.status(201).send(data);
            }
        });
    }
};

//admin
exports.findUsernameByEmail = (req, res) => {

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.query.email)) {
        res.status(404).send({
            message: "This is not a valid email."
        });
        return;
    }

    User.findByEmailAll(req.query.email, (err, data) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).send({ message: "Username not in use", valid: true })
            } else {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving user data."
                });
            }
        } else {
            res.status(200).send(data);
        }
    })


}

exports.findUsername = (req, res) => {
    if (!/^([a-zA-Z0-9_]){5,45}$/.test(req.query.username)) {
        res.status(404).send({
            message: "This is not a valid username."
        });
        return;
    }

    User.findByUsername(req.query.username, (err, item) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).send({ message: "Username not in use", valid: true })
            } else {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving user data."
                });
            }
        } else {
            res.status(200).send({ message: "Username is in use", valid: false });
        }
    })

}

exports.findEmail = (req, res) => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.query.email)) {
        res.status(404).send({
            message: "This is not a valid email."
        });
        return;
    }

    User.findByEmail(req.query.email, (err, item) => {
        if (err) {
            if (err.kind == "not_found") {
                res.status(200).send({ message: "Email not in use", valid: true })
            } else {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving user data."
                });
            }
        } else {
            res.status(200).send({ message: "Email is in use", valid: false });
        }
    })

}

// Find currently authenticated user info (good for login testing) - minimizing code duplication
exports.findMe = (req, res) => {
    Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
        res.status(200).send(user);
    });
};


function isUserValid(req, res) {
    //console.log("isValid: ",res);
    if (req.body.id) {
        res.status(400).send({
            message: "id is provided by the system. User not saved",
            result: false
        });
        return false;
    }
    if (req.body.username === undefined || req.body.password === undefined || req.body.email === undefined) {
        res.status(400).send({ message: "username, password, and email must be provided" });
        return false;
    }
    let username = req.body.username;
    if (!username.match(/^[a-zA-Z0-9_]{5,45}$/)) {
        res.status(400).send({ message: "username must be 5-45 characters long made up of letters, digits and underscore" });
        return false;
    }
    if (!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,32}$/)) {
        res.status(400).send({ message: "Password must be between 6 and 13 characters long, and contain at least one digit, one uppercase letter, and one lowercase letter" });
        return false;
    }
    if (!req.body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        res.status(400).send({ message: "Email must be in valid email format" });
        return false;
    }
    if (req.body.role !== undefined) {
        if (req.body.role != "User" && req.body.isDone !== "Admin") {
            res.status(400).send({ message: "Role must be User or Admin" });
            return false;
        }
    }
    return true;
}


// Get user avatar image data
exports.getImg = (req, res) => {
    User.getImg(req.params.username, (err, item) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user data."
            });
        } else {
            res.contentType(item.mimeType).status(200).send(item.profileImg);
        }
    })
}

// Get user id by username
exports.getId = (req, res) => {
    User.GetIdByUsername(req.params.username, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user data."
            });
        } else {
            res.status(200).send(data);
        }
    })
}

// update user image (file and mimetype)
exports.updateImg = (req, res) => {
    Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
        const userReq = new User({
            profileImg: Buffer.from(req.body.profileImg, "base64"),
            mimeType: req.body.mimeType
        });
        User.newImg(req.params.username, userReq, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with username ${req.params.username}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating recipe with username " + req.params.username
                    });
                }
            } else res.status(200).send(data);
        }
        );
    })
}

exports.findAll = (req, res) => {
    User.getAllusers(

        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `users not found`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving users"
                    });
                }
            } else {

                console.log('findAll users: data.length=>', data.length)
                if (validationGet(res, data)) {// if not empty 

                    /*  for (const key in data) {
 
                         data[key]['cleanDate'] = formatDate(new Date(data[key]['date']), 'yyyy-mm-dd')
                     } */

                    res.status(200).send(data);

                }
            }
        });
}


function validationGet(res, data) {

    if (data.length < 1) {// if no user-- data is empty []

        res.status(200).send("message: no users yet!");
        return false;
    }

    return true;
}



