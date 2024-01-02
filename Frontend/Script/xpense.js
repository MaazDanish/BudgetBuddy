//  when user clicks on edit button
async function toggleEdit(user) {
    try {

        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('editInfo').style.display = 'block';

        const headers = {
            'Authorization': localStorage.getItem('token')
        }

        const user = await axios.get(`http://localhost:4444/BudgetBuddy/user/getUserInfo`, { headers });

        document.getElementById('editFirstName').value = user.data.user.firstName;
        document.getElementById('editLastName').value = user.data.user.lastName;
        document.getElementById('editEmail').value = user.data.user.email;
        document.getElementById('editPhone').value = user.data.user.phoneNumber;
        document.getElementById('editAddress').value = user.data.user.address;
    } catch (err) {
        console.log(err);
    }
}

// when user clicks on save changes button
async function saveChanges() {
    try {
        console.log(document.getElementById('editFirstName').value);
        const userInfo = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            phoneNumber: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value
        }

        const headers = {
            'Authorization': localStorage.getItem('token')
        }

        const user = await axios.put('http://localhost:4444/BudgetBuddy/user/editUserInfo', userInfo, { headers });
        console.log(user.status);
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
    <p class="text-color"><h5>Name</h5> ${user.firstName}  ${user.lastName}</p>
    <p class="text-color"><h5>Email</h5> ${user.email}</p>
    <p class="text-color"><h5>Phone Number</h5> ${user.phoneNumber}</p>
    <p class="text-color"><h5>Address</h5> ${user.address}</p>
    `;
}


// when page reloads 
document.addEventListener('DOMContentLoaded', async () => {
    try {

        if (localStorage.getItem('ispremium') === '1') {
            document.getElementById('buyPremium').textContent = 'Premium User';
            document.getElementById('buyPremium').className = 'btn btn-primary ';

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

        for (var i = 0; i < expenses.data.result.length; i++) {

            displayXpenses(expenses.data.result[i])
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

        clearFields(event);
    } catch (e) {
        console.log(e);
    }

}

async function displayXpenses(xpenses) {
    try {

        const { price, description, category, updatedAt } = xpenses;

        const dateTime = updatedAt;
        const date = dateTime.split('T')[0];

        const tbody = document.querySelector('#tbody');

        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');

        td1.className = 'text-info'
        td2.className = 'text-info'
        td3.className = 'text-info'
        td4.className = 'text-info'
        td5.className = 'text-info'

        tr.className = 'table-dark';

        td1.textContent = date;
        td2.textContent = description;
        td3.textContent = category;
        td4.textContent = price + 'rs';

        const deleteButton = document.createElement('input');
        deleteButton.type = 'button'
        deleteButton.className = 'btn btn-info';
        deleteButton.value = 'Delete'

        const id = xpenses.id;
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

        const deletedXpense = await axios.post(`http://localhost:4444/BudgetBuddy/expenses/deleteXpenses/`, { id });
        console.log('DELETED SUCCESSFULLY', deletedXpense);
        let e = { target: { value: 1 } };
        getexpenseList(e)
    } catch (err) {
        console.log(err);
    }
}

// Logout 
document.addEventListener('DOMContentLoaded', () => {
    var logout = document.getElementById('logout');

    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('ispremium');
        window.location.href = './SignIn.html';
    })
})

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

                document.getElementById('buyPremium').textContent = 'VIP';
                document.getElementById('buyPremium').className = 'btn btn-primary';

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

        let ans = res.data;

        ans.sort((a, b) => b.expense - a.expense);
        for (var i = 0; i < ans.length; i++) {

            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');

            td1.textContent = `${ans[i].firstName} ${ans[i].lastName}`;
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

        const page = event.target.value;

        const expenses = await axios.get(`http://localhost:4444/BudgetBuddy/expenses/addXpenses?page=${page}`, { headers });


        if (expenses.data.length === 0) {
            alert('There is no data exist');
            return;
        }
        tbody.innerHTML = ''
        for (var i = 0; i < expenses.data.result.length; i++) {
            displayXpenses(expenses.data.result[i]);
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
