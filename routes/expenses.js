const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const expenseController = require("../controllers/expenses");
const router = express.Router();
const { userVerification, refresh } = require("../middlewares/authMiddleware");

router.post(
  "/newExpense",
  userVerification,
  wrapAsync(expenseController.createExpense),
);

router.get(
  "/showExpenses",
  userVerification,
  wrapAsync(expenseController.showExpenses),
);

router.patch(
  "/editExpense/:id",
  userVerification,
  wrapAsync(expenseController.editExpense),
);

router.delete(
  "/deleteExpense/:id",
  userVerification,
  wrapAsync(expenseController.deleteExpense),
);

module.exports = router;
