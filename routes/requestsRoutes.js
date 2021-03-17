const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddlewares");

const Request = require("../models/requestSchema");
const User = require("../models/userModel")

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
    if(req.user.medicalRequestCount < 3)
    {
        Request.create(newRequest, function(err, newRequest){
            if(err){
                console.log(err);
            }else{
                User.findByIdAndUpdate({_id: req.params.id}, {$inc: { medicalRequestCount:1 } },  function(error, updatedUser){
                    if(error){
                        console.log(error);
                    }else{
                        req.flash("success", "Medical SOS Request Sent!");
                        res.redirect("/dashboard");
                    }
                });
            }
        });
    } else{
        req.flash("error", "Maximum limit of sending Medical SOS is reached !");
        res.redirect("/dashboard");
    }
});

//-----------Close request routes------------------//
router.get("/dashboard/activity/close/:id", function(req, res){
   Request.findByIdAndUpdate(req.params.id, {$set: {'currentStatus': 'Inactive'}}, function(err, updatedRequest){
        if(err){
            req.flash("error", "Something went wrong!");
            console.log(err);
        }else{
            User.findByIdAndUpdate({_id: req.user._id}, {$inc: { medicalRequestCount:-1 } },  function(error, updatedUser){
                if(error){
                    console.log(error);
                }else{
                    req.flash("success", "SOS Request Closed Successfully!")
                    res.redirect("/dashboard/activityLog");
                }
            });
        }
   });
});

module.exports = router;