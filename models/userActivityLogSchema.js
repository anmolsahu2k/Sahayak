const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    title: String,
    time: {type: Date, default: null},
    description: String

});

module.exports = mongoose.model("userActivity", userActivitySchema)