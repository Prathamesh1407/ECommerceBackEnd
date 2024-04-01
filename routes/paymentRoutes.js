const express = require("express");
const {
  paymentCheckOutController,
  paymentVerificationController,
} = require("../controllers/PaymentControllers");
const { requireSignIn } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/checkout", paymentCheckOutController);
router.post(
  "/payment-verification",
  requireSignIn,
  paymentVerificationController
);
module.exports = router;
