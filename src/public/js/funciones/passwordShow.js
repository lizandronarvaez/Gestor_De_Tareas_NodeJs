let password = document.querySelector('.passwordShow')
let inputPassword = document.querySelector('.passwordInput')

password.addEventListener('click', () => {
    if (inputPassword.type == "password") {
        inputPassword.type = "text"
    } else {
        inputPassword.type = "password"
    }
})
