const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandle = require("../utils/asyncHandle");
const HttpException = require("../utils/httpException");
const { checkValidation } = require("../middleware/validateRequest");
const dotenv = require("dotenv");
dotenv.config();
const email = require("../utils/email");

exports.register = asyncHandle(async(req, res, next) => {
    checkValidation(req);
    let hashed_password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashed_password,
    });

    // send verification code to email
    await emailVerificationCode(newUser);

    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    // });

    res.send({ newUser });
});

exports.login = asyncHandle(async(req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    }).exec();

    if (!user) {
        throw new HttpException(401, "User not found");
    }

    if (user.is_verified === false) {
        throw new HttpException(401, "User not verified");
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new HttpException(401, "Incorrect password!");
    }

    // user matched!
    const secretKey = process.env.JWT_SECRET || "secret12345678";
    const token = jwt.sign({ username: user.username }, secretKey, {
        expiresIn: "8760h",
    });

    // const { password, ...userWithoutPassword } = user;
    res.send({ user, token });
});

exports.verifyCode = asyncHandle(async(req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    }).exec();

    if (!user) {
        throw new HttpException(401, "Incorrect password!");
    }

    if (user.is_verified === true) {
        throw new HttpException(401, "User already verified!");
    }

    if (user.verification_code === req.body.verification_code) {
        await User.findOneAndUpdate({ email: user.email }, { is_verified: true });
        res.send({ message: "User verified!" });
    } else {
        throw new HttpException(401, "Verification code is incorrect");
    }
});

// resend email verification code
exports.resendEmailVerificationCode = asyncHandle(async(req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    }).exec();

    if (!user) {
        throw new HttpException(401, "User not found");
    }

    if (user.is_verified === true) {
        throw new HttpException(401, "User already verified!");
    }

    await emailVerificationCode(user);
    res.send({ message: "Verification code sent!" });
});

// send password reset email
exports.forgotPassword = asyncHandle(async(req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    }).exec();

    if (!user) {
        throw new HttpException(401, "User not found");
    }

    // send verification code to email
    await emailResetPasswordCode(user);

    res.send({ message: "Password reset email sent" });
});

// set new password reset email
exports.resetPassword = asyncHandle(async(req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    }).exec();

    if (!user) {
        throw new HttpException(401, "User not found");
    }

    if (user.password_reset_token === req.body.password_reset_token) {
        const hashed_password = await bcrypt.hash(req.body.password, 10);
        await User.findOneAndUpdate({ email: user.email }, { password: hashed_password, password_reset_token: null });
        res.send({ message: "Password reset successfully" });

        // send email to user
        await emailResetPasswordSuccess(user);
    } else {
        throw new HttpException(401, "Reset password token is incorrect");
    }
});

// send verification code to email
const emailVerificationCode = asyncHandle(async(user) => {
    // console.log(user);
    const verificationCode = Math.floor(Math.random() * 1000000);

    const emailBody = `
    <h1>Verify your account</h1>
    <p>Your verification code is: ${verificationCode}</p>
    `;

    // update user verification code
    await User.findOneAndUpdate({ email: user.email }, { verification_code: verificationCode });
    email.send(user.email, "Verify your account", emailBody);
});

// send password reset email
const emailResetPasswordCode = asyncHandle(async(user) => {
    const resetPasswordCode = Math.floor(Math.random() * 1000000);

    const emailBody = `
    <h1>Reset your password</h1>
    <p>Your reset password code is: ${resetPasswordCode}</p>
    `;

    // update user verification code
    await User.findOneAndUpdate({ email: user.email }, { password_reset_token: resetPasswordCode });
    email.send(user.email, "Reset your password", emailBody);
});

const emailResetPasswordSuccess = asyncHandle(async(user) => {
    const emailBody = `
    <h1>Reset your password successfully</h1>
    <p>Your password has been reset successfully</p>
    `;

    email.send(user.email, "Reset your password successfully", emailBody);
});