async function checks(event) {
    event.preventDefault()
    const password = document.getElementById('password').value;
    const uuidd = document.getElementsByName('uuidd')[0].value;

    const obj = {
        password,
        uuidd
    }
    try {

        let res = await axios.post(`http://localhost:4444/BudgetBuddy/user/password/updating-password`, obj)
        document.getElementById('msg').textContent = 'Password is Reset successfully'
        document.getElementById('msg2').textContent = 'You can logIn Now'

    } catch (err) {
        console.log(err, 'ERROR OCCURED')
    }
}

//cd backend
//npm start