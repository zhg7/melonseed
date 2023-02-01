const JSON_FILE = "/app/db/fruits.json";

let fruits;
getFruits(JSON_FILE);

async function getFruits(path) {
    const response = await fetch(path);
    const result = await response.json();
    fruits = result;
    showCatalog();
}

function showCatalog() {
    const featuredSection = document.querySelector(".featured-fruits");
    fruits.forEach(fruit => {
        ({ fruit, binomial, price, image, origin } = fruit);
        featuredSection.innerHTML += `
    <div class="col">
                        <div class="card">
                            <div class="img-container">
                                <img src="/app/assets/images/fruits/${image}" class="card-img-top img-fluid"
                                alt="${fruit}">
                            <div class="overlay text-light text-center">
                                <h2 class="p-4">${fruit}</h2>
                                <h4>Origen:</h4>
                                <ul class="list-unstyled">
                                    ${getCountryFlags(...origin)}
                                </ul>
                            </div>
                            </div>     
                            <div class="card-body">
                                ${getDescription(binomial).then()}
                                <h4 class="text-light text-center">${formatCurrency(price)}/kg</h4>
                                <div class="d-grid">
                                    <button type="button" class="rounded-pill"><i class="bi bi-cart-plus-fill"></i>
                                        Añadir</button>
                                </div>
                            </div>
                        </div>
                    </div>`
    })
}

function formatCurrency(price) {
    const options = { style: 'currency', currency: 'EUR' };
    const numberFormat = new Intl.NumberFormat('es-ES', options)
    return numberFormat.format(price);
}

function getCountryName(iso){
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    return regionNames.of(iso);
}

function getCountryFlags(...origin){
    let countries = ""
    origin.forEach(country => {
        countries += `<li><img src="https://flagcdn.com/24x18/${country}.png"> ${getCountryName(country)}<li>`
    })
    return countries;
}

async function getDescription(title){
    const response = await fetch(`https://es.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${title}&origin=*`);
    const result = await response.json();
    const { query : {pages} } = result
    let articleId;
    for (let p in pages) {
        if (pages.hasOwnProperty(p)) {
            articleId = p;
        }
    }
    let cadena = result.query.pages[articleId].extract;
    cadena = cadena.replace(/\[[0-9]+\]/gm, "")

    return cadena.then((text) => text.toString());

}