const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
    requestType: {type: String, required: true},  //Request Types => MedicalHelp, CrimeHelp, MedicalAccept, CrimeAccept
    title: String,
    generatedAt: {type: Date, default: null},
    closedAt: {type: Date, default: null},
    description: String,
    handler:{
        id:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
        },
        username:String
    },
    relatedRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request"
    }

});

module.exports = mongoose.model("userActivity", userActivitySchema)