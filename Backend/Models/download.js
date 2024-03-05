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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
});

// Create the model
const Download = mongoose.model('download', downloadSchema);

module.exports = Download;