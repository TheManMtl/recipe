module.exports = app => {
    const comment = require("../controllers/comments.controller.js");

    var router = require("express").Router();

    // create new comment
    router.post("/", comment.create);

    // Retrieve all comment
    //sample url : http://localhost:8500/api/comments/2
    router.get("/:id([0-9]+)", comment.findNotDeletedByrecipe);

        // Retrieve all comment
    //sample url : http://localhost:8500/api/comments/2
    router.get("/recipe/:id", comment.getPublicByRecipe);

    // Update a comment with comment id
    router.patch("/:id([0-9]+)", comment.updateText);


    // helpful handler comment with comment id
    //sample url: http://localhost:8500/api/comments/helpful/2/1
    router
        .get("/helpful/:cId([0-9]+)/:uId([0-9]+)",
            comment.helpfulHandler);


    //admin get all comments
    router.get("/admin", comment.findAll);

    app.use('/api/comments', router);
};