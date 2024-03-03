const mongoose = require('mongoose');

// Define the schema
const downloadSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
});

// Create the model
const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;

// const Sequelize = require('sequelize');
// const sequelize = require('../Util/database');

// const Download = sequelize.define('download', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     url: Sequelize.STRING,
//     date: Sequelize.DATE
// });

// module.exports = Download;