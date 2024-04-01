const Order = require("../models/OrderModel");

exports.getOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .select("-photo")
      .populate("buyer", "name")
      .populate("products", "-photo")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error While getting the orders",
      err,
    });
  }
};
exports.getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .select("-photo")
      .populate("buyer", "name")
      .populate("products", "-photo")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error While getting the All Orders",
      err,
    });
  }
};

exports.updateStatusController = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { status } = req.body;

    const updateDetails = await Order.findByIdAndUpdate(
      orderID,
      { status },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Category Successfully Updated",
      updateDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Error While getting the All Orders",
      err,
    });
  }
};
