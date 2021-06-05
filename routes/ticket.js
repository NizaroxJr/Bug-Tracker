const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticketController");

router.get("/tickets", ticketController.show_ticket);