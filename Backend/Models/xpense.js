const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;


// const Sequelize = require('sequelize');
// const sequelize = require('../Util/database');

// const Expense = sequelize.define('expense', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true

//     },
//     price: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     category: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// })

// module.exports = Expense;