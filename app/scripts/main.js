"use strict";

// Evitar acceso al carrito sin sesión.
const currentUser = sessionStorage.getItem("logged_user");

if (currentUser === null && location.href.includes("cart")) {
    location.href = "/";
}

if (!location.href.includes("cart")) {
    const cartBtn = document.getElementById("cart-btn");
    const cartPath = cartBtn.getAttribute("href");

    if (currentUser === null) {
        cartBtn.setAttribute("data-bs-toggle", "modal");
        cartBtn.setAttribute("data-bs-target", "#loginModal");
        cartBtn.setAttribute("href", "#");
    } else {
        cartBtn.removeAttribute("data-bs-toggle");
        cartBtn.removeAttribute("data-bs-target");
        cartBtn.setAttribute("href", cartPath);
    }
}

// Habilitar dropdown cuando se ha iniciado sesión
if (currentUser !== null) {
    const sessionBtn = document.querySelector(".session")
    const usernameField = document.querySelector(".username");
    const ordersField = document.getElementById("orders");
    sessionBtn.textContent = "Mi usuario";
    sessionBtn.setAttribute("data-bs-toggle", "dropdown");
    usernameField.textContent = currentUser;
    ordersField.textContent = `(${JSON.parse(localStorage.getItem("users")).find(user => user.user === currentUser).orders})`
}

function updateUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// Notificaciones
Notification.requestPermission();

// Búsqueda
const searchBtn = document.querySelector(".search-btn");
const searchText = document.querySelector(".search-text");

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendSearchQuery()
})

function sendSearchQuery() {
    const path = location.pathname === "/" || location.pathname === "/index.html" ? "/app/" : "";
    if (searchText.value.trim() !== "") {
        location.href = `${path}catalog.html?query=${searchText.value.trim()}`;
    }
}

// Reconocimiento de voz
const micBtn = document.querySelector(".mic-btn");
if (navigator.userAgent.includes("Chrome")) {     // No funciona en Firefox, por el momento.
    getMicrophonePermission();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    micBtn.addEventListener("click", () => {
        micBtn.innerHTML = `<div class="spinner-grow spinner-grow-sm text-secondary" role="status">
        <span class="visually-hidden">Escuchando...</span>
      </div>`;
        new Audio('/app/assets/audio/mic.wav').play();
        recognition.start();
    });

    recognition.addEventListener("result", (e) => {
        getTranscript(e.results[0]);
    })
}

function getTranscript(result) {
    const finalText = result[0].transcript;
    searchText.value = finalText.replace(/[\.,]/g, ""); // Eliminar posibles signos de puntuación.
    setTimeout(() => {
        searchBtn.click();
    }, 800);
}

// Cierre de sesión
const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", destroySession);

function destroySession() {
    sessionStorage.clear();
    location.reload();
}

function getMicrophonePermission() {
    navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
            window.getLocalStream = stream;
        })
}

// Contador de frutas
function updateCartCounter() {
    const users = JSON.parse(localStorage.getItem("users"));
    const userCart = users.find(user => user.user === currentUser).cart;
    const fruitCounter = document.getElementById("fruit-count");
    if (userCart.length > 0) {
        fruitCounter.classList.remove("d-none");
        fruitCounter.textContent = userCart.length;
    } else {
        fruitCounter.classList.add("d-none");
    }

}

if (currentUser !== null) {
    updateCartCounter();
}







