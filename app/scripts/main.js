// Evitar acceso al carrito sin sesión.
const cartBtn = document.getElementById("cart-btn");
const cartPath = cartBtn.getAttribute("href");
if (sessionStorage.getItem("logged_user") === null) {
    cartBtn.setAttribute("data-bs-toggle", "modal");
    cartBtn.setAttribute("data-bs-target", "#loginModal");
    cartBtn.setAttribute("href", "#");
} else {
    cartBtn.removeAttribute("data-bs-toggle");
    cartBtn.removeAttribute("data-bs-target");
    cartBtn.setAttribute("href", cartPath);
}