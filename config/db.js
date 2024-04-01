const mongoose = require("mongoose");
require("dotenv").config();
exports.dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connected Successfully");
    })
    .catch((err) => {
      console.log("DB Connection Failed " + err);
    });
};
