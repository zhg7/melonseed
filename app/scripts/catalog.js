"use strict";

const JSON_FILE = "/app/db/fruits.json";
const FRUITS_TO_FEATURE = ["Higos", "Fresas", "Sandías", "Piñas", "Melocotones", "Mangos"];

let fruits;
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
    fruits = result;
}

function getFeaturedFruits(fruitsToFeature) {
    const filteredFruits = fruits.filter((fruit) => fruitsToFeature.includes(fruit.fruit))
    featuredFruits = filteredFruits;
}

function showCatalog(isFeatured) {
    const featuredSection = document.querySelector(".featured-fruits");
    const fruitsToShow = isFeatured ? featuredFruits : fruits;
    fruitsToShow.forEach(fruit => {
        ({ fruit, binomial, price, image, origin } = fruit);
        featuredSection.innerHTML += `
    <div class="col">
                        <div class="card">
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
                                    <button type="button" class="pink-btn rounded-pill"><i class="bi bi-cart-plus-fill"></i>
                                        Añadir</button>
                                </div>
                            </div>
                        </div>
                    </div>`
    })
    const descriptionButtons = document.querySelectorAll(".description-trigger");
    descriptionButtons.forEach(btn => {
        btn.addEventListener("click", getDescription)
    })
}

function formatCurrency(price) {
    const options = { style: 'currency', currency: 'EUR' };
    const numberFormat = new Intl.NumberFormat('es-ES', options)
    return numberFormat.format(price);
}

function getCountryName(iso) {
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    return regionNames.of(iso.toUpperCase());
}

function getCountryFlags(scientificName) {
    const fruit = fruits.filter(fruit => fruit.binomial === scientificName)[0];
    const { origin } = fruit;

    let countries = [];
    origin.forEach(country => {
        countries.push(`<img src="https://flagcdn.com/16x12/${country}.png"> ${getCountryName(country)}`);
    })
    return countries.join(" / ");
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
    modalFooter.innerHTML = `<small>Exportadores: ${getCountryFlags(scientificName)}<small>`;
}




