const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

let multer = require('multer');
const middleware = require("../middlewares/authMiddlewares");

const User = require("../models/userModel");
const Request = require("../models/requestSchema");
const UserActivity = require("../models/userActivityLogSchema");

router.get("/about", function(req, res) {
    res.render("about");
});

router.post("/contact", function(req, res) {
    req.flash("success", "Thanks for contacting us!");
    res.redirect("/contact");
});

router.get("/contact", function(req, res) {
    res.render("contact");
});

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/dashboard", middleware.isLoggedIn, function(req, res) {
    res.render("users/dashboard");
});

router.get("/dashboard/settings", middleware.isLoggedIn, function(req, res) {
    res.render("users/settings");
});

router.get("/dashboard/activityLog", middleware.isLoggedIn, function(req, res) {
    Request.find().where('handler.id').equals(req.user._id).exec(function(err, foundRequests) {
        if (err) {
            req.flash("error", "Something Bad Happened!")
            console.log(err);
        } else {
            UserActivity.find().where('handler.id').equals(req.user._id).exec(function(error, activityLog) {
                if (error) {
                    console.log(error);
                } else {
                    res.render("users/activityLog", { foundRequests: foundRequests, activityLog: activityLog });
                }
            });
        }
    });
});

// -----------------Accept SOS request route-------------//
router.get("/dashboard/acceptSOS", middleware.isLoggedIn, function(req, res) {
    let foundAcceptRequests = [];
    Request.find({}).exec(function(error, allRequests) {
        if (error) {
            console.log(error);
        } else {
            allRequests.forEach(function(request, i) {
                if (request.requestedUsers.includes(req.user._id)) {
                    foundAcceptRequests.push(request);
                }
            });
            res.render("users/acceptSOS", { foundAcceptRequests: foundAcceptRequests });
        }
    });
});

const upload = multer({ dest: __dirname + '/uploads/images' });

// ------------User Profile Update Post route--------------//
router.put("/dashboard/settings/:id", upload.single('photo'), middleware.isLoggedIn, middleware.isOwner, function(req, res) {
    updateUser = req.body.user;
    console.log(updateUser);
    updateUser.profileImage.data = fs.readFileSync(req.file.userPhoto.path)
    updateUser.profileImage.contentType = 'image/png';

    User.findByIdAndUpdate(req.params.id, updateUser, function(err, updatedProfile) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Bad Occured! Profile Not Updated")
        } else {
            req.flash("success", "Profile successfully updated!");
            res.redirect("/dashboard/settings");
        }
    });
});


//-----------404 Page -------------------------

router.get("/404", function(req, res) {
    res.render("404");
});


module.exports = router;