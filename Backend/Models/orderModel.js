const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    paymentid: {
        type: String
    },
    orderid: {
        type: String
    },
    status: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


// const Sequelize = require('sequelize');
// const sequelize = require('../Util/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentid: Sequelize.STRING,
//     orderid: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;