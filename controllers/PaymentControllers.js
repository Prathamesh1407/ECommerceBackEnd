const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");
const Order = require("../models/OrderModel");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
exports.paymentCheckOutController = async (req, res) => {
  try {
    // const {amount}=req.body;
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error While Payment Process",
      error: err,
    });
  }
};
exports.paymentVerificationController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      const info = await Order.create({
        payment: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        products: cart,
        buyer: req.user._id,
      });
      return res.status(200).json({
        success: true,
        message: "Successfully Verified",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Verification Unsuccessful",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error While Payment Verfication",
      error: err,
    });
  }
};
