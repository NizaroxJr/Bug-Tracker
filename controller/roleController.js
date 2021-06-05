const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel").userModel;

const role_show = function(req, res) {
    if (req.isAuthenticated()) {
        User.find({}, (err, users) => {
            res.render("./role/role", { Users: users });
        })
    } else {
        res.redirect("/login");
    }
}

const role_update = (req, res) => {
    User.updateOne({ name: req.body.name }, { role: req.body.role }, (err, docs) => {});
    res.redirect("/role");
}
module.exports = {
    role_show,
    role_update
}