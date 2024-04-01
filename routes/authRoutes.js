const express = require("express");
const {
  signUp,
  Login,
  testController,
  forgotPasswordController,
  updateProfileController,
} = require("../controllers/authControllers.js");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/register", signUp);
router.post("/login", Login);
router.get("/test", requireSignIn, isAdmin, testController);
router.post("/forgot-password", forgotPasswordController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.put("/profile", requireSignIn, updateProfileController);
module.exports = router;
