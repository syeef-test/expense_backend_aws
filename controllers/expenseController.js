const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const downloadExpense = require("../models/expenseDownloadModel");
const sequelize = require("../util/database");

const S3Service = require("../services/s3services");
const UserServices = require("../services/userservices");

//const expenseService = require('../services/mongoExpenseService');
const mongoose = require("mongoose");
const XLSX = require('xlsx');

exports.addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log(req.body);
    const expenseamount = req.body.expenseamount;
    const description = req.body.description;
    const category = req.body.category;

    // if (!expenseamount) {
    //   throw new Error('Expense amount is required.');
    // }

    const data = await Expense.create({
      expenseamount: expenseamount,
      description: description,
      category: category,
      createdDate: Date.now(),
      userId: req.user._id,
    });

    const oldAmount = req.user.totalExpense;
    const newAmount = parseInt(oldAmount) + parseInt(expenseamount);

    const userUpdate = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { totalExpense: newAmount } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Expense Added", data: data.toJSON() });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(401).json({ error: "Expense Not Added", success: false });
  }
  // const t = await sequelize.transaction(); //unmanged transaction
  // try {
  //   const expenseamount = req.body.expsenseAmount;
  //   const description = req.body.description;
  //   const category = req.body.category;

  //   const insertData = await Expense.create(
  //     {
  //       expenseamount: expenseamount,
  //       description: description,
  //       category: category,
  //       userId: req.user.id,
  //     },
  //     { transaction: t }
  //   );
  //   //console.log(insertData);

  //   const oldAmount = req.user.totalExpense;
  //   const newAmount = parseFloat(oldAmount) + parseFloat(expenseamount);
  //   //console.log(newAmount);
  //   const updateUser = await User.update(
  //     { totalExpense: newAmount },
  //     {
  //       where: {
  //         id: req.user.id,
  //       },
  //       transaction: t,
  //     }
  //   );

  //   await t.commit();
  //   //throw new Error();
  //   res
  //     .status(201)
  //     .json({ message: "Expense Added", data: insertData.toJSON() });
  // } catch (error) {
  //   if (t) {
  //     await t.rollback();
  //     res.status(401).json({ error: "Expense Not Added", success: false });
  //   }

  //   console.log(error);
  // }
};

exports.getExpense = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const ITEMS_PER_PAGE = Number(req.query.expenseNumber) || 10;

    const countExpenses = await Expense.countDocuments({
      userId: req.user._id,
    });

    const expenses = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

      console.log(expenses);

    res.status(200).json({
      expenses: expenses,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < countExpenses,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(countExpenses / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "No Data Found", success: false });
  }
  // try {
  //   const page = + req.query.page || 1;
  //   const ITEMS_PER_PAGE = Number(req.query.expenseNumber) || 10;
  //   console.log(req.query.expenseNumber);
  //   let countExpenses;
  //   const expenseData = await Expense.findAndCountAll({
  //     where: { userId: req.user.id },
  //     offset: (page - 1) * ITEMS_PER_PAGE,
  //     limit: ITEMS_PER_PAGE
  //   });
  //   countExpenses = expenseData.count;
  //   res.status(200).json({
  //     expenses: expenseData.rows,
  //     currentPage: page,
  //     hasNextPage: ITEMS_PER_PAGE * page < countExpenses,
  //     nextPage: page + 1,
  //     hasPreviousPage: page > 1,
  //     previousPage: page - 1,
  //     lastPage: Math.ceil(countExpenses / ITEMS_PER_PAGE)
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
};

exports.deleteExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // console.log(req.params.id);

    const expenseDetails = await Expense.findOne({
      _id: req.params.id,
    }).session(session);
    //console.log(expenseDetails);
    const expenseamount = parseFloat(expenseDetails.expenseamount);

    const oldAmount = req.user.totalExpense;
    const newAmount = parseInt(oldAmount) - parseInt(expenseamount);

    const userUpdate = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { totalExpense: newAmount } },
      { new: true, session }
    );

    const data = await Expense.deleteOne({ _id: req.params.id }).session(
      session
    );
    if (data) {
      res.status(200).json({ message: "Deleted successfully", success: true });
    } else {
      res.status(404).json({ message: "Record Not Found", success: false });
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(401).json({ error: "Record Not Deleted", success: false });
  }

  // const t = await sequelize.transaction(); //unmanged transaction
  // try {
  //   const expenseId = req.params.id;
  //   //console.log(expenseId);

  //   const expenseDetails = await Expense.findOne({
  //     where: { id: expenseId },
  //     transaction: t,
  //   });
  //   const expenseamount = parseFloat(expenseDetails.expenseamount);

  //   const oldAmount = req.user.totalExpense;
  //   const newAmount = parseFloat(oldAmount) - parseFloat(expenseamount);
  //   //console.log(newAmount);
  //   const updateUser = await User.update(
  //     { totalExpense: newAmount },
  //     {
  //       where: {
  //         id: req.user.id,
  //       },
  //       transaction: t,
  //     }
  //   );

  //   const deleteData = await Expense.destroy({
  //     where: { id: expenseId, userId: req.user.id },
  //     transaction: t,
  //   });

  //   await t.commit();
  //   //throw new Error();
  //   res.status(200).json({ message: "Deleted successfully", success: true });
  // } catch (error) {
  //   if (t) {
  //     await t.rollback();
  //     res.status(404).json({ message: "record not found", success: false });
  //   }
  //   console.log(error);
  // }
};

exports.downloadExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const isPremiuemuser = await User.findOne({_id:userId});
    console.log(isPremiuemuser);
    if (isPremiuemuser.ispremiumuser) {
      const expenses = await Expense.find({userId:userId});
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `Expense${userId}/${new Date()}.xlsx`;
      console.log(expenses);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(JSON.parse(stringifiedExpenses));

      XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  
      const fileURL = await S3Service.uploadToS3(wbout, filename);
      //console.log(fileURL);

      const databaseAddDetails = await downloadExpense.create({ expenseurl: fileURL, userId: userId });
      const allDownloadRecords = await downloadExpense.find(
        { userId: userId },
        {
          expenseUrl: 1,
          createdAt: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: '$createdAt'
            }
          }
        }
      );
      res.status(201).json({ data: allDownloadRecords, success: true });
    }
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const userId = req.user.id;
  //   const isPremiuemuser = await User.findOne({ where: { id: userId } });
  //   if (isPremiuemuser.ispremiumuser) {
  //     const expenses = await UserServices.getExpenses(req);
  //     const stringifiedExpenses = JSON.stringify(expenses);
  //     //console.log(stringifiedExpenses);
  //     const filename = `Expense${userId}/${new Date()}.txt`;
  //     const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
  //     //console.log(fileURL);
  //     const databaseAddDetails = await downloadExpense.create({ expenseurl: fileURL, userId: userId });
  //     //console.log(databaseAddDetails);
  //     const allDownloadRecords = await downloadExpense.findAll(
  //       {
  //         attributes: [
  //           "expenseurl",
  //           [
  //             sequelize.fn(
  //               "date_format",
  //               sequelize.col("createdAt"),
  //               "%Y-%m-%d %H:%i:%s"
  //             ),
  //             "createdAt",
  //           ],
  //         ],
  //       },
  //       { where: { userId: userId } }
  //     );
  //     res.status(201).json({ data: allDownloadRecords, success: true });
  //     //res.status(201).json({fileURL,success:true});
  //     //res.status(201).json({message:"Download Link Generated"});
  //   } else {
  //     res.status(401).json({ message: "User is not Authorized", success: false });
  //   }
  // } catch (error) {
  //   console.log(error);
  //   //res.status(500).json({ fileURL: "", success: false, error: error });
  //   res.status(500).json({ fileURL: "", success: false });
  // }
};
