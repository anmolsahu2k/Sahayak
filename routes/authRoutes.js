const   express = require("express"),
        router = express.Router(),
        passport = require("passport");

const User = require("../models/userModel");

// -------------Login GET request--------------//
router.get("/userLogin", function (req, res) {
  // console.log(req.flash(error));
  res.render("auth/login");
});


//---------------Login POST request-------------//
router.post(
  "/userLogin",
  passport.authenticate("local", {
    failureRedirect: "/userlogin",
    failureFlash: true,
  }),
  function (req, res) {
    if (req.user.role == "notAdmin") {
      req.flash("success", "Welcome to SOSassist! " + req.user.username);
      res.redirect("/");

    } else if (req.user.role == "admin") {
      req.flash("success", "Welcome to SOSassist! " + req.user.username);
      res.redirect("/");

    } else res.send(404);
  }
);

//-------------Logout-------------//
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged Out Successfully! ");
  res.redirect("/");
});

//------------SignUp GET request--------//
router.get("/register", function (req, res) {
  res.render("auth/signup");
});

//=-------------SignUP POST request---------//
router.post("/register", function (req, res) {
    const newUser = {
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        permanentAddress : {
            street: req.body.street,
            city:  req.body.city,
            state:  req.body.state,
            zip:  req.body.zip
        },
        currentAddress : {
            location: req.body.currentAddress
        },
        username: req.body.username,
        contact : {
            phone: req.body.phone,
            email: req.body.email
        },
        role: req.body.userRole,
    };
    if(req.body.adminCode == process.env.ADMIN_SECRET_CODE){
        newUser.isAdmin = true;
    };
    User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          req.flash("success", "Welcome to SOSassist " + user.username);
          if (req.user.role == "notAdmin")
            res.redirect("/");
          else if (req.user.role == "admin")
            res.redirect("/");
          else res.send(404);
        });
      }
    });
});
module.exports = router;


