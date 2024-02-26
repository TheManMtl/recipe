
//main DB azure
const conDb = require("./db.js");

//test db
const { stringify } = require("querystring");
// const conDb = require("./dbTest.js");
//test local db
//const conDb = require("./dbTest.js");

//user temp to test
const user = require("./userTestHelpful.js");
const { count } = require("console");


// constructor comment
const Comment = function (comment) {

    this.id = comment.id
    this.recipeId = comment.recipeId
    this.userId = comment.userId
    this.username = comment.username
    this.date = comment.date
    this.text = comment.text
    this.isDeleted = comment.isDeleted

};

/* sample entry

     
    "recipeId": 1,
    "userId": 20,
    "date": "2023-06-11",
    "text": "yummy",
    "isDeleted": 0

*/



Comment.getAllComments = (result) => {
   
    var query = conDb.format(`SELECT u.username, u.profileImg, c.text,c.date, r.title
                 FROM recipecomments AS c
                 INNER JOIN users AS u ON c.userId = u.id
                 INNER JOIN recipes AS r ON c.recipeId = r.id
                 ORDER BY c.date`);
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);

    })

}


// return all comments by recipe with sort order date
Comment.getAllNotDeletedByRecipe = (recipeId, result) => {

    var query = conDb.format(`SELECT * FROM recipecomments WHERE recipeId = ? AND isDeleted = 0 ORDER BY date`, [recipeId]);

    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);

    });
};

// return all comments by recipe with sort order date
Comment.getPublicByRecipe = (id, result) => {
    var query = conDb.format(
    `SELECT u.id, u.username, c.text, c.helpful FROM recipecomments c INNER JOIN users u ON c.userId = u.id WHERE c.recipeId = ?`, [id]);
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
          }
          result(null, res);
    });
};



//  AND c.isDeleted = 0 ORDER BY date


//create a comment
Comment.create = (com, result) => {

    conDb.query("INSERT INTO recipecomments SET recipeId = ?, userId = ?, date = ?, text = ?", [com.recipeId, com.userId, com.date, com.text], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...com });
    });
};


//update a comment ONLY text by id 
Comment.updateTextById = (id, commentText, result) => {
    console.log('id: ', id);
    console.log('comment: ', commentText);
    conDb.query(
        "UPDATE recipecomments SET text = ? WHERE id = ?",
        [commentText, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            //problem affectedRows
            if (res.affectedRows == 0) {
                // not found comment with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated comment: ", { id: id });
            result(null, { id: id });
        }
    );
};


//update a helpful comment  
Comment.updateHelpfulNumber = (id, userId, helpfulStatus, result) => {

    // get total helpful of comment then update it
    //returns total 
    getCountHelpfull(id).then(total => {

        newCount = helpfulStatus === 0 ? ++total : --total;
        console.log("count: new count:  ", total, newCount);
        console.log("status help  ", helpfulStatus);
        conDb.query(
            "UPDATE recipecomments SET helpful = ? WHERE id = ?",
            [newCount, id],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                }
                //problem affectedRows
                if (res.affectedRows == 0) {
                    // not found comment with the id
                    result({ kind: "not_found" }, null);
                    return;
                }

                console.log("updated comment: ", { id: id });


                updateHelpfulUserCommment(id, helpfulStatus, userId, result);

            }
        )

    });



};


function updateHelpfulUserCommment(id, helpfulStatus, userId, result) {

    console.log('STATUS: Helpful: ', helpfulStatus);


    newStatus = helpfulStatus === 0 ? 1 : 0;
    console.log('STATUS: newStatus: ', newStatus);
    conDb.query(
        "UPDATE userhelpful SET helpful = ? WHERE userId = ? AND commentId = ?",
        [newStatus, userId, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
            //problem affectedRows
            if (res.affectedRows == 0) {
                // not found comment with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated userhelpful: ", { id: id });
            result(null, { id: id });
        }
    )



}

function getCountHelpfull(id) {
    return new Promise((resolve, reject) => {
        let sql = conDb.format(
            "SELECT helpful FROM recipecomments WHERE id = ?", parseInt(id));
        conDb.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result[0]['helpful']);
        });
    });
}


module.exports = Comment;
