const conDb = require("./db.js");


// constructor
const Recipes = function (recipe) {

    this.id = recipe.id
    this.userId = recipe.userId
   // this.email = recipe.email
    this.author = recipe.author
    this.username = recipe.username
    this.title = recipe.title
    this.date = recipe.date
    this.description = recipe.description
    this.instructions = recipe.instructions
    this.notes = recipe.notes
    this.ingredients = recipe.ingredients
    this.status = recipe.status
    //IMG 
    this.data = recipe.data
    this.mimeType = recipe.mimeType
    // CHANGE
    this.tags = recipe.tags
    this.isDeleted = recipe.isDeleted
    this.cookTime = recipe.cookTime
    this.yield = recipe.yield

};




Recipes.adminGetAll = (deleted, result) => {
  const isDeleted = deleted ? true : false;
    // TODO: ALL, undeleted, deleted 
    var query = conDb.format(
              `SELECT   u.email, u.username , r.title, r.date, r.description, r.instructions, r.notes, 
              r.ingredients, r.status, r.tags, r.cookTime, r.yield
              FROM recipes r
              INNER JOIN users u 
              ON r.userId = u.id
              ORDER BY r.date ASC, r.isDeleted `
              );
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } 
        result(null, res);
    });
};


Recipes.getAll = (sortOrder, result) => {
  const sortBy = sortOrder ? sortOrder : "date"; 
    var query = conDb.format(
    `SELECT u.fullName AS author, u.username AS username, r.id, r.title, r.date, r.description, r.instructions, r.notes, 
    r.ingredients, r.status, r.tags, r.cookTime, r.yield FROM recipes r
    INNER JOIN users u 
    ON r.userId = u.id
    WHERE r.isDeleted = false AND r.status = "public" ORDER BY r.?? ASC`, [sortBy]);
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } 
        result(null, res);
    });
};

Recipes.getAllByUser = (username,  result) => {
  let query = conDb.format(
      `SELECT r.title, r.date, r.description, r.instructions, r.notes, 
      r.ingredients, r.tags, r.cookTime, r.yield FROM recipes r 
      INNER JOIN users u 
      ON r.userId = u.id
      WHERE r.isDeleted = false AND r.status = "public" AND u.username = ?`, [username]);
     

    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } 
        result(null, res);
    });
};

Recipes.adminGetAllByUser = (userId, result) => {
  let query = conDb.format( 
    `SELECT title, date, description, instructions, notes, 
    ingredients, tags, cookTime, yield, status, isDeleted FROM recipes 
    WHERE userId = ?`, [userId]);

    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } 
        result(null, res);
    });
}


Recipes.getAllMy = (userId, result) => {
  let query = conDb.format(
      `SELECT title, date, description, instructions, notes, 
      ingredients, tags, cookTime, yield FROM recipes 
      WHERE isDeleted = false AND userId = ?`, [userId]);
  

  conDb.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      } 
      result(null, res);
  });
};


Recipes.getOne = (id, result) => {
      var query = conDb.format(
        `SELECT u.fullName AS author, u.username AS username, r.id, r.title, r.date, r.description, r.instructions, r.notes, 
        r.ingredients, r.status, r.tags, r.cookTime, r.yield FROM recipes r
        INNER JOIN users u 
        ON r.userId = u.id
        WHERE r.id = ? AND status = "public" AND r.isDeleted = false`, [id]);
      conDb.query(query, (err, res) => {
          if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
          } 
          result(null, res[0]);
      });
  };

Recipes.getMyOne = (userId, id, result) => {
    var query = conDb.format(
    `SELECT title, date, description, instructions, notes, 
    ingredients, status, tags, cookTime, yield FROM recipes WHERE id = ? AND isDeleted = false
    AND userId = ? `, [id, userId]);
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } 
        result(null, res[0]);
    });
};

Recipes.adminGetOne = (id, result) => {
  var query = conDb.format(
  `SELECT title, date, description, instructions, notes, 
  ingredients, status, tags, cookTime, yield, status, isDeleted FROM recipes WHERE id = ?`, [id]);
  conDb.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      } 
      result(null, res[0]);
  });
};


Recipes.getOneImg = (id, result) => {
    var query = conDb.format(
    `SELECT data, mimeType FROM recipes WHERE id = ? AND isDeleted = false AND status = "public" `, [id]);
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } 
        result(null, res[0]);
    });
};

Recipes.getMyOneImg = (userId, id, result ) => {
  var query = conDb.format(
  `SELECT data, mimeType FROM recipes WHERE id = ? AND isDeleted = false AND userId = ?`, [id, userId]);
  conDb.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      } 
      result(null, res[0]);
  });
};

Recipes.adminGetOneImg = (id, result) => {
  var query = conDb.format(
  `SELECT data, mimeType FROM recipes WHERE id = ? `, [id]);
  conDb.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      } 
      result(null, res[0]);
  });
};


Recipes.newImg = (id, recipe, result) => {
  conDb.query(
      "UPDATE recipes SET data = ?, mimeType = ? WHERE id = ?", 
      [recipe.data, recipe.mimeType, id], (err, res) => {
          if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
            console.log("updated recipes: ", { id: id, ...recipe });
            result(null, { id: id, ...recipe });
      }
  )
}



Recipes.create = (recipe, result) => {
    conDb.query("INSERT INTO recipes SET userId = ?, title = ?, date = ?, description = ?, instructions = ?, notes = ?, ingredients = ?, status = ?, data = ?, mimeType = ?, tags = ?, isDeleted = ?, cookTime = ?, yield = ?", 
    [recipe.userId, recipe.title, recipe.date, recipe.description, recipe.instructions, recipe.notes, recipe.ingredients, recipe.status, recipe.data, recipe.mimeType, recipe.tags, recipe.isDeleted, recipe.cookTime, recipe.yield], 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created recipe: ", { id: res.insertId, ...recipe });
      result(null, { id: res.insertId, ...recipe });
    });
  };

Recipes.updateById = (id, userId, recipe, result) => {
    conDb.query(
        `
        UPDATE recipes SET title = ?, description = ?, instructions = ?, 
        ingredients = ?, tags = ?, cookTime = ?, yield = ? WHERE id = ? AND userId = ?
        `,
      [recipe.title, recipe.description, recipe.instructions, recipe.ingredients, recipe.tags, recipe.cookTime, recipe.yield,  id, userId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("updated recipes: ", { id: id, ...recipe });
        result(null, { id: id, ...recipe });
      }
    );
  };

Recipes.updateNotes = (id, userId, recipe, result) => {
    conDb.query(
        "UPDATE recipes SET notes = ? WHERE id = ? AND userId = ?",
      [recipe.notes, id, userId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("updated recipes: ", { id: id, ...recipe });
        result(null, { id: id, ...recipe });
      }
    );
  };

Recipes.setPrivacy = (id, userId, recipe, result) => {
    conDb.query(
        "UPDATE recipes SET status = ? WHERE id = ? AND userId = ?",
      [recipe.status, id, userId],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("updated recipes: ", { id: id, ...recipe });
        result(null, { id: id, ...recipe });
      }
    );
  };

Recipes.deleteRecipe = (id, userId, recipe, result) => {
    conDb.query(
        " UPDATE recipes SET isDeleted = true WHERE id = ? AND userId = ?", [id, userId], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("updated recipes: ", { id: id, ...recipe });
        result(null, { id: id, ...recipe });
      }
    );
  };

Recipes.changeImg = (id, recipe, result) => {
    sql.query(
        `
        UPDATE recipes SET data = ?, mimeType = ? WHERE id = ? 
        `,
      [recipe.data, recipe.mimeType, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("updated recipes: ", { id: id, ...recipe });
        result(null, { id: id, ...recipe });
      }
    );
  };


  Recipes.undeleteRecipe = (id, recipe, result) => {
    conDb.query(
        " UPDATE recipes SET isDeleted = false WHERE id = ? ", [id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        console.log("updated recipes: ", { id: id, ...recipe });
        result(null, { id: id, ...recipe });
      }
    );
  };




  
module.exports = Recipes;