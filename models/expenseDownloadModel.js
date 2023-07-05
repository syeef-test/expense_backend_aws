const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseDownloadSchema = new Schema({
    expenseurl:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    createdAt:{
        type:Date,
        required:true
    }
});


module.exports = mongoose.model('ExpenseDownload',expenseDownloadSchema);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');
// const ExpenseDownload = sequelize.define('expensedownload', {
//     expenseurl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
// });
// module.exports = ExpenseDownload;