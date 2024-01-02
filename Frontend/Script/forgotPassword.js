let ur = ''


async function check(event) {
    try {

        event.preventDefault();
        const obj = {
            email: event.target.email.value
        }
            if (isValid(event.target.email)) {
            const user = await axios.get(`http://localhost:4444/BudgetBuddy/user/password/forgot-password/${obj.email}`)

                if (user.status === 200) {

                const h = document.createElement('h5');
                h.textContent = 'Reset Password link is sent to your email.Please Check there';
                var msg = document.getElementById('msg');
                msg.appendChild(h);
                expireMsg(msg);
            }

        }
    } catch (err) {
            if (err.response.status === 401) {
            const h = document.createElement('h5');
            h.textContent = 'No account exist with this email id. Check your email again';
            var msg = document.getElementById('msg');
            msg.appendChild(h);
            expireMsg(msg);
        }
    }
}
function expireMsg(msg) {
    setTimeout(() => {
        msg.textContent = '';
    }, 3000)

}

function isValid(email) {
    if (email.value.trim().length > 3) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email.value);
    }
    return false;
}