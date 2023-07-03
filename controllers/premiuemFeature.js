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
    // try {
    //     const leaderboardodusers = await User.findAll({
    //         attributes: ['id', 'name', 'totalExpense'],
    //         order: [['totalExpense', 'DESC']]
    //     });
    //     res.status(200).json(leaderboardodusers);
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json(err);
    // }
};

module.exports = {
    getUserLeaderBoard
}