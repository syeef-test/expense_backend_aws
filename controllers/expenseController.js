const ExpenseService = require("../services/mongoExpenseService");

exports.addExpense = async (req, res, next) => {
  try {
    const expenseData = req.body;
    const user= req.user;

    const data = await ExpenseService.addExpense(expenseData, user);

    res.status(201).json({ message: "Expense Added", data: data.toJSON() });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Expense Not Added", success: false });
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = Number(req.query.expenseNumber) || 10;
    const userId = req.user._id;

    const expenses = await ExpenseService.getExpensesByUser(
      userId,
      page,
      ITEMS_PER_PAGE
    );

    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "No Data Found", success: false });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const user = req.user;

    await ExpenseService.deleteExpense(expenseId, user);

    res.status(200).json({ message: "Deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Record Not Deleted", success: false });
  }
};

exports.downloadExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allDownloadRecords = await ExpenseService.downloadExpense(userId);

    res.status(201).json({ data: allDownloadRecords, success: true });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Error in downloading expense", success: false });
  }
};
