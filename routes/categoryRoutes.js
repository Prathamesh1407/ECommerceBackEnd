const {
  createCategoryController,
  updateCategoryController,
  getAllCategories,
  getCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");

const router = require("express").Router();

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);
router.get("/get-categories",getAllCategories);
router.get("/get-category/:slug",getCategory);
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);

module.exports = router;
