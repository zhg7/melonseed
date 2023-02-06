"use strict";


if (sessionStorage.getItem("logged_user") === null) {
    location.href = "/";
}

const users = JSON.parse(localStorage.getItem("users"));
const fruits = JSON.parse(localStorage.getItem("fruits"));
const userCart = users.find(user => user.user === sessionStorage.getItem("logged_user")).cart;
const itemList = document.querySelector(".cart-items");

getCartUser();
showCartItems();

const quantityInputs = document.querySelectorAll(`[id$="-counter"]`);
const decreaseBtns = document.querySelectorAll(".decrease-counter");
const increaseBtns = document.querySelectorAll(".increase-counter");
const deleteBtns = document.querySelectorAll(".delete-item");

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
        itemList.innerHTML += `<div class="card rounded-3 mb-4 text-light" id="${fruit}">
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
                        <button type="button" class="btn pink-btn inverted-btn decrease-counter"><i
                                class="bi bi-dash-circle d-flex"></i></button>
                        <input id="${fruit}-counter" min="1" name="quantity" value="${quantity}" type="number"
                            class="form-control form-control-sm ml-5 text-center rounded-0"/>
                        <button type="button" class="btn pink-btn increase-counter"><i
                                class="bi bi-plus-circle d-flex"></i></button>
                    </div>
                </div>
                <div class="col-md-3 col-lg-2">
                    <h5 class="mb-0">€</h5>
                </div>
                <div class="col-md-1 text-end">
                    <a href="#" class="text-danger"><i class="bi bi-trash-fill delete-item"></i></a>
                </div>
            </div>
        </div>
    </div>`
    });
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
    
    if (Number(quantityInput.value) <= 0){
        quantityInput.value = 1;
    }

    const quantity = Number(quantityInput.value) <= 0 ? 1 : Number(quantityInput.value); // Restringir a un valor mínimo de 1.
    const targetFruit = quantityInput.id.replace(/-counter/, "");
    userCart[userCart.findIndex(item => item.item === targetFruit)].quantity = quantity;
    updateUsers();
}

function removeItem(e) {
    const target = e.target.closest(".card");
    const fruitToRemove = target.id;
    userCart.splice(userCart.findIndex(item => item.item === fruitToRemove), 1);
    target.remove(target);
    updateUsers();
}

function calculatePrice() {

}

function updateUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}











