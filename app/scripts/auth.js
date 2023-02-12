"use strict";

const DEFAULT_USERS = [
    {
        "user": "melonseed",
        "password": "Fruit1234",
        "cart": [
            {
                "item": "Limones",
                "quantity": 2
            },
            {
                "item": "Fresas",
                "quantity": 4
            }
        ],
        "orders": 0
    }
]


if (localStorage.getItem("users") === null) {
    localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
}

// Registro
const signUpForm = document.querySelector(".needs-validation");
const usernameRegex = new RegExp(/^\w{4,12}$/); // 4 a 12 carácteres alfanúmericos.
const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/); // Al menos 8 carácteres. Mínimo 1 mayúscula, 1 minúscula y 1 número. Puede contener símbolos.

signUpForm.addEventListener("submit", validateSignUp)

function validateSignUp(e) {
    e.preventDefault();
    const currentUsers = JSON.parse(localStorage.getItem("users"));
    const form = e.target;
    const user = form.signupuser;
    const password = form.signuppassword;
    const repeatPassword = form.signuprpassword;
    let isEverythingCorrect = true;
    let userExists = false;

    if (!usernameRegex.test(user.value)) {
        isEverythingCorrect = false;
        provideFeedback(user, true)
    } else {
        provideFeedback(user, false)
    }

    if (!passwordRegex.test(password.value)) {
        isEverythingCorrect = false;
        provideFeedback(password, true)
    } else {
        provideFeedback(password, false)
    }

    if (password.value !== repeatPassword.value || !passwordRegex.test(password.value)) {
        isEverythingCorrect = false;
        provideFeedback(repeatPassword, true)
    } else {
        provideFeedback(repeatPassword, false)
    }

    if (currentUsers.some(cu => cu.user === user.value.toLowerCase())) {
        userExists = true;
    }

    if (isEverythingCorrect && !userExists) {
        showSubmitResult(false, false, form, user.value)
        createUser(user.value, password.value);
    }

    if (userExists) {
        showSubmitResult(false, true, form, user.value);
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

function showSubmitResult(isLogin, userExists, form, username) {
    if (!isLogin) {
        form.lastElementChild.innerHTML = `<div class="mt-2 alert alert-success alert-dismissible fade show" role="success">
        <i class="bi bi-check-circle-fill"> </i>Se ha creado el usuario <b>${username}</b> exitosamente.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
    } else {
        form.lastElementChild.innerHTML = `<div class="mt-2 alert alert-success alert-dismissible fade show" role="success">
        <i class="bi bi-check-circle-fill"> </i>Has iniciado sesión como <b>${username}</b> exitosamente.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
    }
    if (userExists) {
        form.lastElementChild.innerHTML = `<div class="mt-2 alert alert-danger alert-dismissible fade show" role="error">
        <i class="bi bi-x-circle-fill"> </i>Ya existe el usuario <b>${username}</b>.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
    }

}

function createUser(user, password) {
    const newUser = {
        "user": user.toLowerCase(),
        "password": password,
        "cart": [],
        "orders": 0
    }

    const users = JSON.parse(localStorage.getItem("users"));
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    showNotification(false, newUser.user);
}

// Inicio de sesión
const loginForm = document.querySelector("#loginModal form");

loginForm.addEventListener("submit", validateLogin);

function validateLogin(e) {
    e.preventDefault();
    const form = e.target;
    const userName = form.loginuser;
    const userPassword = form.loginpassword;

    const currentUsers = JSON.parse(localStorage.getItem("users"));

    if (!currentUsers.some(user => user.user === userName.value.toLowerCase() && user.password === userPassword.value)) {
        provideFeedback(userName, true);
        provideFeedback(userPassword, true);
    } else {
        provideFeedback(userName, false);
        provideFeedback(userPassword, false);
        showSubmitResult(true, false, form, userName.value.toLowerCase());
        createSession(userName.value.toLowerCase());
    }

}

function createSession(user) {
    showNotification(true, user);
    sessionStorage.setItem("logged_user", user);
    setTimeout(() => {
        location.reload();
    }, 950);

}

function showNotification(isLogin, userName) {
    if (Notification.permission === "granted") {
        const title = isLogin ? "Inicio de sesión" : "Alta de usuario";
        const body = isLogin ? `¡Bienvenido, ${userName}!` : `¡Gracias por registrarte, ${userName}!`;
        new Notification(title, { body })
    }
}

