const Sequelize = require('sequelize');
const sequelize = require('../Util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true

    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING
    },
    ispremiumuser: {
        type: Sequelize.STRING
    },
    totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})

module.exports = User;