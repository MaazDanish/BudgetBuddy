
// To display user information in toggle
function displayUserInformation(user) {
    document.getElementById('userInfo').innerHTML = `
    <p><h5>Name</h5> ${user.firstName}  ${user.lastName} </p>
    <p><h5>Email</h5> ${user.email}</p>
    <p><h5>Phone Number</h5> ${user.phoneNumber}</p>
    <p><h5>Address</h5> ${user.address}</p>
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
        <td class="text-danger">Today</td>
        <td class="text-danger">${description}</td>
        <td class="text-danger">${price}</td>
        <td class="text-danger">${category}</td>
    </tr>
    `
    var tfoot = document.getElementById('daily-tfoot');
    tfoot.innerHTML = `
    <tr>
        <td class="text-danger">Total Expense</td>
        <td></td>
        <td></td>
        <td class="text-danger" id="todayTotal-Expense">${obj}</td>
    </tr>
    `
}

async function weeklyXpenses(weekly) {
    var weeklyXpenses = document.getElementById('dailyXpenses');
        weekly.data.dayNames.forEach(day => {
        weeklyXpenses.innerHTML = weeklyXpenses.innerHTML + `
        <tr class="table-dark">
            <td class="text-danger">${day}</td>
            <td class="text-danger">${weekly.data.dayWise[day]}</td>
        </tr>
        `
    })

    var tfoot = document.getElementById('tfoot-weekly');
    tfoot.innerHTML = `
        <tr>
            <td class="text-danger"><strong>Total Expense of this week</strong></td>
            <td class="text-danger" id="weeeklyTotal-Expense">${weekly.data.Total}</td>
        </tr>
    `
}
// -----------------------------
async function yearlyExpenses(yearly) {
    var monthlyExpense = document.getElementById('monthlyExpense');

        yearly.data.monthNames.forEach(month => {
        monthlyExpense.innerHTML = monthlyExpense.innerHTML + `
        <tr class="table-dark">
            <td class="text-danger">${month}</td>
            <td class="text-danger">${yearly.data.MonthlyTotals[month]}</td>
        </tr>
        `
    })

    var tfoot = document.getElementById('tfoot-monthly');
    tfoot.innerHTML = `
    <tr>
        <td class="text-danger"><strong>Total Expense of this Year</strong></td>
        <td class="text-danger" id="yearlyTotal-Expense">${yearly.data.Total}</td>
    </tr>
    `

}

// Logout 
document.addEventListener('DOMContentLoaded', () => {
    var logout = document.getElementById('logout');
    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = './SignIn.html';
    })
})
