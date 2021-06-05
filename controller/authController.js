const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/userModel").userModel;

const auth_register = (req, res) => {
    User.findOne({ username: req.body.username }, async(err, doc) => {
        if (err) throw err;
        if (doc) {
            res.redirect("/login");
        }
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username,
                name: req.body.name,
                password: hashedPassword,
            });
            await newUser.save();
            res.redirect("/login");
        }
    });
}

const auth_login = (req, res, next) => {
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
}

const auth_dashbord = (req, res) => {
    if (req.isAuthenticated())
        res.render("dashbord");
    else
        res.redirect("/login");
}


module.exports = {
    auth_register,
    auth_login,
    auth_dashbord
}