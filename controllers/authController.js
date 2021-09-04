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
        where: {
            email: req.body.email,
        },
    });

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
    const secretKey = process.env.SECRET_JWT || "publishpen";
    const token = jwt.sign({ user_id: user.id.toString() }, secretKey, {
        expiresIn: "8760h",
    });

    // const { password, ...userWithoutPassword } = user;
    res.send({ user, token });
});

// send verification code to email
const emailVerificationCode = async(user) => {
    // console.log(user);
    const verificationCode = Math.floor(Math.random() * 1000000);

    const emailBody = `
    <h1>Verify your account</h1>
    <p>Your verification code is: ${verificationCode}</p>
    `;

    // update user verification code
    await User.findOneAndUpdate({ email: user.email }, { verification_code: verificationCode });
    email.send(user.email, "Verify your account", emailBody);
};