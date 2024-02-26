
const Comment = require("../models/comments.model");
var Filter = require('bad-words');
const Auth = require("../util/auth");
const moment = require("moment");

const UserHelpful = require('../models/userHelpful.model')


//Create and Save a new Comment
exports.create = (req, res) => {
    console.log(req.body);
    Auth.execIfAuthValid(req, res, ["User"], (req, res, user) => {

    //if all validation passes -> true otherwise false
    if (isValid(req, res)) {


        // Create a Comment  obj
        const comment = new Comment({
            //id: req.body.id,
            recipeId: req.body.recipeId,
            userId: user.id,
            date: moment(Date.now()).format("YYYY-MM-DD"),
            //date: formatDate(new Date(req.body.date), 'yyyy-mm-dd'),
            text: filterProfaneComments(req.body.text),
            helpful: 0,
            isDeleted: req.body.isDeleted || false
        });

        //sample data to insert
        /*  
             {
            "recipeId" : 1,
            "userId" : 1,
            "date" : "2023-06-07",
            "text" : "I really liked this and tried it.",
            "helpful" : 0,
            "isDelete" : false
             }
        */

        // Save Comment in the database
        Comment.create(comment, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Comment."
                });
            else res.status(201).send(data);
        });
    }
     });
};

// Retrieve all Comments attacted to the recipe sorted by date
exports.findAll = (req, res) => {

    Comment.getAllComments(

        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `recipe not found with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving comments with id " + req.params.id
                    });
                }
            } else {

                console.log('findAll: data.length=>', data.length)
                if (validationGet(res, data)) {// if not empty 

                    for (const key in data) {

                        data[key]['cleanDate'] = formatDate(new Date(data[key]['date']), 'yyyy-mm-dd')
                    }

                    res.status(200).send(data);

                }
            }
        });

};

// FOR UNAUTH CLIENT RECIPE VIEW: Retrieve all Comments attacted to the recipe sorted by date
exports.getPublicByRecipe = (req, res) => {

    Comment.getPublicByRecipe(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `recipe not found with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving comments with id " + req.params.id
                    });
                }
            } else {
                if (validationGet(res, data)) {// if not empty 

                    // change date format
                    for (i in data) {
                        data[i].date = moment(data[i].date).format('L');
                    }
                    res.status(200).send(data);

                }
            }
        });

};


// Retrieve all Comments attacted to the recipe sorted by date
exports.findNotDeletedByrecipe = (req, res) => {

    Comment.getAllNotDeletedByRecipe(
        req.params.id,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `recipe not found with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving comments with id " + req.params.id
                    });
                }
            } else {

                if (validationGet(res, data)) {// if not empty 

                    for (const key in data) {

                        data[key]['cleanDate'] = formatDate(new Date(data[key]['date']), 'yyyy-mm-dd')
                    }

                    res.status(200).send(data);

                }
            }
        });

};

//Update a comment by id and return true if updated
exports.updateText = (req, res) => {


    if (isValid(req, res)) {
        Comment.updateTextById(
            req.params.id,
            req.body.text,
            (err) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found ToDo with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating ToDo with id " + req.params.id
                        });
                    }
                } else res.status(200).send(true);
            }
        );
    }

};



exports.helpfulHandler = (req, res) => {

    UserHelpful.getHelpfulByUserAndComment(
        req.params.cId,
        req.params.uId,
        (err, data) => {
            if (err) {
                if (err.kind === 'not_found') {
                    res.status(404).send({
                        message: `helpful_user_comment not found`
                    });
                } else {
                    res.status(500).send(
                        {
                            message: 'Error Retrieving helpful'
                        });
                }
            } else {
                console.log('count:', data[0]['rowCount'])

                // if there is a relation update otherwise create
                if (data[0]['rowCount'] > 0) {
                    console.log("data: before add: ", data[0]['rowCount']);
                    updateHelpfulUserComment(data, req, res);
                } else {
                    console.log("data: before add: ", data[0]['rowCount']);
                    addHelpfulUserComment(data, req, res);
                }
            }
        })
};

function addHelpfulUserComment(data, req, res) {

    console.log("data: add: ", data[0]['rowCount']);

    const helpfulUserComment = new UserHelpful({
        userId: req.params.uId,
        commentId: req.params.cId,
        helpful: 0
    });

    // create relation
    UserHelpful.create(helpfulUserComment, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Internal error"
            });
        }
        else {

            console.log('create relation');
            helpfulCounterUpdate
                (req.params.cId, req.params.uId, helpfulUserComment.helpful, res);// update counter helpful in comments
        }

    });
}


// update counter helpful in comments
function helpfulCounterUpdate(id, userId, status, res) {
    console.log('helpfulCounterUpdate');
    Comment.updateHelpfulNumber(id, userId, status, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Internal error"
            });
        } else {
            res.status(200).send(data);
        }
    })
}



function updateHelpfulUserComment(data, req, res) {

    console.log("data: update: ", data[0]['rowCount']);

    UserHelpful.isUserClickedHelpful
        (req.params.cId, req.params.uId,
            (err, data) => {
                console.log('UserHelpful.isUserClickedHelpful', data[0]['helpful']);
                helpfulCounterUpdate(
                    req.params.cId,
                    req.params.uId,
                    data[0]['helpful'], res)
            });
}


function validationGet(res, data) {

    if (data.length < 1) {// if no comments data is empty []

        res.status(200).send("message: no comments yet! be the first one");
        return false;
    }

    return true;
}


function filterProfaneComments(orgText) {

    filter = new Filter();
    return filter.clean(orgText);

}


function isValid(req, res) {


    textBody = req.body.text;

    if (textBody.length < 5 || textBody.length > 250) {
        res.status(400).send(
            { message: "comments cannot be over 250 or less that 5 charachters!" }
        );
        return false;
    }






    return true;
}

//date to yyyy-mm-dd
function formatDate(date, format) {

    const map = {
        mm: (date.getMonth() + 1).toString().padStart(2, '0'),
        dd: date.getDate().toString().padStart(2, '0'),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy|yyy/gi, matched => map[matched])
}