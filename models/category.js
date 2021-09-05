const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
}, { timestamps: true });

CategorySchema.pre("validate", function(next) {
    this.slug = this.name.split(" ").join("-").toLowerCase();
    next();
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;