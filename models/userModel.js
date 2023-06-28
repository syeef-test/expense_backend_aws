const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    ispremiumuser:{
        type:Boolean,
        required:false,
        default:false
    },
    totalExpense:{
        type:Number,
        required:false,
        default:0
    }

});

module.exports = mongoose.model('User',userSchema);



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');
// const Users = sequelize.define('users', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: false
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     ispremiumuser: Sequelize.BOOLEAN,
//     totalExpense: {
//         type: Sequelize.DOUBLE,
//         defaultValue: 0.00,
//         allowNull: true
//     }
// });
//module.exports = Users;