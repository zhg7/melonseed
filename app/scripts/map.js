const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  
  const crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  showMap(crd.latitude, crd.longitude)
  //get the distance between two points
 

  //display the result

}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  showMap()
}

navigator.geolocation.getCurrentPosition(success, error, options);

function showMap(latitude = 40.4839361, longitude = -3.5679515) {
  const mapOptions = {
    center: [latitude, longitude],
    zoom: 5
  }
  const map = new L.map('map', mapOptions);
  const layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  map.addLayer(layer);

  const origin = [latitude, longitude];
  const destination = [44.244167, 7.769444]
  const markerOrigin = L.marker(origin).addTo(map).bindPopup('Point A<br/>' + origin).openPopup();
  const markerDestination = L.marker(destination).addTo(map).bindPopup('Point B<br/>' + destination).openPopup();
  const polyline = L.polyline([origin, destination], {
    color: 'red'
  });
  polyline.addTo(map);

  let _length = map.distance(origin, destination);
  document.getElementById("distance").textContent = (_length / 1000).toFixed(1);
}


