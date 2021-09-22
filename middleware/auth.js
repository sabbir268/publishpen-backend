const HttpException = require("../utils/httpException");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const asyncHandle = require("../utils/asyncHandle");

const auth = (is_admin = "") => {
    return asyncHandle(async function(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = "Bearer ";

            if (!authHeader || !authHeader.startsWith(bearer)) {
                return next(
                    new HttpException(401, "error", "Access denied. No credentials sent!")
                );
            }

            const token = authHeader.replace(bearer, "");
            const secretKey = process.env.JWT_SECRET || "secret12345678";
            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            const user = await User.findOne({ username: decoded.username });

            if (!user) {
                return next(new HttpException(401, "error", "Authentication failed!"));
            }

            // check if the current user is the owner user
            const ownerAuthorized = req.params.id == user.id;

            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            if (!ownerAuthorized && is_admin == "admin" && !user.is_admin) {
                return next(new HttpException(401, "error", "Unauthorized!"));
            }

            // if the user has permissions
            req.currentUser = user;
            next();
        } catch (e) {
            e.status = 401;
            next(e);
        }
    });
};

module.exports = auth;