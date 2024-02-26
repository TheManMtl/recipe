const User = require("../models/users.model");
const { createHash } = require('crypto');

exports.hash = (string) => {
    return createHash('sha256').update(string).digest('hex');
}
// role = admin/user!! 
// Use this where auth required 



exports.execIfAuthValid = (req, res, role, callIfAuth) => {
   // console.log(JSON.stringify(req.headers)); // debugging only
    if (req.headers['x-auth-username'] === undefined || req.headers['x-auth-password'] == undefined) {
        console.log("no x-auth-* headers received");
        res.status(403).send({
            message: 'Authentication required but not provided'
        });
        return;
    }
    let username = req.headers['x-auth-username'];
    let password = req.headers['x-auth-password'];
    let passwordHash = exports.hash(password);
   console.log("Username: " + username + ", password: " + password + ", passHash: " + passwordHash);    
    User.findByUsername(username, (err, user) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving ToDo with id " + req.params.id
                });
            }
        } else {
            //console.log('User found: ' + JSON.stringify(user));

            if (user.password == passwordHash) {
                delete user.password; // don't send pw back
                // We will always provide a role 
                    // User role auth
                    console.log(user.role + " user role")
                    console.log(role + " role")
                    if (role.includes(user.role)) {
                        callIfAuth(req, res, user); // *the* call
                    } else {
                        res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                            message: 'Authentication invalid'
                        });
                    }
            } else {
                // password auth
                res.status(403).send({ // (*) identical reaction wheter user was not found or password was invalid or wrong role
                    message: 'Authentication invalid'
                });
            }
        }
    });

}
// // USE THIS 

// Auth.execIfAuthValid(req, res, [ "ROLE(S)"  ], (req, res, user) => {

// // CODE IN HERE 

// })