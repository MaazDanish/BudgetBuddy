

let wrapper = document.querySelector('.wrapper'),
    signUpLink = document.querySelector('.link .signup-link'),
    signInLink = document.querySelector('.link .signin-link');

signUpLink.addEventListener('click', () => {
    wrapper.classList.add('animated-signin');
    wrapper.classList.remove('animated-signup');
});

signInLink.addEventListener('click', () => {
    wrapper.classList.add('animated-signup');
    wrapper.classList.remove('animated-signin');
});

async function signup(event) {
    event.preventDefault();
    try {

        console.log(event.target.phoneNumber.value);
        const signup = {
            name: event.target.name.value,
            email: event.target.email.value,
            phoneNumber: event.target.phoneNumber.value,
            password: event.target.password.value,
            confirmpassword: event.target.confirmpassword.value
        }
        const msg = document.getElementById('signupmsg');
        if (isValidPassword(event.target.password.value, event.target.confirmpassword.value)) {
            const user = await axios.post('http://localhost:4444/BudgetBuddy/user/signup', signup)

            msg.textContent = 'You have Successfully Signed Up. You can log in now';
            expires(msg);
            clearFieldsOfSignup(event);

        } else {

            if (event.target.password.value.length < 6) {
                // console.log('Password must be more than 6 letter');
                msg.textContent = 'Error - Password must be more than 6 letter'
                expires(msg);

            } else if (event.target.password.value !== event.target.confirmpassword.value) {
                // console.log('password does not match');
                msg.textContent = "Error - password doesn't match";
                expires(msg);

            } else {
                // console.log('Password should contain at least one small letter one capital letter and one numeric number');
                msg.textContent = 'Error - Password must contain atleast one small letter, one capital letter and one numeric number'
                expires(msg);

            }
        }
        console.log(signup, 'sign up details ');

    } catch (err) {
        console.log(err);

    }
}

function isValidPassword(password, confirmpassword) {
    if (password !== confirmpassword) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    // check for the lower case letter
    if (!/[a-z]/.test(password)) {
        return false;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return false;
    }

    // Check for number
    if (!/\d/.test(password)) {
        return false;
    }

    // if all condition are true then 
    return true;
}

function clearFieldsOfSignup(event) {
    event.target.name.value = '';
    event.target.email.value = '';
    event.target.phoneNumber.value = '';
    event.target.password.value = '';
    event.target.confirmpassword.value = '';
}

function expires(msg) {
    setTimeout(() => {
        msg.textContent = '';
    }, 3000)
}

// --------------------------------------------------- SIGN IN / LOGIN -------------------------------

async function signin(event) {
    event.preventDefault();
    // console.log('hii');
    try {
        // console.log('hii');
        const signin = {
            email: event.target.email.value,
            password: event.target.password.value
        }

        const res = await axios.post("http://localhost:4444/BudgetBuddy/user/signin", signin);
        clearFieldsOfSignin(event);
        if (res.status === 200) {
            console.log(res.data.ispremiumuser);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('ispremium', res.data.ispremiumuser);
            window.location.href = './xpense.html';
        }
        // console.log('hii');

        console.log(signin, 'Sign in');
    } catch (res) {
        console.log(res);
        var msg = document.getElementById('signinmsg');
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

function clearFieldsOfSignin(event) {
    event.target.email.value = ''
    event.target.password.value = '';
}
const forgotPassword = document.getElementById('forgotPassword');
forgotPassword.addEventListener('click', () => {
    window.location.href = './forgotPassword.html';
})