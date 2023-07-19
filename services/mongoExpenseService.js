const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const XLSX = require('xlsx');
const S3Service = require('../services/s3services');
const downloadExpense = require('../models/expenseDownloadModel');

exports.addExpense = async (expenseData, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { expenseamount, description, category } = expenseData;
    const userId = user._id;
    const data = await Expense.create({
      expenseamount,
      description,
      category,
      createdDate: Date.now(),
      userId,
    });

    const oldAmount = parseInt(user.totalExpense);
    const newAmount = parseInt(oldAmount) + parseInt(expenseamount);

    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { totalExpense: newAmount } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return data;
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new Error("Expense Not Added");
  }
};

exports.getExpensesByUser = async (userId, page = 1, expenseNumber = 10) => {
  try {
    const ITEMS_PER_PAGE = Number(expenseNumber);

    const countExpenses = await Expense.countDocuments({
      userId,
    });

    const expenses = await Expense.find({ userId })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    return {
      expenses,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < countExpenses,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(countExpenses / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.log(error);
    throw new Error("No Data Found");
  }
};

exports.deleteExpense = async (expenseId, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = user._id;
    const expenseDetails = await Expense.findOne({
      _id: expenseId,
    }).session(session);

    const expenseamount = parseInt(expenseDetails.expenseamount);

    const oldAmount = parseInt(user.totalExpense);
    const newAmount = parseInt(oldAmount) - parseInt(expenseamount);

    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { totalExpense: newAmount } },
      { new: true, session }
    );

    const data = await Expense.deleteOne({ _id: expenseId }).session(
      session
    );
    if (data) {
      return { success: true };
    } else {
      throw new Error("Record Not Found");
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new Error("Record Not Deleted");
  }
};

exports.downloadExpense = async (userId) => {
  try {
    const isPremiuemuser = await User.findOne({ _id: userId });

    if (isPremiuemuser.ispremiumuser) {
      const expenses = await Expense.find({ userId });
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `Expense${userId}/${new Date()}.xlsx`;
      //console.log(expenses);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(JSON.parse(stringifiedExpenses));

      XLSX.utils.book_append_sheet(wb, ws, "Expenses");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

      const fileURL = await S3Service.uploadToS3(wbout, filename);
      console.log(fileURL);

      const databaseAddDetails = await downloadExpense.create({
        expenseurl: fileURL,
        userId,
        createdAt: Date.now(),
      });
      const allDownloadRecords = await downloadExpense.find({ userId });

      return allDownloadRecords;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};