const Category = require("../models/category");
const { validationResult } = require("express-validator");
const asyncHandle = require("../utils/asyncHandle");
const { checkValidation } = require("../middleware/validateRequest");
const HttpException = require("../utils/httpException");

// create category
exports.createCategory = asyncHandle(async(req, res, next) => {
    checkValidation(req);

    const newCategory = await Category.create(req.body);

    res.status(201).json(newCategory);
});

// get all categories
exports.getAllCategories = asyncHandle(async(req, res, next) => {
    const categories = await Category.find();

    res.status(200).json(categories);
});

// get one category by slug
exports.getOneCategory = asyncHandle(async(req, res, next) => {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
        return next(new HttpException(404, "Category not found"));
    }

    res.status(200).json(category);
});

// update category
exports.updateCategory = asyncHandle(async(req, res, next) => {
    checkValidation(req);

    const category = await Category.findOneAndUpdate({ slug: req.params.slug },
        req.body, {
            runValidators: true,
        }
    );

    if (!category) {
        return next(new HttpException(404, "Category not found"));
    }

    res.status(200).json(category);
});

// delete category
exports.deleteCategory = asyncHandle(async(req, res, next) => {
    const category = await Category.findOneAndDelete(req.params.slug);

    if (!category) {
        return next(new HttpException(404, "Category not found"));
    }

    res.status(200).json({
        message: "Category deleted successfully",
    });
});