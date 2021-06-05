const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel").userModel;
const Project = require("../models/projectModel").projectModel;
const _ = require("lodash");

const manage_users = (req, res) => {
    if (req.isAuthenticated()) {
        Project.findOne({ name: req.params.projectname }, (err, project) => {
            if (err) {
                console.log(err);
            } else {
                User.find({}, (err, users) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let addUsers = [];
                        let result = [];
                        users.forEach((user) => {
                            addUsers.push(user)
                        });
                        console.log(addUsers);
                        console.log(project.users);
                        res.render("./users/editUsers", { project: project, users: addUsers });
                    }
                })
            }
        })
    } else {
        res.redirect("/login")
    }
};

const users_remove = (req, res) => {
    Project.findOneAndUpdate({ name: req.params.projectname }, { $pull: { users: { name: req.body.name } } }, { new: true },
        function(err) {
            if (err) { console.log(err) } else {
                res.redirect("/projects/" + req.params.projectname + "/users")
            }
        }
    )
}

const users_add = (req, res) => {
    const users = req.body.users;
    const usersObj = JSON.parse(users);
    console.log(usersObj);

    Project.findOneAndUpdate({ name: req.params.projectname }, { $push: { users: usersObj } }, { new: true },
        function(err) {
            if (err) { console.log(err) } else {
                res.redirect("/projects/" + req.params.projectname + "/users")
            }
        }
    )
}

module.exports = {
    manage_users,
    users_remove,
    users_add
}