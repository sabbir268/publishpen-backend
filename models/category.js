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

CategorySchema.pre("save", function(next) {
    this.slug = this.title.split(" ").join("-");
    next();
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;