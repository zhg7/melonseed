"use strict";


if (sessionStorage.getItem("logged_user") === null) {
    location.href = "/";
}

const fruits = JSON.parse(localStorage.getItem("fruits"));
const userCart = JSON.parse(localStorage.getItem("users")).find(user => user.user === sessionStorage.getItem("logged_user")).cart;
const itemList = document.querySelector(".cart-items");

getCartUser();
showCartItems();

function getCartUser() {
    const userNameField = document.getElementById("cart-user");
    userNameField.textContent = sessionStorage.getItem("logged_user");
}

function showCartItems(){
    userCart.forEach(item => {
        const targetFruit = fruits.find(fruit => fruit.fruit === item.item);
        const { quantity } = item;
        const {fruit, price, image} = targetFruit;
        itemList.innerHTML += `<div class="card rounded-3 mb-4 text-light">
        <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center">
                <div class="col-md-2 col-lg-2 col-xl-2">
                    <img src="assets/images/fruits/${image}" class="img-fluid rounded-3" alt="">
                </div>
                <div class="col-md-3 col-lg-3 col-xl-3">
                    <p class="lead fw-normal mb-2">${fruit}</p>
                    <p><span class="text-muted">test</span>tests <span class="text-muted">dsds:
                        </span>dsds</p>
                </div>
                <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-primary"
                            onclick="this.parentNode.querySelector('input[type=number]').stepDown()"><i
                                class="bi bi-dash-lg"></i></button>
                        <input id="form1" min="0" name="quantity" value="${quantity}" type="number"
                            class="form-control form-control-sm ml-5 text-center" width="200" />
                        <button type="button" class="btn btn-primary"
                            onclick="this.parentNode.querySelector('input[type=number]').stepUp()"><i
                                class="bi bi-plus-lg"></i></button>
                    </div>
                </div>
                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                    <h5 class="mb-0">€</h5>
                </div>
                <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <a href="#!" class="text-danger"><i class="fas fa-trash fa-lg"></i></a>
                </div>
            </div>
        </div>
    </div>`
    });
}








