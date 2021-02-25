const express = require("express");
const router = express.Router();


router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/dashboard", function(req, res) {
    res.render("dashboard");
});

router.get("/settings", function(req, res) {
    res.render("settings");
});

module.exports = router;