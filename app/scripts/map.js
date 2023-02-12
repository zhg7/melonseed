"use strict";

navigator.geolocation.getCurrentPosition(getPosition, () => {
  showMap();
}, { enableHighAccuracy: true });

function getPosition(pos) {
  const coords = pos.coords;
  showMap(coords.latitude, coords.longitude)
}

function showMap(latitude = 40.416729, longitude = -3.703339) {
  const mapOptions = {
    center: [latitude, longitude],
    zoom: 5,
    attributionControl: false
  }

  const melonIcon = L.icon({
    iconUrl: '/app/assets/images/logo/melon.svg',
    iconSize: [38, 38]
  });

  const map = new L.map("map", mapOptions);
  const layer = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
  map.addLayer(layer);

  const origin = [latitude, longitude];
  const destination = [44.244167, 7.769444]
  L.marker(origin).addTo(map).bindPopup(`<b>Tú</b><br> ${origin}`).openPopup();
  L.marker(destination, { icon: melonIcon }).addTo(map).bindPopup(`<b>Melonseed</b><br> ${destination}`).openPopup();
  const polyline = L.polyline([origin, destination], {
    color: '#db4437',
    weight: 4
  });
  polyline.addTo(map);

  const distance = map.distance(origin, destination);
  document.getElementById("distance").textContent = (distance / 1000).toFixed(1);
  getLocation(latitude, longitude).then((result) => displayLocation(result));
}

async function getLocation(latitude, longitude) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
  const result = await response.json();
  return result;
}

function displayLocation(address) {
  const addressField = document.getElementById("location");
  const { address: { road, city, postcode, country } } = address;
  addressField.textContent = `${road}, ${city}, ${postcode}, ${country}`;
}


