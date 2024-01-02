const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./Util/database');
const User = require('./Models/signup');
const Expense = require('./Models/xpense');
const forgotPassword = require('./Models/forgotPassword')
const Order = require('./Models/orderModel');
const Download = require('./Models/download');


const signUpRoutes = require('./Routes/signupRoutes')
const xpenseRoutes = require('./Routes/xpenseroutes');
const premiumRoutes = require('./Routes/purchaseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/BudgetBuddy/user', signUpRoutes);
app.use('/BudgetBuddy/expenses', xpenseRoutes)
app.use('/BudgetBuddy/buy-premium', premiumRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(forgotPassword);
forgotPassword.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

sequelize.sync().then(res => {
    app.listen(process.env.DB_PORT);
})
    .catch(err => {
        console.log(err);
    })