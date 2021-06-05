const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/projects/:projectname/users", userController.manage_users);
router.post("/projects/:projectname/usersRemove", userController.users_remove);
router.post("/projects/:projectname/usersAdd", userController.users_add);


module.exports = router;