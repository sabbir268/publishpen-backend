const express = require("express");
const router = express.Router();

const { createUserSchema } = require("../middleware/validateRequest");

const authController = require("../controllers/authController");

router.post("/register", createUserSchema, authController.register);
router.post("/login", authController.login);
// verify code
router.post("/verify-email", authController.verifyCode);
// resend code
router.post(
    "/resend-verifcation-code",
    authController.resendEmailVerificationCode
);
// forget password
router.post("/forget-password", authController.forgotPassword);
// reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;