const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    typeOfRequest: String,
    handler: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
    sourceLocation: {
        lat: String,
        long: String
    },
    message: String,
    generatedAt: { type: Date, default: Date.now },
    currentStatus: { type: String, default: "Active" },
    requestedUsers: [String],
    acceptedUsers: [String]

})

module.exports = mongoose.model("Requests", requestSchema)