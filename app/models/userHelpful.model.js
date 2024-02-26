const conDb = require("./dbTest.js");

const UserHelpful = function (userHelpful) {

    this.userId = userHelpful.userId,
    this.commentId = userHelpful.commentId,
    this.helpful = userHelpful.helpful
};


//create a comment
UserHelpful.create = (newUserHelpful, result) => {

    console.log('newUserHelpful:Model:  ', newUserHelpful);

    conDb.query("INSERT INTO userhelpful SET ?", newUserHelpful, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newUserHelpful });
    });
};


UserHelpful.getHelpfulByUserAndComment = (commentId, userId, result) => {


    var query =
        conDb.format
            (`SELECT COUNT(*) AS rowCount FROM userhelpful WHERE commentId = ? AND UserId = ? `, [parseInt(commentId), parseInt(userId)]);
    console.log('query: ', query);
    conDb.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);

    });

}

// if the result is 1 user already clicked the helpful
UserHelpful.isUserClickedHelpful = (commentId, userId, result) => {

    cId = parseInt(commentId);
    uId = parseInt(userId);
    let sql = conDb.format(
        "SELECT helpful FROM userhelpful WHERE commentId = ? AND userId = ?", [cId, uId]);
    conDb.query(sql, (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log('isUserClickedHelpful: ',res[0]);
        result(null, res);
    });
}

module.exports = UserHelpful;