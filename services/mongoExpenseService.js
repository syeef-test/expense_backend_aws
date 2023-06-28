const mongoose = require('mongoose');

const userModel = require('../models/userModel');
const expenseModel = require('../models/expenseModel');


exports.addExpense = async (expense) => {
    // try {
    //     const expenseamount = expense.expsenseAmount;
    //     const description = expense.description;
    //     const category = expense.category;
    //     console.log(req.user.useri)
    //     const data = await expenseModel.create({expenseamount:expenseamount,description:description,category:category,createdDate:Date.now(),userId:expense._id,});
    // } catch (error) {
    //     console.log(error);
    // }
}



//const t = await sequelize.transaction(); //unmanged transaction
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