const {
  getOrdersController,
  getAllOrdersController,
  updateStatusController,
} = require("../controllers/orderController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const router = require("express").Router();

router.get("/getorders", requireSignIn, getOrdersController);
router.get("/get-allorders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/update-status/:orderID", requireSignIn, isAdmin, updateStatusController);

module.exports = router;
