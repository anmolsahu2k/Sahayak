const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddlewares");

const Request = require("../models/requestSchema");
const User = require("../models/userModel")

//----------Send Medical SOS reqeust----------//
router.post("/request/send/medical/:id", middleware.isLoggedIn, function(req, res) {
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let newRequest = {
        typeOfRequest: "Medical",
        handler: {
            id: req.params.id,
            username: req.user.username,
        },
        sourceLocation: {
            lat: latitude,
            long: longitude
        },
        message: req.body.message,
        requestedUsers: [],
    }
    if (req.user.medicalRequestCount < 3) {


        var requestedUsers = [];
        User.find(function(err, users) {
            if (err)
                console.log(err)
            else {
                for (var j = 0; j < users.length; j++) {
                    (function(location) {
                        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                            var R = 6371; // Radius of the earth in km
                            var dLat = deg2rad(lat2 - lat1); // deg2rad below
                            var dLon = deg2rad(lon2 - lon1);
                            var a =
                                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            var d = R * c; // Distance in km
                            return d;
                        }

                        function deg2rad(deg) {
                            return deg * (Math.PI / 180)
                        }
                        var distance_from_location = getDistanceFromLatLonInKm(latitude, longitude, location.geoCoded.lat, location.geoCoded.long) //distance in meters between your location and the marker
                        if (distance_from_location <= 1) {
                            requestedUsers.push(location._id);
                        }
                    })(users[j]);
                }
                newRequest.requestedUsers = requestedUsers;
                Request.create(newRequest, function(err, newRequest) {
                    if (err) {
                        console.log(err);
                    } else {
                        User.findByIdAndUpdate({ _id: req.params.id }, { $inc: { medicalRequestCount: 1 } }, function(error, updatedUser) {
                            if (error) {
                                console.log(error);
                            } else {
                                req.flash("success", "Medical SOS Request Sent!");
                                res.redirect("/dashboard");
                            }
                        });
                    }
                });
            }
            // console.log(users);
            // var distance=computeDistanceBetween({latitude,longitude})
            // var books = user.map((item) => {return item.title;});
        });

    } else {
        req.flash("error", "Maximum limit of sending Medical SOS is reached !");
        res.redirect("/dashboard");
    }
    // console.log(req.body);
});
//----------Send Crime SOS reqeust----------//
router.post("/request/send/crime/:id", middleware.isLoggedIn, function(req, res) {
    let newRequest = {
        typeOfRequest: "Crime",
        handler: {
            id: req.params.id,
            username: req.user.username,
        },
        sourceLocation: {
            lat: req.body.latitude,
            long: req.body.longitude
        },
        message: req.body.message,
    }
    if (req.user.crimeRequestCount < 3) {
        Request.create(newRequest, function(err, newRequest) {
            if (err) {
                console.log(err);
            } else {
                User.findByIdAndUpdate({ _id: req.params.id }, { $inc: { crimeRequestCount: 1 } }, function(error, updatedUser) {
                    if (error) {
                        console.log(error);
                    } else {
                        req.flash("success", "Crime SOS Request Sent!");
                        res.redirect("/dashboard");
                    }
                });
            }
        });
    } else {
        req.flash("error", "Maximum limit of sending Crime SOS is reached !");
        res.redirect("/dashboard");
    }
    // console.log(req.body);
});

//-----------Close Medical request routes------------------//
router.get("/dashboard/activity/medicalClose/:id", function(req, res) {
    var datetime = new Date();
    Request.findByIdAndUpdate(req.params.id, { $set: { 'currentStatus': 'Inactive' } }, function(err, updatedRequest) {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            closeTime = (datetime - updatedRequest.generatedAt) / (1000 * 60);
            let trustScoreChange;
            if (closeTime < 10) {
                trustScoreChange = -10;
            } else if (closeTime < 60 && closeTime > 10) {
                trustScoreChange = -5;
            } else if (closeTime < 90 && closeTime > 60) {
                trustScoreChange = -2;
            } else {
                trustScoreChange = 0;
            }
            User.findByIdAndUpdate({ _id: req.user._id }, { $inc: { medicalRequestCount: -1, trustScore: trustScoreChange } }, function(error, updatedUser) {
                if (error) {
                    console.log(error);
                } else {
                    req.flash("success", "SOS Medical Request Closed Successfully!")
                    res.redirect("/dashboard/activityLog");
                }
            });
        }
    });
});
//-----------Close Medical request routes------------------//
router.get("/dashboard/activity/crimeClose/:id", function(req, res) {
    var datetime = new Date();
    Request.findByIdAndUpdate(req.params.id, { $set: { 'currentStatus': 'Inactive' } }, function(err, updatedRequest) {
        if (err) {
            req.flash("error", "Something went wrong!");
            console.log(err);
        } else {
            closeTime = (datetime - updatedRequest.generatedAt) / (1000 * 60);
            let trustScoreChange;
            if (closeTime < 10) {
                trustScoreChange = -10;
            } else if (closeTime < 60 && closeTime > 10) {
                trustScoreChange = -5;
            } else if (closeTime < 90 && closeTime > 60) {
                trustScoreChange = -2;
            } else {
                trustScoreChange = 0;
            }
            User.findByIdAndUpdate({ _id: req.user._id }, { $inc: { crimeRequestCount: -1, trustScore: trustScoreChange } }, function(error, updatedUser) {
                if (error) {
                    console.log(error);
                } else {
                    req.flash("success", "SOS Crime Request Closed Successfully!")
                    res.redirect("/dashboard/activityLog");
                }
            });
        }
    });
});

module.exports = router;