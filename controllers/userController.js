const User = require("../models/user");
const bcrypt = require("bcrypt");
const asyncHandle = require("../utils/asyncHandle");

// get all users if auth is user is admin
exports.getAllUsers = asyncHandle(async(req, res, next) => {
    // if (req.user.role !== "admin") {
    //     return res.status(403).send("Access denied");
    // }

    console.log(req.user);

    const users = await User.find({});
    res.status(200).send(users);
});