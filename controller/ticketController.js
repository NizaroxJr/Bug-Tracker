const express = require("express");
const Ticket = require("../models/ticketModel").ticketModel;

const show_ticket = (req, res) {
    if (req.isAuthenticated()) {
        res.render("./ticket/ticket");
    } else {
        res.redirect("/login");
    }
}

module.exports = {
    show_ticket
}