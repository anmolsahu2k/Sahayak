const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddlewares");

const Request = require("../models/requestSchema");
const User = require("../models/userModel");
const UserActivity = require("../models/userActivityLogSchema");


router.get("/dashboard/accept/confirm/:id", middleware.isLoggedIn, function(req, res){
    let userId = req.user._id;
    let requestId = req.params.id;
    Request.findByIdAndUpdate(req.params.id, {"$push": {acceptedUsers: userId}}, function(err, updatedRequest){
        if(err){
            console.log(err);
        } else{
            User.findByIdAndUpdate(req.user._id, {"$push": {acceptedRequests: requestId}}, function(error, updatedRequest){
                if(error){
                    console.log(error);
                }else{
                    console.log(updatedRequest);
                    req.flash("success", "Request Accepted! Please help the requester.");
                    res.redirect("/dashboard/acceptSOS");
                }
            });
        }
    });
});

router.post("/dashboard/accept/close/:id", middleware.isLoggedIn, function(req, res){
    let requestId = req.params.id;
    let trustScoreChange = 0;
    if(req.body.authenticity == "Yes" && req.body.similarity == "Yes")
    {
        trustScoreChange = 10;
    } else if(req.body.authenticity == "Yes" && req.body.similarity == "No"){
        trustScoreChange = 5;
    } else if(req.body.authenticity == "No" && req.body.similarity == "NO"){
        trustScoreChange = -10;
    }
    User.findByIdAndUpdate(req.user._id, {$pull: {acceptedRequests: requestId}, $push: {closedRequests: requestId}, $inc: {trustScore: trustScoreChange}}, { safe: true, upsert: true }, 
        function(err, updatedUser){
            if(err){
                console.log(err);
            } else{
                res.redirect("/dashboard/acceptSOS");
            }
    });
});


module.exports = router;