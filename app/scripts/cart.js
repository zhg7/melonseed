"use strict";


if (sessionStorage.getItem("logged_user") === null) {
    location.href = "/";
}

const fruits = JSON.parse(localStorage.getItem("fruits"));
const userCart = JSON.parse(localStorage.getItem("users")).find(user => user.user === sessionStorage.getItem("logged_user")).cart;
const itemList = document.querySelector(".cart-items");

getCartUser();
showCartItems();

const decreaseBtns = document.querySelectorAll(".decrease-counter");
const increaseBtns = document.querySelectorAll(".increase-counter");

decreaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const target = e.target.tagName === "BUTTON" ? e.target.parentElement : e.target.parentElement.parentElement; // Contemplar clic en el icono también.
        const quantityInput = target.parentElement.querySelector('input[type=number]')
        quantityInput.stepDown();
        updateQuantity(quantityInput, Number(quantityInput.value));
    })
})

increaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const target = e.target.tagName === "BUTTON" ? e.target.parentElement : e.target.parentElement.parentElement;
        const quantityInput = target.parentElement.querySelector('input[type=number]')
        quantityInput.stepUp();
        updateQuantity(quantityInput, Number(quantityInput.value));
    })
})


function getCartUser() {
    const username = sessionStorage.getItem("logged_user");
    const userNameField = document.getElementById("cart-user");
    userNameField.textContent = username;
    return username;
}

function showCartItems() {
    userCart.forEach(item => {
        const targetFruit = fruits.find(fruit => fruit.fruit === item.item);
        const { quantity } = item;
        const { fruit, price, image } = targetFruit;
        itemList.innerHTML += `<div class="card rounded-3 mb-4 text-light">
        <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center">
                <div class="col-md-2">
                    <img src="assets/images/fruits/${image}" class="img-fluid rounded-3" alt="">
                </div>
                <div class="col-md-3">
                    <p class="lead fw-normal mb-2">${fruit}</p>
                    <p><span class="text-light">Precio/kg: </span>${formatCurrency(price)}</p>
                </div>
                <div class="col-md-3 col-xl-2">
                    <div class="btn-group" role="group" aria-label="Subir y bajar">
                        <button type="button" class="btn btn-primary decrease-counter"><i
                                class="bi bi-dash-lg"></i></button>
                        <input id="${fruit}-counter" min="0" name="quantity" value="${quantity}" type="number"
                            class="form-control form-control-sm ml-5 text-center"/>
                        <button type="button" class="btn btn-primary increase-counter"><i
                                class="bi bi-plus-lg"></i></button>
                    </div>
                </div>
                <div class="col-md-3 col-lg-2">
                    <h5 class="mb-0">€</h5>
                </div>
                <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <a href="#!" class="text-danger"><i class="bi bi-trash-fill"></i></a>
                </div>
            </div>
        </div>
    </div>`
    });
}

function updateQuantity(input, quantity) {
    const targetFruit = input.id.replace(/-counter/, "");
    const users = JSON.parse(localStorage.getItem("users"));
    const cart = users[users.findIndex(user => user.user === getCartUser())].cart;
    cart[cart.findIndex(item => item.item === targetFruit)].quantity = quantity;
    localStorage.setItem("users", JSON.stringify(users));
}










