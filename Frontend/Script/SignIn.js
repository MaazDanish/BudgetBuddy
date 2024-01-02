async function SignIn(event) {
    try {
        event.preventDefault();
        const SignIn = {
            email: event.target.email.value,
            password: event.target.password.value
        }

        const res = await axios.post("http://localhost:4444/BudgetBuddy/user/signin", SignIn);
        if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('ispremium', res.data.ispremiumuser);
            window.location.href = './xpense.html';
        }
        clearFields(event);

    } catch (res) {
        var msg = document.getElementById('login-msg');
        if (res.response.status === 404) {
            msg.textContent = 'User Does not exist. Please sign up first'

        }
        else if (res.response.status === 401) {
            msg.textContent = 'One or more field is incorrect. Try again'

        } else {

            msg.textContent = 'Internal server error'
        }

        setTimeout(() => {
            msg.textContent = '';
        }, 3000)
    }


}

function clearFields(event) {
    event.target.email.value = ''
    event.target.password.value = '';
}

const forgotPassword = document.getElementById('forgotPassword');
forgotPassword.addEventListener('click', () => {
    window.location.href = './forgotPassword.html';
})