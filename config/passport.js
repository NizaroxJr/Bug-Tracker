const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("../models/userModel").userModel;

module.exports = function(passport) {
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

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}