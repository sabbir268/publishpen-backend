const { body, check, validationResult } = require("express-validator");
const User = require("../models/user");
const HttpException = require("../utils/httpException");
const AppError = require("../utils/appError");

exports.createUserSchema = [
    check("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long")
    .custom((value, { req }) => {
        return User.findOne({ username: value }).then((user) => {
            if (user) {
                return Promise.reject("Username already in use");
            }
        });
    })
    .withMessage("Username already in use"),

    check("first_name")
    .exists()
    .withMessage("First name is required")
    .isString()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),

    check("last_name")
    .exists()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Must be only alphabetical chars")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars long"),

    check("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail()
    .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
            if (user) {
                return Promise.reject("Email already in use");
            }
        });
    })
    .withMessage("Email already in use"),

    check("password")
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .isLength({ max: 10 })
    .withMessage("Password can contain max 10 characters"),

    check("confirm_password")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
        "Confirm password field must have the same value as the password field"
    ),
];

exports.checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpException(422, "error", "Validation faild", errors);
    }
};

// body("email").custom((value) => {
//     return User.findUserByEmail(value).then((user) => {
//         if (user) {
//             return Promise.reject("E-mail already in use");
//         }
//     });
// });