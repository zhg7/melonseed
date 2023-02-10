"use strict";


if (sessionStorage.getItem("logged_user") === null) {
    location.href = "/";
}

const users = JSON.parse(localStorage.getItem("users"));
const fruits = JSON.parse(localStorage.getItem("fruits"));
const userCart = users.find(user => user.user === sessionStorage.getItem("logged_user")).cart;
const itemList = document.querySelector(".cart-items");
const itemArea = document.getElementById("item-area");
const cartContent = document.querySelector(".cart-content");
const placeholder = document.querySelector(".empty-cart-placeholder");

showCartItems();

const quantityInputs = document.querySelectorAll(`[id$="-counter"]`);
const decreaseBtns = document.querySelectorAll(".decrease-counter");
const increaseBtns = document.querySelectorAll(".increase-counter");
const deleteBtns = document.querySelectorAll(".delete-item");

quantityInputs.forEach(field => {
    calculatePrice(field);
})

decreaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        setQuantity(e, false);
    })
})

increaseBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        setQuantity(e, true);
    })
})

deleteBtns.forEach(btn => {
    btn.addEventListener("click", removeItem);
})

quantityInputs.forEach(btn => {
    btn.addEventListener("change", (e) => {
        updateQuantity(e.target);
    })
})



function showCartItems() {
    userCart.forEach(item => {
        const targetFruit = findFruit(item.item);
        const { quantity } = item;
        const { fruit, price, image } = targetFruit;
        itemList.insertAdjacentHTML("beforeend", `<div class="card rounded-3 mb-4 text-light" id="${fruit}">
        <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center">
                <div class="col-md-2">
                    <img src="assets/images/fruits/${image}" class="img-fluid rounded-3 fruit-img" alt="${fruit}">
                </div>
                <div class="col-md-3">
                    <p class="fs-4 fw-normal mb-2">${fruit}</p>
                    <p><span class="text-light">Precio/kg: </span>${formatCurrency(price)}</p>
                </div>
                <div class="col-md-3 col-xl-2">
                    <div class="btn-group" role="group" aria-label="Subir y bajar">
                        <button type="button" class="btn pink-btn rounded-start-pill p-2 decrease-counter"><i
                                class="bi bi-dash-circle d-flex"></i></button>
                        <input id="${fruit}-counter" min="1" name="quantity" value="${quantity}" type="number"
                            class="form-control form-control-sm shadow-none ml-5 text-center rounded-0 fs-5"/>
                        <button type="button" class="btn pink-btn rounded-end-circle p-2 increase-counter"><i
                                class="bi bi-plus-circle d-flex"></i></button>
                    </div>
                </div>
                <div class="col-md-3 col-lg-2">
                    <span class="mb-0 amount fs-5">€</span>
                </div>
                <div class="col-md-1 text-end">
                    <a href="#" class="text-danger"><i class="bi bi-trash-fill delete-item"></i></a>
                </div>
            </div>
        </div>
    </div>`);
    });
    if (userCart.length !== 0) {
        placeholder.classList.add("d-none");
        cartContent.insertAdjacentHTML("afterbegin", `<button type="button" class="red-btn rounded-pill px-4 mb-3 text-light empty-btn"><i
        class="bi bi-cart-x-fill"> </i>Vaciar carrito</button>`);
        itemArea.insertAdjacentHTML("beforeend", `<div class="col-12 cart-info">
        <div class="card mb-4 calcs">
            <div class="card-body p-4 d-flex flex-lg-row flex-column justify-content-between text-light">
                <div>
                    <p class="fs-5" id="subtotal">Subtotal: <span></span></p>
                    <p id="vat">IVA (4%): <span></span></p>
                </div>
                <p class="fs-4" id="total">Total: <span></span></p>
                <button type="button"
                    class="text-light rounded-pill green-btn text-center p-4 d-flex align-items-center justify-content-center">Comprar</button>
            </div>
        </div>
    </div>`);
        cartContent.querySelector(".empty-btn").addEventListener("click", emptyCart);
    } else {    // Esconder esta sección cuando el carrito está vacío.
        if (isCartEmpty()) {
            placeholder.classList.add("d-block");
            itemArea.removeChild(itemArea.querySelector(".cart-info"));
        }
    }
}

function findFruit(fruitName) {
    return fruits.find(fruit => fruit.fruit === fruitName);
}

function setQuantity(e, isIncrease) {
    const target = e.target.tagName === "BUTTON" ? e.target.parentElement : e.target.parentElement.parentElement; // Contemplar clic en el icono también.
    const quantityInput = target.parentElement.querySelector('input[type=number]')
    if (isIncrease) {
        quantityInput.stepUp();
        updateQuantity(quantityInput);
    } else {
        quantityInput.stepDown();
        updateQuantity(quantityInput);
    }
    return quantityInput;
}

function updateQuantity(input) {
    const quantityInput = input;

    if (Number(quantityInput.value) <= 0) {
        quantityInput.value = 1;
    }

    const quantity = Number(quantityInput.value) <= 0 ? 1 : Number(quantityInput.value); // Restringir a un valor mínimo de 1.
    const targetFruit = quantityInput.id.replace(/-counter/, "");
    calculatePrice(input)
    userCart[userCart.findIndex(item => item.item === targetFruit)].quantity = quantity;
    updateUsers(users);
}

function removeItem(e) {
    const target = e.target.closest(".card");
    const fruitToRemove = target.id;
    userCart.splice(userCart.findIndex(item => item.item === fruitToRemove), 1);
    target.remove(target);
    if (isCartEmpty()) {
        placeholder.classList.remove("d-none");
        itemArea.removeChild(itemArea.querySelector(".cart-info"));
        cartContent.removeChild(cartContent.firstElementChild);
    } else {
        calculateTotals();
    }

    updateUsers(users);
}

function emptyCart() {
    userCart.length = 0;
    updateUsers(users);
    location.reload();
}

function isCartEmpty() {
    return userCart.length === 0 && itemArea.querySelector(".cart-info") !== null;
}

function calculatePrice(input) {
    const amountField = input.closest(".card").querySelector(".amount");
    const price = findFruit(input.closest(".card").id).price;
    const quantity = input.value;
    amountField.textContent = formatCurrency(price * quantity);
    calculateTotals();
}

function calculateTotals() {
    const amounts = document.querySelectorAll(".amount");
    const subtotalField = document.getElementById("subtotal");
    const totalField = document.getElementById("total");
    const vatField = document.getElementById("vat");
    let subtotal = 0;
    amounts.forEach(amount => {
        subtotal += Number(amount.textContent.replace(/€/g, "").replace(/\,/g, "."));
    })
    subtotalField.firstElementChild.textContent = formatCurrency(subtotal);
    const vat = subtotal * 1.04 - subtotal;
    vatField.firstElementChild.textContent = formatCurrency(vat);
    totalField.firstElementChild.textContent = formatCurrency(subtotal + vat);
}













