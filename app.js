//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const authRoute = require("./routes/auth");
const roleRoute = require("./routes/role");
const projectsRoute = require("./routes/projects");
const usersRoute = require("./routes/user");


const app = express();

//MongoDB//
mongoose.connect('mongodb://localhost:27017/usersBTDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


//MiddleWare//
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

//Passport Config
require("./config/passport")(passport)

//routes
app.use(authRoute);
app.use(roleRoute);
app.use(projectsRoute);
app.use(usersRoute);


//LocalHost//
app.listen(3000, function() {
    console.log("Server Started On Port 3000");
});