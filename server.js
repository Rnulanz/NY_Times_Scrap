// Our Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");



// Initialize Express
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// allow the handlesbars engine to be in our toolset
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// Now set handlebars engine
app.set('view engine', 'handlebars');

// Make public a static dir to serve our static files
app.use(express.static("public"));

// Mongoose (orm) connects to our mongo db and allows us to have access to the MongoDB commands for easy CRUD 
// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



// Require the routes in our controllers js file
require("./controllers/controller.js")(app);

//Listen on PORT 8000 & notify us.
app.listen(PORT, function () {
    console.log("App running on port 8080");
});