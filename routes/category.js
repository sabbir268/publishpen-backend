const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const categoryController = require("../controllers/categoryController");

router
    .route("/")
    .post(auth(true), categoryController.createCategory)
    .get(auth(true), categoryController.getAllCategories);

router
    .route("/:id")
    .get(auth(true), categoryController.getCategory)
    .put(auth(true), categoryController.updateCategory)
    .delete(auth(true), categoryController.deleteCategory);

module.exports = router;