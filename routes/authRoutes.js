const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    bcrypt = require('bcrypt-nodejs'),
    async = require('async'),
    crypto = require('crypto');


let multer = require('multer');

const User = require("../models/userModel");

// -------------Login GET request--------------//
router.get("/login", function(req, res) {
    // console.log(req.flash(error));
    res.render("auth/login");
});


//---------------Login POST request-------------//
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    function(req, res) {
        if (req.user.role == "notAdmin") {
            req.flash("success", "Welcome to SOSassist! " + req.user.username);
            res.redirect("/dashboard");

        } else if (req.user.role == "admin") {
            req.flash("success", "Welcome to SOSassist! " + req.user.username);
            res.redirect("/");

        } else res.send(404);
    }
);

//-------------Logout-------------//
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged Out Successfully! ");
    res.redirect("/");
});

//------------SignUp GET request--------//
router.get("/signup", function(req, res) {
    res.render("auth/signup");
});

//=-------------SignUP POST request---------//
router.post("/signup", function(req, res) {
    const newUser = {
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        permanentAddress: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip
        },
        currentAddress: {
            location: req.body.currentAddress
        },
        username: req.body.username,
        contact: {
            phone: req.body.phone,
            email: req.body.email
        },
        // geoCoded: {
        //     lat: 
        //     long: 
        // }
    };
    if (req.body.adminPassword == process.env.ADMIN_SECRET_CODE) {
        newUser.isAdmin = true;
        newUser.role = "admin";
    };
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/signup");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to SOSassist " + user.username);
                if (req.user.role == "notAdmin")
                    res.redirect("/dashboard");
                else if (req.user.role == "admin")
                    res.redirect("/");
                else res.send(404);
            });
        }
    });
});


// Forgot password
router.get("/forgot", function(req, res) {
    res.render("auth/forgot");
});

// Reset password
router.get("/reset", function(req, res) {
    res.render("auth/reset");
});

module.exports = router;