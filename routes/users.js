var express = require("express");
var router = express.Router();

// create a router to insert data via userController
var userController = require("../controllers/userController");

router.post("/create", userController.create);

module.exports = router;