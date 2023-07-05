const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const sequelize = require('../util/database');


const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardOfUsers = await User.find()
          .select('id name totalExpense')
          .sort({ totalExpense: -1 });
    
        res.status(200).json(leaderboardOfUsers);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
};

module.exports = {
    getUserLeaderBoard
}