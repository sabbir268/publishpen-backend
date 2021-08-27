const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: { type: String, default: "" },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    provider: { type: String, default: "" },
    hashed_password: {
        type: String,
        unique: true,
        required: true,
    },
    authToken: { type: String, default: "" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;