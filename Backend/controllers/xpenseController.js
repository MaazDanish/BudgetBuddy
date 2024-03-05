const User = require('../models/signup');
const Expense = require('../models/xpense');
const jwt = require('jsonwebtoken')
const aws = require('aws-sdk');
const { Op } = require('sequelize');


exports.addExpenses = async (req, res, next) => {
    const token = req.body.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userID = decoded;

        const { price, description, category } = req.body;
        const expense = await Expense.create({
            price: price,
            description: description,
            category: category,
            userId: req.userID.userId
        })

        // console.log(expense);

        const user = await User.findById({ _id: req.userID.userId });
        let sum = parseFloat(user.totalExpense) + parseFloat(price);

        await user.updateOne({ totalExpense: sum });

        return res.status(200).json(expense);

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err, message: "Unsuccess" })
    }
}

async function nextt(id, offset, itemsPerPage) {
    try {
        // console.log(id, offset, itemsPerPage, 'testing in nexttt');
        const xpense = await Expense.find({ userId: id }).
            limit(itemsPerPage).
            skip(offset);

        if (xpense.length > 0) {
            return true;
        }

        return false;

    } catch (err) {
        console.log(err);
        res.status(500).json({ err, message: "Error occcured while selecting offsets" });
    }
}
// exports.getExpenses = async (req, res, next) => {

//     const itemsPerPage = Number(req.headers.pagenumber);

//     const of = ((req.query.page || 1) - 1);


//     Expense.find({
//         where: { userId: req.userID.userId },
//         offset: of * itemsPerPage,
//         limit: itemsPerPage
//     }).then(async result => {
//         let pre; let nex; let prev; let nextv;
//         if (of === 0) {
//             pre = false;
//         } else {
//             pre = true;
//             prev = of;
//         }

//         const ans = await nextt(req.userID.userId, (of + 1) * itemsPerPage, itemsPerPage);
//         if (ans === true) {
//             nex = true;
//             nextv = Number(of) + Number(2);
//         } else {
//             nex = false;
//         }

//         res.status(200).json({ result, pre, nex, nextv, prev })
//     }).catch(err => {
//         console.log(err);
//     })
// }
exports.getExpenses = async (req, res, next) => {
    try {
        const itemsPerPage = Number(req.headers.pagenumber);

        const of = ((req.query.page || 1) - 1);
        console.log(of);

        console.log(itemsPerPage, "Items per page");
        console.log(req.query.page, "Page number");

        const expenses = await Expense.find({ userId: req.userID.userId })
            .skip(of * itemsPerPage)
            .limit(itemsPerPage);

        let pre, nex, prev, nextv;
        if (of === 0) {
            pre = false;
            prev = of;
        } else {
            pre = true;
            prev = of;
        }

        const ans = await nextt(req.userID.userId, (of + 1) * itemsPerPage, itemsPerPage);
        console.log(ans, 'checking the function value');
        if (ans === true) {
            nex = true;

            nextv = Number(of) + Number(2);
            console.log(nextv, 'testing nextv');
        } else {
            nex = false;
        }
        console.log(expenses,pre, nex, nextv, prev);
        // console.log( expenses);
        res.status(200).json({ expenses, pre, nex, nextv, prev });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
// exports.getAllExpenses = async (req, res, next) => {
//     try {
//         const id = req.userID.userId;

//         const expenses = await Expense.find({ userId: id });

//         res.status(200).json(expenses);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, error: err, message: "Unsuccess" })
//     }
// }

// 
exports.getTodayExpense = async (req, res, next) => {
    try {
        const id = req.userID.userId;
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const todayEnd = new Date().setHours(23, 59, 59, 999);

        const expenses = await Expense.find({
            userId: id,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        const totalExpense = expenses.reduce((total, expense) => total + Number(expense.price), 0);

        res.status(200).json({ expenses, totalExpense });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
exports.getWeeklyExpense = async (req, res, next) => {
    try {
        const id = req.userID.userId;

        const today = new Date();
        const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

        const weeklyExpenses = await Expense.find({
            userId: id,
            createdAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
        });

        const weeklyTotalExpenses = weeklyExpenses.reduce((total, expense) => total + Number(expense.price), 0);

        // Calculate daily breakdown
        const dayWiseTotal = {};
        const dayNames = new Set();

        weeklyExpenses.forEach((expense) => {
            const day = expense.createdAt.toLocaleDateString('en-US', { weekday: 'long' });
            dayNames.add(day);
            dayWiseTotal[day] = (dayWiseTotal[day] || 0) + Number(expense.price);
        });

        const uniqueDayNames = Array.from(dayNames);

        res.status(200).json({ Total: weeklyTotalExpenses, dayWise: dayWiseTotal, dayNames: uniqueDayNames });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error occurred while getting weekly expenses' });
    }
};
// exports.getWeeklyExpense = async (req, res, next) => {
//     try {

//         const id = req.userID.userId;

//         const today = new Date();
//         const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
//         const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

//         const weeklyExpenses = await Expense.findAll({
//             where: {
//                 userId: id,
//                 createdAt: {
//                     [Op.gte]: firstDayOfWeek,
//                     [Op.lt]: new Date(lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1)),
//                 },
//             },
//         });

//         const weeklyTotalExpenses = weeklyExpenses.reduce((total, expense) => total + Number(expense.price), 0);


//         // Calculate daily breakdown
//         const dayWiseTotal = {};
//         const dayNames = new Set();

//         weeklyExpenses.forEach((expense) => {
//             const day = expense.createdAt.toLocaleDateString('en-US', { weekday: 'long' });


//             dayNames.add(day);

//             dayWiseTotal[day] = (dayWiseTotal[day] || 0) + Number(expense.price);

//         });

//         const uniqueDayNames = Array.from(dayNames);


//         res.status(200).json({ Total: weeklyTotalExpenses, dayWise: dayWiseTotal, dayNames: uniqueDayNames });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Error occured while getting weekly expenses' })
//     }
// }
// ----------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 
exports.getYearlyExpense = async (req, res, next) => {
    try {
        const id = req.userID.userId;
        const today = new Date();
        const currentYear = today.getFullYear();

        const yearlyExpenses = await Expense.find({
            userId: id,
            createdAt: {
                $gte: new Date(`${currentYear}-01-01`),
                $lt: new Date(`${currentYear + 1}-01-01`),
            }
        });

        const monthlyTotalExpenses = {};
        const monthNames = new Set();

        yearlyExpenses.forEach((expense) => {
            const month = expense.createdAt.toLocaleDateString('en-US', { month: 'long' });
            monthNames.add(month);
            monthlyTotalExpenses[month] = (monthlyTotalExpenses[month] || 0) + Number(expense.price);
        });
        const uniqueMonthNames = Array.from(monthNames);

        const yearlyTotalExpenses = yearlyExpenses.reduce((total, expense) => total + Number(expense.price), 0);

        res.status(200).json({ Total: yearlyTotalExpenses, MonthlyTotals: monthlyTotalExpenses, monthNames: uniqueMonthNames });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// 
exports.deleteExpense = async (req, res, next) => {
    try {
        const id = req.body.id;
        // console.log(id,'testing id in delete expense controller');
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const user = await User.findById(expense.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updatedSum = user.totalExpense - expense.price;
        await user.updateOne({ totalExpense: updatedSum });

        await expense.deleteOne();

        res.status(200).json({ success: true, message: 'Expense deleted' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error occurred' });
    }
};

