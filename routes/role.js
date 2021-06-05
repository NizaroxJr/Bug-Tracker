const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const User = require("../models/userModel")

router.get("/role", roleController.role_show);
router.post("/role", roleController.role_update);

module.exports = router;