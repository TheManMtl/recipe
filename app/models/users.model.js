const db = require("./db.js");

// constructor
const User = function (user) {
  this.id = user.id;
  this.username = user.username;
  this.email = user.email;
  this.fullName = user.fullName;
  this.isDeleted = user.isDeleted;
  this.role = user.role;
  this.password = user.password;
 

  this.profileImg = user.profileImg;
  this.mimeType = user.mimeType;
 
  

};

//create a user
User.create = (user, result) => {
  db.query("INSERT INTO users SET ?", user, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...user });
    result(null, { id: res.insertId, ...user });
  });
};

//return one todo by id
User.findByUsername = (username, result) => {
  // prevent SQL injection
  // FIXME: OMIT BLOB FROM QUERY
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // user not found
    result({ kind: "not_found" }, null);
  });
};

User.findByEmail = (email, result) => {
  // prevent SQL injection
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // user not found
    result({ kind: "not_found" }, null);
  });
};

// retrieve a user by email
User.findByEmailAll = (email, result) => {
  // prevent SQL injection
  db.query('SELECT username, fullname, isDeleted, role FROM users WHERE email = ?', [email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // user not found
    result({ kind: "not_found" }, null);
  });
};

//Get user id from login session
User.GetIdByUsername = (username, result) => {
  // prevent SQL injection
  db.query('SELECT id FROM users WHERE username = ?', [username], (err, res) => {
    
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // id not found
    result({ kind: "not_found" }, null);
  });
};

// TODO: HANDLE NULL
//Get user image
User.getImg = (username, result) => {
  var query = db.format(
  'SELECT mimeType, profileImg FROM users WHERE username = ? AND isDeleted = false', [username]);
  db.query(query, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
      } 
      result(null, res[0]);
  });
};

User.newImg = (username, user, result) => {
  db.query(
      "UPDATE users SET mimeType = ?, profileImg = ? WHERE username = ?", 
      [user.mimeType, user.profileImg, username], (err, res) => {
          if (err) {
              console.log("error: ", err);
              result(null, err);
              return;
            }
            console.log("updated user image");
            result(null, { username: username, ...user });
      }
  )
}


User.getAllusers=(result)=>{

  var query = db.format(
                `SELECT username, email, fullname, isDeleted, role 
                 FROM users
                 `);
    db.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);

    })


}

// //return one user by username NOT USED
// UsersClass.findByUsernameSyncZZZ = (username) => {
//   // FIXME: prevent SQL injection
//   let result = db.query('SELECT * FROM users WHERE username = ?', [username]);
//   console.log(JSON.stringify(result));
//   return result;
// };



// //return one user by id
// User.findById = (id, result) => {
//   db.query("SELECT * FROM users WHERE id = ", [id] (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }

//     if (res.length) {
//       console.log("found users: ", res[0]);
//       result(null, res[0]);
//       return;
//     }

//     // not found user with the id
//     result({ kind: "not_found" }, null);
//   });
// };

module.exports = User;