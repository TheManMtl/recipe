module.exports = app => {
    const users = require("../controllers/users.controller.js");
  
    var router = require("express").Router();

    // retrieve user image from recipe

    // TEST--ORIGINAL BELOW
    router.get("/img/:username", users.getImg);

    // ORIGINAL
    //router.get("/img/:id", users.getImg);

    // get id by username
    router.get("/id/:username", users.getId);


    //register new user
    router.post("/", users.create); 

    // Validate authentication, similar to /:id
    router.get('/me', users.findMe);

    //update user image
    // TEST--ORIGINAL BELOW
    router.patch("/img/:username", users.updateImg);

    // ORIGINAL
    //router.patch("/img/:id", users.updateImg);

    router.get("/exists/username", users.findUsername);

    // retrieve a user by email for admin
    router.get("/exists/admin/email", users.findUsernameByEmail);

    router.get("/exists/email", users.findEmail);

    router.get("/",users.findAll);
  
    app.use('/api/users', router);
  };



