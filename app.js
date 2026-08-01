const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");
const errorHandler = require("./middlewares/errorMiddleware");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/expenseTracker");
}

main()
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRouter);
app.use("/", expenseRouter);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("setting up expense tracker project");
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
