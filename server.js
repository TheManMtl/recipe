const express = require('express');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//simple url to test the app
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to recipes application." });
// }); 

require("./app/routes/recipes.route")(app);
require("./app/routes/comments.route")(app);
require("./app/routes/users.route")(app);

// TODO: view 
app.use(express.static('client'));


const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
    console.log(`Server is listning to: ${PORT}.`);
});