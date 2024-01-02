const Sequelize = require('sequelize');
const sequelize = require('../Util/database');

const Download = sequelize.define('download', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: Sequelize.STRING,
    date: Sequelize.DATE
});

module.exports = Download;