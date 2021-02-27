const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

let multer = require('multer');
const middleware = require("../middlewares/authMiddlewares");
const User = require("../models/userModel");


router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/dashboard", middleware.isLoggedIn, function(req, res) {
    res.render("users/dashboard");
});

router.get("/dashboard/settings", middleware.isLoggedIn, function(req, res) {
    res.render("users/settings");
});

const upload = multer({dest: __dirname + '/uploads/images'});

// ------------User Profile Update Post route--------------//
router.put("/dashboard/settings/:id",upload.single('photo'), middleware.isLoggedIn, middleware.isOwner, function(req, res){
    updateUser = req.body.user;
    console.log(updateUser);
    updateUser.profileImage.data =fs.readFileSync(req.file.userPhoto.path)
    updateUser.profileImage.contentType = 'image/png';
    
    User.findByIdAndUpdate(req.params.id, updateUser, function(err, updatedProfile){
        if(err){
            console.log(err);
            req.flash("error", "Something Bad Occured! Profile Not Updated")
        } else{
            req.flash("success", "Profile successfully updated!");
            res.redirect("/dashboard/settings");
        }
    });
});

module.exports = router;