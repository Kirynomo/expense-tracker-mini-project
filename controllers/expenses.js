const Expense = require("../models/expenses");

module.exports.showExpenses = async (req, res) => {
  if (!req.user._id) {
    return res.json({
      msg: "gng where your authorization, ts forbidden without login",
    });
  }
  const expenses = await Expense.find({ userId: req.user._id });
  res.json(expenses);
};

module.exports.createExpense = async (req, res) => {
  const { amount, category, description } = req.body.Expense;
  // const id = req.user._id;
  const expense = await Expense.create({
    amount,
    category,
    description,
    userId: req.user._id,
  });
  res.send("done");
};

module.exports.editExpense = async (req, res) => {
  let { id } = req.params;
  const { amount, category, description, date } = req.body.Expense;

  const expense = await Expense.findById(id);
  if (!req.user._id.equals(expense.userId)) {
    return res.status(403).json({ msg: "forbidden" });
  }

  await expense.updateOne({
    amount,
    category,
    description,
    date,
  });
  res.json({ msg: "edited successfully" });
};

module.exports.deleteExpense = async (req, res) => {
  let { id } = req.params;
  const expense = await Expense.findById(id);
  if (!req.user._id.equals(expense.userId)) {
    return res.status(403).json({ msg: "forbidden" });
  }
  await expense.deleteOne();
  res.json({ msg: "expense deleted successfully" });
};
