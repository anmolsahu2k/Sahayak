const   mongoose = require("mongoose"),
        passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        firstName: String,
        lastName: String
    },
    permanentAddress : {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    currentAddress : {
        location: String
    },
    username: String,
    password: String,
    contact : {
        phone: Number,
        email: String
    },
    isAdmin : {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);