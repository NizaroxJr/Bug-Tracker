const express = require("express");
const router = express.Router();
const projectController = require("../controller/projectsController");


router.get("/projects", projectController.project_show);
router.get("/projects/add", projectController.addproject_show);
router.post("/projects/add", projectController.addproject_creat);
router.get("/projects/:projectname", projectController.detail_project);
router.get("/projects/:projectname/edit", projectController.edit_project);
router.post("/projects/:projectname/edit", projectController.edit_project_post);

module.exports = router;