//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require("bcrypt");


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
    username: String,
    name: String,
    password: String,
    googleId: String,
    facebookId: String
});

const userRoleSchema = new mongoose.Schema({
    name: String,
    role: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const userRole = new mongoose.model("userRole", userRoleSchema);

//passport.use(User.createStrategy());
passport.use(
    new localStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if (!user) return done(null, false, { message: 'No user with that email' });
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        });
    })
);

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
        User.findOrCreate({ username: profile.emails[0].value, name: profile.displayName, googleId: profile.id }, function(err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/dashbord",
        passReqToCallback: true,
        profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username: profile.emails[0].value, name: profile.displayName, facebookId: profile.id }, function(err, user) {
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
    passport.authorize('facebook', { scope: ['email'] }));

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

/*app.post("/register", function(req, res) {
    User.register({
        username: req.body.username,
        fName: req.body.fName,
        lName: req.body.lName
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
});*/

app.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }, async(err, doc) => {
        if (err) throw err;
        if (doc) {
            res.redirect("/login");
        }
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username,
                fname: req.body.fname,
                lname: req.body.lname,
                password: hashedPassword,
            });
            await newUser.save();
            res.redirect("/login");
        }
    });
});
/*app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if (err) { return res.status(501).json(err); } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/dashbord");
            });
        }
    });
});*/

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No User Exists");
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                res.redirect("/dashbord")
            });
        }
    })(req, res, next);
});

app.get("/role", function(req, res) {
    if (req.isAuthenticated())
        res.render("role");
    else
        res.redirect("/login");
});

app.post("/role", function(req, res) {
    const newRole = new userRole({
        name: req.body.name,
        role: req.body.role
    });

    newRole.save(function(err) {
        if (!err) {
            res.redirect("/role");
        }
    });
    console.log(req.body.name);
    console.log(req.body.role);

})
app.listen(3000, function() {
    console.log("Server Started On Port 3000");
});