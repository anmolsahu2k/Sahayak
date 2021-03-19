let express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    path = require("path"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    multer = require('multer'),
    nodemailer = require('nodemailer'),
    bcrypt = require('bcrypt-nodejs'),
    async = require('async'),
        crypto = require('crypto');

// importing enviroment variables
require("dotenv").config();

// ------------Import User Model-----------//
const User = require('./models/userModel');

// ------------Import Routes--------------//
let authRoutes = require('./routes/authRoutes'),
    indexRoutes = require('./routes/indexRoutes'),
    requestRoutes = require('./routes/requestsRoutes');
// google_maps = require('./public/assets/js/google_maps');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// ---------Use external Routes-------------// 
app.use(indexRoutes);
app.use(authRoutes);
app.use(requestRoutes);
// app.use(google_maps);

app.listen(process.env.APP_LISTEN_PORT, function() {
    console.log("Server is connected");
});