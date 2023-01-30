const JSON_FILE = "app/db/fruits.json";

let fruits;
getFruits(JSON_FILE);

async function getFruits(path) {
    const response = await fetch(path);
    const result = await response.json();
    fruits = result;
}