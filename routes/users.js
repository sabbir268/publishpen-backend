const express = require("express");
const router = express.Router();

// import validateReques from middleware folder
const { createUserSchema } = require("../middleware/validateRequest");

const userController = require("../controllers/userController");

router.post("/create", createUserSchema, userController.create);

module.exports = router;