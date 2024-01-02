const express = require('express');

const routes = express.Router();

const xpenseController = require('../Controller/xpenseController');
const downloadController = require('../Controller/downloadController');
const authenticateToken = require('../Middleware/authentication');



routes.post('/addXpenses', xpenseController.addExpenses);
routes.get('/addXpenses', authenticateToken, xpenseController.getExpenses);
routes.get('/get-all-expense', authenticateToken, xpenseController.getAllExpenses);
routes.get('/get-today-expense', authenticateToken, xpenseController.getTodayExpense);
routes.get('/get-weekly-expense', authenticateToken, xpenseController.getWeeklyExpense);
routes.get('/get-yearly-expense', authenticateToken, xpenseController.getYearlyExpense);
routes.post('/deleteXpenses', xpenseController.DeleteExpense);

// Creating Download ROUTES

routes.get('/download', authenticateToken, downloadController.downloading);

routes.get('/download/all-url', authenticateToken, downloadController.allURL);



module.exports = routes;