"use strict";

// Registro
const signUpForm = document.querySelector(".needs-validation");

const usernameRegex = new RegExp(/^\w{3,14}$/); // 3 a 14 carácteres alfanúmericos.
const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/); // Al menos 8 carácteres. Mínimo 1 mayúscula, 1 minúscula y 1 número. Puede contener símbolos.

signUpForm.addEventListener("submit", validateSignUp)

function validateSignUp(e) {
    e.preventDefault();
    const form = e.target;
    const user = form.signupuser;
    const password = form.signuppassword;
    const repeatPassword = form.signuprpassword;
    
    if (!usernameRegex.test(user.value)) {
        provideFeedback(user, true)
    } else {
        provideFeedback(user, false)
    }

    if (!passwordRegex.test(password.value)) {
        provideFeedback(password, true)
    } else {
        provideFeedback(password, false)
    }

    if (password.value !== repeatPassword.value || !passwordRegex.test(password.value)) {
        provideFeedback(repeatPassword, true)
    } else {
        provideFeedback(repeatPassword, false)
    }

}

function provideFeedback(field, isError) {
    if (isError) {
        field.classList.remove("is-valid");
        field.classList.add("is-invalid");
    } else {
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
    }
}

// Inicio de sesión