const express = require("express");
const router = express.Router();

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

// ------------User Profile Update Post route--------------//
router.put("/dashboard/settings/:id", middleware.isLoggedIn, middleware.isOwner, function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedProfile){
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