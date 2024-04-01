const JWT = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

//Protected Routes token base
exports.requireSignIn = async(req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decode = await JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("Error in MiddleWare",error);
  }
};

//admin acceess
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
