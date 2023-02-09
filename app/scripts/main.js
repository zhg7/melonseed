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
    sessionBtn.textContent = "Mi usuario";
    sessionBtn.setAttribute("data-bs-toggle", "dropdown");
    usernameField.textContent = currentUser;
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
    if (searchText.value.trim() !== "") {
        const path = location.pathname === "/" || location.pathname === "/index.html" ? "/app/" : "";
        location.href = `${path}catalog.html?query=${searchText.value.trim()}`;
    }
}
