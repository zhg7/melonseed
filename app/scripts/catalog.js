"use strict";

const JSON_FILE = "/app/db/fruits.json";
const FRUITS_TO_FEATURE = ["Higos", "Fresas", "Sandías", "Piñas", "Melocotones", "Mangos"];
const queryString = location.search;

let availableFruits;
let featuredFruits;

getFruits(JSON_FILE).then(() => {
    getFeaturedFruits(FRUITS_TO_FEATURE);
    if (location.href.includes("catalog")) {
        showCatalog(false);
    }
    if (location.pathname === "/" || location.pathname === "/index.html") {
        showCatalog(true);
    }

});

async function getFruits(path) {
    const response = await fetch(path);
    const result = await response.json();
    availableFruits = result;
    localStorage.setItem("fruits", JSON.stringify(result));
}

function getFeaturedFruits(fruitsToFeature) {
    const filteredFruits = availableFruits.filter((fruit) => fruitsToFeature.includes(fruit.fruit))
    featuredFruits = filteredFruits;
}

function showCatalog(isFeatured) {
    const featuredSection = document.querySelector(".featured-fruits");
    const matchString = document.querySelector(".match-string");
    let fruitsToShow = isFeatured ? featuredFruits : availableFruits;
    if (queryString !== "") {
        const matchedFruits = availableFruits.filter(item => normalizeString(item.fruit.toLowerCase()).includes(normalizeString(getSearchString())));
        if (matchedFruits.length > 0) {
            matchString.textContent = ` / Coincidencias para "${getSearchString()}"`
            fruitsToShow = matchedFruits;
        } else {
            matchString.textContent = ` / Sin coincidencias para "${getSearchString()}"`
        }
    }
    fruitsToShow.forEach(availableFruits => {
        const { fruit, binomial, price, image } = availableFruits;
        featuredSection.insertAdjacentHTML("beforeend", `<div class="col">
        <div class="card ${fruit.toLowerCase()}" id="${fruit}">
            <div class="img-container">
                <img src="/app/assets/images/fruits/${image}" class="card-img-top img-fluid"
                alt="${fruit}">
            <div class="overlay text-light text-center">
                <h2 class="pt-4">${fruit}</h2>
                <p class="fst-italic fs-5">${binomial}</p>
                <button type="button"
            class="text-light green-btn rounded-pill text-center px-4 description-trigger" data-bs-toggle="modal"
            data-bs-target="#descriptionModal">Más info.</button>
            </div>
            </div>     
            <div class="card-body">
                <h4 class="text-light text-center">${formatCurrency(price)}/kg</h4>
                <div class="d-grid">
                    <button type="button" class="add-btn pink-btn rounded-pill">
                        <span class="add"><i class="bi bi-cart-plus-fill"> </i>Añadir</span>
                        <span class="added"><i class="bi bi-cart-check-fill"> </i>Añadido</span>
                        <i class="bi bi-cart-fill"></i>
                        <i class="bi bi-box2-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`)

    })
    const descriptionButtons = document.querySelectorAll(".description-trigger");
    descriptionButtons.forEach(btn => {
        btn.addEventListener("click", getDescription)
    })

    const addBtns = document.querySelectorAll(".add-btn");
    if (sessionStorage.getItem("logged_user") !== null) {
        addBtns.forEach(btn => {
            btn.removeAttribute("data-bs-toggle");
            btn.removeAttribute("data-bs-target");
            btn.addEventListener("click", (e) => {
                btn.classList.add('clicked');
                addToCart(e.target.closest(".card").id);
                setTimeout(() => {
                    btn.classList.remove('clicked')
                }, 2000)
            })
        })
    } else {
        addBtns.forEach(btn => {
            btn.setAttribute("data-bs-toggle", "modal");
            btn.setAttribute("data-bs-target", "#loginModal");
        })
    }
}

function formatCurrency(price) {
    const options = { style: 'currency', currency: 'EUR', useGrouping: false };
    const numberFormat = new Intl.NumberFormat('es-ES', options)
    return numberFormat.format(price);
}

function getCountryName(iso) {
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    return regionNames.of(iso.toUpperCase());
}

function getCountryFlags(scientificName) {
    const fruit = availableFruits.filter(fruit => fruit.binomial === scientificName)[0];
    const { origin } = fruit;

    const countries = [];
    origin.forEach(country => {
        countries.push(`<img src="https://flagcdn.com/16x12/${country}.png"> ${getCountryName(country)}`);
    })
    return countries.join(" / ");
}

function normalizeString(string) {  // Eliminar tildes y eñes
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Wikipedia API
async function retrieveDescription(title) {
    const response = await fetch(`https://es.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${title}&origin=*`);
    const result = await response.json();
    const { query: { pages } } = result
    const articleId = Object.keys(pages)[0];
    const output = result.query.pages[articleId].extract;
    const description = output.replace(/\[[A-Za-z0-9 ]+\]/gm, "") // Eliminar corchetes.
    return description;
}

function getDescription(fruit) {
    const scientificName = fruit.target.previousElementSibling.textContent;
    const genericName = fruit.target.previousElementSibling.previousElementSibling.textContent;
    retrieveDescription(scientificName).then((desc) => setDescription(genericName, scientificName, desc))
}

function setDescription(genericName, scientificName, description) {
    const modalHeader = document.querySelector("#descriptionModal .modal-header h1")
    const modalBody = document.querySelector("#descriptionModal .modal-body");
    const modalFooter = document.querySelector("#descriptionModal .modal-footer");
    modalHeader.textContent = genericName;
    modalBody.textContent = description;
    modalFooter.innerHTML = `<small>Exportadores: ${getCountryFlags(scientificName)}</small>`;
}

function addToCart(fruit) {
    const users = JSON.parse(localStorage.getItem("users"));
    const userCart = users.find(user => user.user === sessionStorage.getItem("logged_user")).cart;
    if (userCart.some(item => item.item === fruit)) {
        userCart[userCart.findIndex(item => item.item === fruit)].quantity += 1;
    } else {
        userCart.push({
            "item": fruit,
            "quantity": 1
        });
    }
    updateUsers(users);
    updateCartCounter();
}

function getSearchString() {
    const urlParams = new URLSearchParams(queryString);
    const stringToSearch = urlParams.get("query").toLowerCase();
    return stringToSearch;
}







