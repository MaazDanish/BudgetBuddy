const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectToMongoDB = require('./utils/database');

const signUpRoutes = require('./routes/signupRoutes')
const xpenseRoutes = require('./routes/xpenseRoutes');
const premiumRoutes = require('./routes/purchaseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/BudgetBuddy/user', signUpRoutes);
app.use('/BudgetBuddy/expenses', xpenseRoutes)
app.use('/BudgetBuddy/buy-premium', premiumRoutes)


connectToMongoDB().then(res => {
    app.listen(process.env.DB_PORT, () => {
        console.log('running ');
    });
})
    .catch(err => {
        console.log(err);
    })