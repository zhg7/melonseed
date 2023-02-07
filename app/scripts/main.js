// Evitar acceso al carrito sin sesión.



function cartClick() {
	let button = this;
	button.classList.add('clicked');
}

if (sessionStorage.getItem("logged_user") === null && location.href.includes("cart")) {
    location.href = "/";
}

if (!location.href.includes("cart")) {
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
}

function updateUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}