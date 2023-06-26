const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true,
    },
    isactive: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);



// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');
// const ForgotPassword = sequelize.define('forgotpasswordrequests', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     isactive: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: true
//     }
// });
// module.exports = ForgotPassword;