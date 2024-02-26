module.exports = app => {
    const recipe = require("../controllers/recipes.controller.js");

    var router = require("express").Router();

    // TODO: regex

    // returns all recipes, sort by not validated, (auto date)
    router.get("/", recipe.findAll);

    router.get("/user", recipe.getAllByUser);

    router.get("/:id", recipe.getOne);

    router.get("/user/me", recipe.getAllMine);

    router.get("/user/me/:id", recipe.getMyOne);

    router.get("/img/:id", recipe.getOneImg);

    router.patch("/img/:id", recipe.updateImg);
    
    router.post("/", recipe.createNewRecipe);

    router.put("/:id", recipe.update);

    router.patch("/notes/:id", recipe.updateNotes);

    router.patch("/privacy/:id", recipe.updatePrivacy);

    router.delete("/:id", recipe.delete);

    // ADMIN

    router.get("/admin/users/:userId", recipe.adminGetAllByUser);

    router.get("/admin/recipe/:id", recipe.adminGetOne);

    router.get("/admin/recipe/img/:id", recipe.adminGetOneImg);


    // optional parameter: deleted - shows only deleted, no query shows all live
    router.get("/admin/all", recipe.adminFindAll);

    // IS THIS A POST? A PUT?? jnsais pas
    router.post("/admin/restore/:id", recipe.undelete)


    app.use('/api/recipes', router);


};