const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    email: {
        type: String,
        unique: [true, "Please provied a password"],
        required: true,
    },
    password: {
        type: String,
        unique: false,
        required: [true, "Please provied a password"],
        select: false,
    },
    verification_code: { type: String, default: "" },
    authToken: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
}, { timestamps: true });

// UserSchema.virtual("password").set((password) => {
//     this.hashed_password = await bcrypt.hash(password, 10);
// });

// UserSchema.methods = {
//     encryptPassword: function(password) {
//         if (!password) return "";
//         try {
//             return bcrypt.hashSync(password, 10);
//         } catch (err) {
//             return "";
//         }
//     },
// };

/**
 * Statics
 */

// UserSchema.statics = {

//     load: function(options, cb) {
//         options.select = options.select || "first_name last_name username";
//         return this.findOne(options.criteria).select(options.select).exec(cb);
//     },
// };

const User = mongoose.model("User", UserSchema);

module.exports = User;