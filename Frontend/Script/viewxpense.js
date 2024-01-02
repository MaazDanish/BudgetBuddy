
// To display user information in toggle
function displayUserInformation(user) {
    document.getElementById('userInfo').innerHTML = `
    <p><h5>Name</h5> ${user.name} </p>
    <p><h5>Email</h5> ${user.email}</p>
    <p><h5>Phone Number</h5> ${user.whiteumber}</p>
    
`;
}

document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('ispremium') === '1') {
        var downloadbutton = document.getElementById('downloadbutton');
        downloadbutton.className = 'btn downloadLogo';
    }
    const headers = {
        'Authorization': localStorage.getItem('token')
    }

    const user = await axios.get(`http://localhost:4444/BudgetBuddy/user/getUserInfo`, { headers });
    displayUserInformation(user.data.user);
    

    const expenses = await axios.get('http://localhost:4444/BudgetBuddy/expenses/get-today-expense', { headers });

    for (var i = 0; i < expenses.data.expense.length; i++) {
        displayDTDXpense(expenses.data.expense[i], expenses.data.totalExpense);
    
    }

    const weekly = await axios.get('http://localhost:4444/BudgetBuddy/expenses/get-weekly-expense', { headers });
    weeklyXpenses(weekly);

    const yearly = await axios.get('http://localhost:4444/BudgetBuddy/expenses/get-yearly-expense', { headers });
    yearlyExpenses(yearly);
})

async function displayDTDXpense(expenses, obj) {
    const { price, description, category, updatedAt } = expenses;
    const dateTime = updatedAt;
    const date = dateTime.split('T')[0];

    var xpenseTableBody = document.getElementById('viewXpenseTableBody');
    xpenseTableBody.innerHTML = xpenseTableBody.innerHTML + `
    <tr class="table-dark">
        <td class="text-white">Today</td>
        <td class="text-white">${description}</td>
        <td class="text-white">${price}</td>
        <td class="text-white">${category}</td>
    </tr>
    `
    var tfoot = document.getElementById('daily-tfoot');
    tfoot.innerHTML = `
    <tr>
        <td class="text-white">Total Expense</td>
        <td></td>
        <td></td>
        <td class="text-white" id="todayTotal-Expense">${obj}</td>
    </tr>
    `
}

async function weeklyXpenses(weekly) {
    var weeklyXpenses = document.getElementById('dailyXpenses');
        weekly.data.dayNames.forEach(day => {
        weeklyXpenses.innerHTML = weeklyXpenses.innerHTML + `
        <tr class="table-dark">
            <td class="text-white">${day}</td>
            <td class="text-white">${weekly.data.dayWise[day]}</td>
        </tr>
        `
    })

    var tfoot = document.getElementById('tfoot-weekly');
    tfoot.innerHTML = `
        <tr>
            <td class="text-white"><strong>Total Expense of this week</strong></td>
            <td class="text-white" id="weeeklyTotal-Expense">${weekly.data.Total}</td>
        </tr>
    `
}
// -----------------------------
async function yearlyExpenses(yearly) {
    var monthlyExpense = document.getElementById('monthlyExpense');

        yearly.data.monthNames.forEach(month => {
        monthlyExpense.innerHTML = monthlyExpense.innerHTML + `
        <tr class="table-dark">
            <td class="text-white">${month}</td>
            <td class="text-white">${yearly.data.MonthlyTotals[month]}</td>
        </tr>
        `
    })

    var tfoot = document.getElementById('tfoot-monthly');
    tfoot.innerHTML = `
    <tr>
        <td class="text-white"><strong>Total Expense of this Year</strong></td>
        <td class="text-white" id="yearlyTotal-Expense">${yearly.data.Total}</td>
    </tr>
    `

}

// Logout 
// document.addEventListener('DOMContentLoaded', () => {
    var logout = document.getElementById('logout');
    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = './home.html';
    })
// })
