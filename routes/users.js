const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const userController = require("../controllers/userController");

router.get("/all-users", auth(), userController.getAllUsers);

module.exports = router;