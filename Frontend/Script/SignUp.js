
async function SignUp(event) {
    try {

        event.preventDefault();

        var msg = document.getElementById('sign-msg');

        const signup = {
            firstName: event.target.firstName.value,
            lastName: event.target.lastName.value,
            email: event.target.email.value,
            phoneNumber: event.target.phoneNumber.value,
            password: event.target.password.value,
            confirmPassword: event.target.confirmPassword.value,
            address: event.target.address.value
        }

        if (isValidPassword(event.target.password.value, event.target.confirmPassword.value)) {
            const user = await axios.post('http://localhost:4444/BudgetBuddy/user/signup', signup)

            msg.textContent = 'You have Successfully Signed Up. You can log in now';
            expires(msg);
            clearFields(event);

        } else {

            if (event.target.password.value.length < 6) {
                // console.log('Password must be more than 6 letter');
                msg.textContent = 'Error - Password must be more than 6 letter'
                expires(msg);

            } else if (event.target.password.value !== event.target.confirmPassword.value) {
                // console.log('password does not match');
                msg.textContent = "Error - password doesn't match";
                expires(msg);

            } else {
                // console.log('Password should contain at least one small letter one capital letter and one numeric number');
                msg.textContent = 'Error - Password must contain atleast one small letter, one capital letter and one numeric number'
                expires(msg);

            }
        }

    } catch (err) {
        if (err.response.status === 409) {
            msg.textContent = "Whoa! It appears you've signed up before. Just log in to get started";
            expires(msg);
            return;
        }
        msg.textContent = 'Internal error occured. Please try after some time';
        expires(msg);
        console.log(err, '----',);
    }

}

function isValidPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
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

function clearFields(event) {
    event.target.firstName.value = '';
    event.target.lastName.value = '';
    event.target.email.value = '';
    event.target.phoneNumber.value = '';
    event.target.password.value = '';
    event.target.confirmPassword.value = '';
    event.target.address.value = '';
}

function expires(msg) {
    setTimeout(() => {
        msg.textContent = '';
    }, 3000)
}