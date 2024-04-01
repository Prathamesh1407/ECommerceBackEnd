const {
  createProductController,
  getAllProducts,
  getSingleProduct,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  productSearchController,
  similarProductController,
  getProductsByCategory,
} = require("../controllers/productController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");
const router = require("express").Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
router.get("/get-products", getAllProducts);
router.get("/get-product/:slug", getSingleProduct);
router.get("/product-photo/:pid", productPhotoController);
router.delete("/delete-product/:pid", deleteProductController);
router.put("/update-product/:pid", formidable(), updateProductController);
router.post("/filter-products", productFiltersController);
router.get("/product-count", productCountController);
router.get('/product-search/:keyword',productSearchController);
router.get("/related-product/:pid/:cid",similarProductController);
router.get("/product-category/:slug",getProductsByCategory);
module.exports = router;
