const express = require("express");
const { dbConnect } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser');
//Database conncetion
dbConnect();

app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.get("/", (req, res) => {
  res.send({
    message: "WELCOME TO E-COMMERCE",
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
