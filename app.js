let express  = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    path = require("path"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");

// importing enviroment variables
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/smartVac", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));


//Passport Configuration
app.use(
    require("express-session")({
      secret: process.env.PASSPORT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
);

app.listen(3000, function(){
    console.log("Server is connected");
});