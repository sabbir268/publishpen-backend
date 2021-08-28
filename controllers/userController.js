const User = require("../models/user");
const bcrypt = require("bcrypt");
const asyncHandle = require("../utils/asyncHandle");

exports.create = asyncHandle(async(req, res, next) => {
    let hashed_password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashed_password,
    });

    res.send(newUser);
});