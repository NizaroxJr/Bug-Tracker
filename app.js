//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

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
// MONGODB ////////

mongoose.connect('mongodb://localhost:27017/usersBTDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/dashbord",
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id }, function(err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/dashbord"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function(err, user) {
            return cb(err, user);
        });
    }
));

// Routes ////////


app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

//////*Google Authentication*////

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', "email"] }));

app.get('/auth/google/dashbord',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashbord');
    });

//////*Facebook Authentication*////

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/dashbord',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashbord');
    });
app.get("/dashbord", function(req, res) {
    if (req.isAuthenticated())
        res.render("dashbord");
    else
        res.redirect("/login");
});



app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

app.post("/register", function(req, res) {
    User.register({
        username: req.body.username
    }, req.body.password, function(err, user) {
        if (err) {
            console.log(err)
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/dashbord");
            });
        }

    });
});

app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if (err)
            console.log("go Fuck Yourself");
        else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/dashbord");
                console.log("im working");
            });
        }
    });
});

app.listen(3000, function() {
    console.log("Server Started On Port 3000");
});