const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const categoryController = require("../controllers/categoryController");

router
    .route("/")
    .post(auth("admin"), categoryController.createCategory)
    .get(auth("admin"), categoryController.getAllCategories);

router
    .route("/:slug")
    .get(auth("admin"), categoryController.getOneCategory)
    .put(auth("admin"), categoryController.updateCategory)
    .delete(auth("admin"), categoryController.deleteCategory);

module.exports = router;