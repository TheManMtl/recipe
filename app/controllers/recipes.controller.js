const Recipe = require("../models/recipes.model");
const Auth = require("../utils/auth");
const moment = require("moment");
moment().format();


exports.adminFindAll = (req, res) => {

    const deleted = req.query.deleted;
    //Auth.execIfAuthValid(req, res, ["Admin"], (req, res, user) => {
        Recipe.adminGetAll(deleted, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            else {
                res.status(200).send(data);
            }
        });
   // })
};

exports.findAll = (req, res) => {

    const sort = req.query.sort;
    Recipe.getAll(sort, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving recipes."
            });
        else {
            // change date format
            for (i in data) {
                data[i].date = moment(data[i].date).format('L');
            }
            res.status(200).send(data);
        }
    });
};

exports.getAllByUser = (req, res) => {
    Recipe.getAllByUser(req.query.username, user.role, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving recipes."
            });
        else {
            // change date format
            for (i in data) {
                data[i].date = moment(data[i].date).format('L');
            }
            res.status(200).send(data);
        }
    });
}

exports.adminGetAllByUser = (req, res) => {
    Auth.execIfAuthValid(req, res, ["Admin"], (req, res, user) => {
        Recipe.adminGetAllByUser(req.params.userId, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            else {
                res.status(200).send(data);
            }
        });
    })
}

exports.getAllMine = (req, res) => {
    Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
        Recipe.getAllMy(user.id, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            else {
                // change date format
                for (i in data) {
                    data[i].date = moment(data[i].date).format('L');
                }
                res.status(200).send(data);
            }
        });

    })
}

exports.getOne = (req, res) => {

    Recipe.getOne(req.params.id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving recipes."
            });
        else {
            // change date format
                data.date = moment(data.date).format('L');
            
            res.status(200).send(data);
        }
    });
}

exports.getMyOne = (req, res) => {
    Auth.execIfAuthValid(req, res, ["Admin"], (req, res, user) => {
        Recipe.getMyOne(user.id, req.params.id, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            else {
                // change date format
          
                    data.date = moment(data.date).format('L');
                
                res.status(200).send(data);
            }
        });
    });
}

exports.adminGetOne = (req, res) => {
    Auth.execIfAuthValid(req, res, ["Admin"], (req, res, user) => {
        Recipe.adminGetOne(req.params.id, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            else {
                // change date format
                for (i in data) {
                    data[i].date = moment(data[i].date).format('L');
                }
                res.status(200).send(data);
            }
        });
    });
}

exports.getOneImg = (req, res) => {
    Recipe.getOneImg(req.params.id, (err, item) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving recipes."
            });
        } else {
            res.contentType(item.mimeType).status(200).send(item.data);
        }
    })
}

exports.getMyOneImg = (req, res) => {
    Auth.execIfAuthValid(req, res, ["User", "Admin"], (req, res, user) => {
        Recipe.getMyOneImg(user.id, req.params.id, (err, data) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            } else {
                res.contentType(item.mimeType).status(200).send(item.data);
            }
        })
    })
}

exports.adminGetOneImg = (req, res) => {
    Auth.execIfAuthValid(req, res, ["Admin"], (req, res, user) => {
        Recipe.adminGetOneImg(req.params.id, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving recipes."
                });
            else {
                res.status(200).send(data);
            }
        });
    });
}

exports.createNewRecipe = (req, res) => {
    Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
        const isValid = postPutValid(req, res);
        if (isValid === true) {
   
            console.log(req.body.userId);
            const dFormat = "YYYY-MM-DD";
            let dToday = Date.now();
            const recipe = new Recipe({
                userId: user.id,
                title: req.body.title,
                date: moment(dToday).format(dFormat),
                description: req.body.description,
                instructions: req.body.instructions,
                notes: req.body.notes,
                ingredients: req.body.ingredients,
                status: req.body.status ? req.body.status : "Public",
                data: Buffer.from(req.body.data, "base64"), 
                mimeType: req.body.mimeType, // do not store base 64 encoded content - transport 
                tags: req.body.tags,
                isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
                cookTime: req.body.cookTime ? req.body.cookTime : 0,
                yield: req.body.yield
            });



            // Save Recipe in the database
            Recipe.create(recipe, (err, data) => {


                if (err) {
                    if (err.errno == 1366) {
                        res.status(409).send({ message: "You must provide a user id." });
                    } else if (err.errno == 1292) {
                        res.status(404).send({ message: "The date must be in valid YYYY-MM-DD format" });
                    }
                    else {
                        res.status(500).send({ message: "An error occurred while creating the recipe entry." });
                    }
                } else {
                    res.status(201).send({ data: data, message: "id is " + req.body.id });
                }
            });
        }
    })
};

exports.update = (req, res) => {
    const isValid = postPutValid(req, res)
    // Validate Request
    if (isValid === true) {
         Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {

        const recipe = new Recipe({

            title: req.body.title,
            description: req.body.description,
            instructions: req.body.instructions,
            ingredients: req.body.ingredients,
            tags: req.body.tags,
            cookTime: req.body.cookTime ? req.body.cookTime : 0,
            yield: req.body.yield
        });

            Recipe.updateById(req.params.id,  user.id, recipe, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found recipe with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating recipe with id " + req.params.id
                        });
                    }
                } else res.status(200).send(data);
            }
            );
        })
    };
}

exports.updateNotes = (req, res) => {
    if (req.body.notes.length > 1500 || req.body.notes.length < 5) {
        res.status(400).send({
            message: "Notes must be between 5 and 1500 characters."
        });
    } else {
        Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
            Recipe.updateNotes(req.params.id, user.id, new Recipe(req.body), (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found recipe with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating recipe with id " + req.params.id
                        });
                    }
                } else res.status(200).send(data);
            })
         })
    }
}

exports.updatePrivacy = (req, res) => {

    if (req.body.status != "Public" && req.body.status != "Private") {
        res.status(400).send({
            message: "Recipes can only be set to public or private."
        });
    } else {
        Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
            Recipe.setPrivacy(req.params.id, user.id, new Recipe(req.body), (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found recipe with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating recipe with id " + req.params.id
                        });
                    }
                } else res.status(200).send(data);
            })
        })
    }
}

exports.delete = (req, res) => {
    Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {
        Recipe.deleteRecipe(req.params.id, user.id, new Recipe(req.body), (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found recipe with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating recipe with id " + req.params.id
                    });
                }
            } else res.status(200).send(data);
        })
    })


}

exports.updateImg = (req, res) => {

    req.body.data = Buffer.from(req.body.data, "base64");

    Recipe.newImg(req.params.id, new Recipe(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found recipe with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating recipe with id " + req.params.id
                });
            }
        } else res.status(200).send(data);
    }
    );
}

exports.undelete = (req, res) => {
    Auth.execIfAuthValid(req, res, ["Admin"], (req, res, user) => {
        Recipe.undeleteRecipe(req.params.id, new Recipe(req.body), (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found recipe with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating recipe with id " + req.params.id
                    });
                }
            } else res.status(200).send(data);
        })
    })
}

function postPutValid(req, res) {
    const validStatus = ["Public", "Private"];

    console.log(req.body.title)

    if (req.body.title.length < 1 || req.body.title.length > 100) {
        res.status(400).send({
            message: "Titles must be between 1 and 100 characters."
        });
        return false;
    }

    if (req.body.yield.length < 1 || req.body.yield.length > 50) {
        res.status(400).send({
            message: "Yield must be between 1 and 50 characters."
        });
        return false;
    }

    if (req.body.description.length < 1 || req.body.description.length > 250) {
        res.status(400).send({
            message: "Descriptions must be between 1 and 250 characters."
        });
        return false;
    }

    if (req.body.instructions.length < 1 || req.body.instructions.length > 1500) {
        res.status(400).send({
            message: "Instructions must be between 1 and 1500 characters."
        });
        return false;
    }

    if (req.body.notes) {
        if (req.body.notes.length > 1500) {
            res.status(400).send({
                message: "Notes must be under 1500 characters."
            });
            return false;
        }
    }

    if (req.body.ingredients.length < 1 || req.body.ingredients.length > 250) {
        res.status(400).send({
            message: "Ingredients must be between 1 and 250 characters."
        });
        return false;
    }

    if (req.body.status) {
        if (!validStatus.includes(req.body.status)) {
            res.status(400).send({
                message: "Status can only be set to public or private."
            });
            return false;
        }

    }


    if (req.body.tags) {
        if (req.body.tags.length > 150) {
            res.status(400).send({
                message: "Tags can only be under 150 characters."
            });
            return false;
        }
    }

    if (req.body.cookTime) {
        if (isNaN(req.body.cookTime) || Math.floor(req.body.cookTime) != req.body.cookTime) {
            res.status(400).send({
                message: "Cook time must be a whole number."
            });
            return false;
        }
    }

    return true;

}