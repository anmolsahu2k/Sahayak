const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddlewares");

const Request = require("../models/requestSchema");

//----------Send Medical SOS reqeust----------//
router.post("/request/send/medical/:id", middleware.isLoggedIn, function(req,res){
    let newRequest = {
        typeOfRequest: "Medical",
        handler: {
            id: req.params.id,
            username: req.user.username,
        },
        sourceLocation: String,
        message: req.body.message,
    }
    console.log(newRequest);
    res.redirect("/dashboard");
    Request.create(newRequest, function(err, newRequest){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Medical SOS Request Sent!");
            res.redirect("/dashboard");
        }
    });
});

module.exports = router;