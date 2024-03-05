//  when user clicks on edit button
async function toggleEdit(user) {
    try {

        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('editInfo').style.display = 'block';

        const headers = {
            'Authorization': localStorage.getItem('token')
        }

        const user = await axios.get(`http://localhost:4444/BudgetBuddy/user/getUserInfo`, { headers });
        // console.log(user);

        document.getElementById('editname').value = user.data.user.name;
        document.getElementById('editemail').value = user.data.user.email;
        document.getElementById('editphone').value = user.data.user.phoneNumber;
    } catch (err) {
        console.log(err);
    }
}

// when user clicks on save changes button
async function saveChanges() {
    try {
        console.log(document.getElementById('editname').value);

        const userInfo = {
            name: document.getElementById('editname').value,
            email: document.getElementById('editemail').value,
            phoneNumber: document.getElementById('editphone').value,
        }

        const headers = {
            'Authorization': localStorage.getItem('token')
        }

        const user = await axios.put('http://localhost:4444/BudgetBuddy/user/editUserInfo', userInfo, { headers });
        // console.log(user.status);
        if (user.status === 200) {
            displayUserInformation(userInfo);
        }

        // Hide the edit fields and show the user information
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('editInfo').style.display = 'none';
    } catch (err) {
        console.log(err);
    }
}

// To display user information in toggle
function displayUserInformation(user) {
    document.getElementById('userInfo').innerHTML = `
    <p class="text-color"><h5>Name</h5> ${user.name}  </p>
    <p class="text-color"><h5>Email</h5> ${user.email}</p>
    <p class="text-color"><h5>Phone Number</h5> ${user.phoneNumber}</p>
    `;
}


// when page reloads 
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const ispremium = localStorage.getItem('ispremium');
        // console.log(ispremium);
        if (ispremium === 'true') {
            var buyPremium = document.getElementById('buyPremium');
            buyPremium.remove();

            var vipButton = document.createElement('button');
            vipButton.className = 'btn btn-primary';
            vipButton.textContent = 'VIP';
            document.getElementById('vip').appendChild(vipButton);

            var leaderboardButton = document.getElementById('leaderboardButton');
            leaderboardButton.removeAttribute('disabled');
            leaderboardButton.addEventListener('click', showLeaderBoard);

            var downloadbutton = document.getElementById('downloadbutton');

            downloadbutton.className = 'btn downloadLogo';

            downloadbutton.addEventListener('click', download);

            showurl();

        }

        const headers = {
            'Authorization': localStorage.getItem('token'),
            'pagenumber': document.getElementById('pagenumber').value
        }


        const user = await axios.get(`http://localhost:4444/BudgetBuddy/user/getUserInfo`, { headers });

        displayUserInformation(user.data.user);


        const page = document.getElementById('paginationButton');

        const expenses = await axios.get('http://localhost:4444/BudgetBuddy/expenses/addXpenses?page=1', { headers });

        // console.log(expenses);
        for (var i = 0; i < expenses.data.expenses.length; i++) {
            // console.log(expenses.data.expenses[i]);
            displayXpenses(expenses.data.expenses[i])
        }

        const next = document.createElement('button');
        const prev = document.createElement('button');


        console.log(expenses.data.pre,'get');
        if (expenses.data.pre === true) {
            prev.textContent = `${expenses.data.prev}`;
            prev.value = `${expenses.data.prev}`;
            prev.classList = 'pagination btn btn-primary px-2 mx-2';
            prev.addEventListener('click', getexpenseList);
            document.getElementById('paginationButton').appendChild(prev);
        }

        if (expenses.data.nex === true) {
            next.textContent = `${expenses.data.nextv}`;
            next.value = `${expenses.data.nextv}`;
            next.classList = 'pagination btn btn-primary px-2 mx-2';
            next.addEventListener('click', getexpenseList);
            document.getElementById('paginationButton').appendChild(next);
        }
        const paginationButtonS = document.querySelectorAll('.pagination');

        paginationButtonS.forEach((button) => {
            button.style.display = 'inline-block';
        })


    } catch (err) {
        console.log(err, 'ERROR OCCURED WHILE FETCHING DATA FROM DATABASE OR BACKEND');
    }

})

// Adding xpense function
async function addXpense(event) {

    event.preventDefault();
    const token = localStorage.getItem('token');
    const xpensesObj = {
        price: event.target.price.value,
        description: event.target.description.value,
        category: event.target.category.value,
        token: token
    };

    try {

        const xpense = await axios.post('http://localhost:4444/BudgetBuddy/expenses/addXpenses', xpensesObj);

        let e = { target: { value: 1 } }
        getexpenseList(event);
        location.reload();
        clearFields(event);
    } catch (e) {
        console.log(e);
    }

}

async function displayXpenses(xpenses) {
    try {

        const { price, description, category, updatedAt } = xpenses;
        // console.log(updatedAt);
        const dateTime = updatedAt;
        const date = dateTime.split('T')[0];
        // console.log(date);

        const tbody = document.querySelector('#tbody');

        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');

        td1.className = 'text-white'
        td2.className = 'text-white'
        td3.className = 'text-white'
        td4.className = 'text-white'
        td5.className = 'text-white'

        tr.className = 'table-dark';

        td1.textContent = date;
        td2.textContent = description;
        td3.textContent = category;
        td4.textContent = price + 'rs';

        const deleteButton = document.createElement('input');
        deleteButton.type = 'button'
        deleteButton.className = 'btn btn-light';
        deleteButton.value = 'Delete'

        const id = xpenses._id;
        deleteButton.addEventListener('click', async () => {
            deleteXpense(id);
        })

        td5.appendChild(deleteButton);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);


        tbody.appendChild(tr);

    } catch (e) {
        console.log(e);
    }
}
// delete expense
async function deleteXpense(id) {
    try {
        console.log(id, 'testing in deletede fucntion of expense.js');
        const deletedXpense = await axios.post(`http://localhost:4444/BudgetBuddy/expenses/deleteXpenses/`, { id });
        let e = { target: { value: 1 } };
        getexpenseList(e)
        location.reload();
    } catch (err) {
        console.log(err);
    }
}

// Logout 
// document.addEventListener('DOMContentLoaded', () => {
var logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ispremium');
    // window.location.href = './SignIn.html';
    window.location.href = './home.html';
})
// })

//  Clear fields 
function clearFields(event) {
    event.target.price.value = '';
    event.target.description.value = '';
    event.target.category.value = '';
}

document.getElementById('buyPremium').addEventListener('click', async (event) => {
    try {

        const headers = {
            'Authorization': localStorage.getItem('token')
        }
        const res = await axios.get('http://localhost:4444/BudgetBuddy/buy-premium/buypremium', { headers })

        var options = {
            "key": res.data.key_id, // Entering the key id which is generating from dashboard
            "order_id": res.data.order.id, // for one time payment
            "handler": async function (res) {
                const result = await axios.post('http://localhost:4444/BudgetBuddy/buy-premium/updatetransactionstatus', { order_id: options.order_id, payment_id: res.razorpay_payment_id }, { headers });
                console.log(result);

                var buyPremium = document.getElementById('buyPremium');
                buyPremium.remove();

                var downloadbutton = document.getElementById('downloadbutton');
                downloadbutton.classList.remove = 'disabled';
                downloadbutton.addEventListener('click', download);


                var leaderboardButton = document.getElementById('leaderboardButton');
                leaderboardButton.removeAttribute('disabled');
                leaderboardButton.addEventListener('click', showLeaderBoard);

                showurl();
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();

        rzp1.on('payment.failed', function (res) {
            console.log(res, 'TESTING RESPONSE IN XPENSE.JS LINE NO 123 ----------HUUUUUUUU');
            alert('something went wrong')
        })

    } catch (err) {
        console.log(err);
    }
})

async function showLeaderBoard() {
    try {
        var leaderboardTbody = document.getElementById('leaderboard-result');

        while (leaderboardTbody.firstChild) {
            leaderboardTbody.removeChild(leaderboardTbody.firstChild);
        }

        const res = await axios.get('http://localhost:4444/BudgetBuddy/buy-premium/leaderboard');
        console.log(res, 'hi');
        let ans = res.data;

        console.log(res);

        ans.sort((a, b) => b.expense - a.expense);
        for (var i = 0; i < ans.length; i++) {

            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');

            td1.textContent = `${ans[i].name} `;
            td2.textContent = `${ans[i].totalExpense}`

            tr.appendChild(td1)
            tr.appendChild(td2)

            leaderboardTbody.appendChild(tr);
        }
    } catch (err) {
        console.log(err);
    }
}
function download() {
    const headers = {
        'Authorization': localStorage.getItem('token')
    }
    console.log('hiii');

    axios.get('http://localhost:4444/BudgetBuddy/expenses/download', { headers })
        .then(result => {
            if (result.status === 200) {
                var a = document.createElement('a');
                a.href = result.data.fileUrl;
                a.click();
            } else {
                throw new Error(result.data.message);
            }
        }).catch(err => {
            console.log(err);
        })
}

function showurl() {
    const urlList = document.getElementById('downloadeurl')
    while (urlList.firstChild) {
        urlList.removeChild(urlList.firstChild);

    }

    urlList.innerHTML = `<h5> List Of URL </h5>`;
    const headers = {
        'Authorization': localStorage.getItem('token')
    }

    axios.get('http://localhost:4444/BudgetBuddy/expenses/download/all-url', { headers })
        .then(result => {
            if (result.status === 200) {
                for (let i = 0; i < result.data.length; i++) {
                    let a = document.createElement('a');

                    a.href = result.data[i].url;
                    a.textContent = `expense data downloaded in ${result.data[i].date},click again to download`
                    urlList.appendChild(a);
                    const br = document.createElement('br')
                    urlList.appendChild(br)
                }

            } else {
                throw new Error(result.data.message)
            }

        }).catch(err => {
            console.log(err);
        })
}

async function getexpenseList(event) {
    try {

        const headers = {
            'Authorization': localStorage.getItem('token'),
            'pagenumber': document.getElementById('pagenumber').value
        }
        const paginaton = document.getElementById('paginationButton');

        while (paginaton.firstChild) {
            paginaton.removeChild(paginaton.firstChild);
        }

        console.log('hiiiiiiiiiiiiii');
        const page = event.target.value;

        const expenses = await axios.get(`http://localhost:4444/BudgetBuddy/expenses/addXpenses?page=${page}`, { headers });
        console.log(expenses,'tetsing');

        if (expenses.data.length === 0) {
            alert('There is no data exist');
            return;
        }
        tbody.innerHTML = ''
        for (var i = 0; i < expenses.data.expenses.length; i++) {
            displayXpenses(expenses.data.expenses[i]);
            // console.log(expenses.data);
        }

        const next = document.createElement('button');
        const prev = document.createElement('button');

        if (expenses.data.pre === true) {
            prev.textContent = `${expenses.data.prev}`;
            prev.value = `${expenses.data.prev}`;
            prev.classList = 'pagination btn btn-primary px-2 mx-2';
            prev.addEventListener('click', getexpenseList);
            document.getElementById('paginationButton').appendChild(prev);
        }
        if (expenses.data.nex === true) {
            next.textContent = `${expenses.data.nextv}`;
            next.value = `${expenses.data.nextv}`;
            next.classList = 'pagination btn btn-primary px-2 mx-2';
            next.addEventListener('click', getexpenseList);
            document.getElementById('paginationButton').appendChild(next);
        }
        const paginationButtonS = document.querySelectorAll('.pagination');

        paginationButtonS.forEach((button) => {
            button.style.display = 'inline-block';
        })
    } catch (err) {
        console.log(err);
    }
}
