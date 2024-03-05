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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
},
    {
        timestamps: true

    });

const Expense = mongoose.model('xpense', expenseSchema);

module.exports = Expense;


