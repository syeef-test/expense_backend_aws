const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const expenseSchema = new Schema({
    expenseamount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        required:true
    },
    modfiedDate:{
        type:Date,
        required:false
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
});

module.exports  = mongoose.model('Expense',expenseSchema);



//const Sequelize = require('sequelize');
// const sequelize = require('../util/database');
// const Expense = sequelize.define('expense', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     expenseamount: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     category: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });
// module.exports = Expense;