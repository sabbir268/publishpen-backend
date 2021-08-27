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
        unique: true,
        required: true,
    },
    hashed_password: {
        type: String,
        unique: true,
        required: true,
    },
    verification_code: { type: String, default: "" },
    authToken: { type: String, default: "" },
    is_verified: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
}, { timestamps: true });

// UserSchema.virtual("password")
//     .set(function(password) {
//         this._password = password;
//         this.hashed_password = this.encryptPassword(password);
//     })
//     .get(function() {
//         return this._password;
//     });


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

UserSchema.statics = {
    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function(options, cb) {
        options.select = options.select || "first_name last_name username";
        return this.findOne(options.criteria).select(options.select).exec(cb);
    },
};

const User = mongoose.model("User", UserSchema);

module.exports = User;