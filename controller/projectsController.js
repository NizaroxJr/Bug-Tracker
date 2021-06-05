const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel").userModel;
const Project = require("../models/projectModel").projectModel;


const project_show = (req, res) => {
    if (req.isAuthenticated()) {
        Project.find({}, (err, projects) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.render("./projects/project", { projects: projects });
            }
        })
    } else {
        res.redirect("/login")
    }
};

const addproject_show = (req, res) => {
    if (req.isAuthenticated()) {
        User.find({}, (err, Users) => {
            if (err) {
                console.log(err);
            } else {
                res.render("./projects/addProject", { Users: Users });
            }
        })
    } else {
        res.redirect("/login")
    }
};
const addproject_creat = (req, res) => {

    const newProject = new Project({
        name: req.body.name,
        description: req.body.description,
        //users: usersObj
    });
    newProject.save();
    res.redirect("/projects");
}

const detail_project = (req, res) => {
    if (req.isAuthenticated()) {
        Project.findOne({ name: req.params.projectname }, (err, project) => {
            if (err) {
                console.log(err);
            } else {
                res.render("./projects/projectDetail", { project: project })
            }
        });
    } else {
        res.redirect("/login")
    }
};

const edit_project = (req, res) => {
    if (req.isAuthenticated()) {
        Project.findOne({ name: req.params.projectname }, (err, project) => {
            if (err) {
                console.log(err);
            } else {
                res.render("./projects/projectEdit", { project: project });
            }
        })
    } else {
        res.redirect("/login")
    }
};

const edit_project_post = (req, res) => {
    Project.updateOne({ name: req.params.projectname }, { "$set": { name: req.body.name, description: req.body.description } },
        (err) => {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.redirect("/projects");
            }
        })
}


module.exports = {
    project_show,
    addproject_show,
    addproject_creat,
    detail_project,
    edit_project,
    edit_project_post
}