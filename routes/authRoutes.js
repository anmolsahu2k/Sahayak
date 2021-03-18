const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    fs = require('fs'),
    // bcrypt = require('bcrypt-nodejs'),
    // async = require('async'),
    // crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    middleware = require("../middlewares/authMiddlewares"),
    request = require('request'); //to make http calls for API  


// randomToken = require('random-token');


// let multer = require('multer');

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
    let latitude, longitude;

    request('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.body.street + ' ' + req.body.city + '&key=' + process.env.GOOGLE_MAPS_API_KEY, (error, response, body) => { //function(error, response, body)
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body); //to convert data from string to javascript object
            // console.log(parsedData.results[0].geometry.location.lat);
            latitude = parsedData.results[0].geometry.location.lat;
            longitude = parsedData.results[0].geometry.location.lng;
            // console.log(req.body.street + ' ' + req.body.city);
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
                username: req.body.username,
                contact: {
                    phone: req.body.phone,
                    email: req.body.email
                },
                geoCoded: {
                    lat: latitude,
                    long: longitude
                }
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

router.post("/forgot", function(req, res) {
    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 3600000;

    // const resetEmail = {
    //     to: user.email,
    //     from: 'passwordreset@example.com',
    //     subject: 'Node.js Password Reset',
    //     text: `
    //   You are receiving this because you (or someone else) have requested the reset of the password for your account.
    //   Please click on the following link, or paste this into your browser to complete the process:
    //   http://${req.headers.host}/reset/${token}
    //   If you did not request this, please ignore this email and your password will remain unchanged.
    // `,
    // };
    //------------------------------------------


})

// Reset password
router.get("/reset", middleware.isLoggedIn, function(req, res) {

    res.render("auth/reset");
});

router.post("/reset", function(req, res) {
    console.log(req.body);
    const emailServerDetails = {
        emailId: process.env.SERVER_EMAIL,
        pass: process.env.SERVER_PASSWORD,
        proxy: ''
    }
    var mailid1 = emailServerDetails.emailId;
    var password = emailServerDetails.pass;
    var mailid = '"Admin" <' + mailid1 + '>';
    var proxy = emailServerDetails.proxy;
    var serverproxy = "https://" + proxy;


    User.findOne({ username: req.body.userId }, function(err, result2) {
        var TO = result2.contact.email;
        if (err) throw err;
        if (result2.length != 0) {
            var pass = "thisispassword";
            var output = `
                            <p>Dear User, </p>
                            <p>Your are receiving this email because you had requested to reset your password.</p>
                            <p>Your new password has been generated. Please login using the given new password.</p>
                           You are receiving this because you (or someone else) have requested the reset of the password for your account.
                              Please click on the following link, or paste this into your browser to complete the process:
                              http://${req.headers.host}/reset/${token}
                              If you did not request this, please ignore this email and your password will remain unchanged.
                            <p>Login Link: <a href="http://localhost:3000/login">LOGIN</a></p>
                            <p>You may change your password after you login under the section - ACCOUNT SETTINGS</p>
                            <p><strong>This is an automatically generated mail. Please do not reply back.</strong></p>

                            <p>Regards,</p>
                            <p>H Manager</p>
                        `;
            var transporter = nodemailer.createTransport({
                service: 'gmail.com',
                port: 567,
                secure: false, // true for 465, false for other ports
                // proxy: serverproxy,
                auth: {
                    user: mailid1, // generated ethereal user
                    pass: password // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            var mailOptions = {
                from: mailid, // sender address
                to: TO, // list of receivers
                subject: 'Password Reset', // Subject line
                text: 'Password has been reset', // plain text body
                html: output // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // bcrypt.hash(pass, saltRounds, function (err, hash) {
                //     User.changePassword(userid, hash);
                // });

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Server is ready to take our messages");
                }
            });
        }

    });
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

module.exports = router;