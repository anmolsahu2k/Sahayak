var middlewareObj = {};

//------------Checking whether user is sign in or not-----------//
middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

//----------Checking Owner Middleware---------//
middlewareObj.isOwner = function(req, res, next){
    if(req.params.id == req.user._id){
        return next();
    }
    req.flash("error", "Access Denied! Form not submitted.");
    res.redirect("back")
}

module.exports = middlewareObj;