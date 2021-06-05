const mongoose = require("mongoose");
const userSchema = require("./userModel").userSchema;
const projectSchema = require("./projectModel").projectSchema;


const ticketSchema = new mongoose.Schema({
    Title: String,
    description: String,
    developer: userSchema,
    submitter: userSchema,
    project: String,
    Priority: String,
    Status: String,
    Type: String,
    Created: Date,
    comments: [{
        commenter: String,
        Message: String,
        Created: Date
    }],
    history: [{
        property: String,
        Old: String,
        new: String,
        change: Date
    }],
});

const ticketModel = new mongoose.model("ticket", ticketSchema);

module.exports = { ticketModel, ticketSchema };