const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddlewares");

const Request = require("../models/requestSchema");
const User = require("../models/userModel");
const UserActivity = require("../models/userActivityLogSchema");


router.get("/dashboard/accept/confirm/:id", middleware.isLoggedIn, function(req, res){
    let userId = req.user._id;
    let requestId = req.params.id;
    console.log(requestId, userId);
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


module.exports = router;