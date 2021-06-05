const mongoose = require("mongoose");
const userSchema = require("./userModel").userSchema;
const ticketSchema = require("./ticketModel").ticketSchema;

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    users: [userSchema],
    tickets: [ticketSchema]
});

const projectModel = new mongoose.model("Project", projectSchema);

module.exports = {
    projectSchema,
    projectModel
}