const express = require("express");
const router = express.Router();

const { createUserSchema } = require("../middleware/validateRequest");

const authController = require("../controllers/authController");

router.post("/register", createUserSchema, authController.register);
router.post("/login", authController.login);

module.exports = router;