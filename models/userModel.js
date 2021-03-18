const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        firstName: String,
        lastName: String
    },
    permanentAddress: {
        street: String,
        city: String,
        state: String,
        zip: Number
    },
    username: String,
    password: String,
    contact: {
        phone: Number,
        email: String
    },
    geoCoded: {
        lat: String,
        long: String
    },
    gender: String,
    age: Number,
    role: { type: String, default: "notAdmin" },
    isAdmin: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    profileImage: {
        data: { type: Buffer, default: null },
        contentType: { type: String, default: null }
    },
    medicalRequestCount: { type: Number, default: 0 },
    crimeRequestCount: { type: Number, default: 0 },
    trustScore: { type: Number, default: 50 }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);