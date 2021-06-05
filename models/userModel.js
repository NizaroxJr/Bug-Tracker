const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');


const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    role: String,
    password: String,
    googleId: String,
    facebookId: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const userModel = new mongoose.model("User", userSchema);


module.exports = {
    userModel,
    userSchema
};