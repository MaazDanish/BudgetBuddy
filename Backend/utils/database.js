const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/BudgetBuddy'


const connectToMongoDB = async () => {
    try {
        const connection = await mongoose.connect(url);
    } catch (er) {
        console.log(er);
    }
}

module.exports = connectToMongoDB;