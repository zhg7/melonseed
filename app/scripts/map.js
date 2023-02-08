let mapOptions = {  center: [40.4165, -3.70256],
    zoom: 13
  }
  let map = new L.map('map', mapOptions),
  layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  map.addLayer(layer);

  let
  _firstLatLng = [40.4165, -3.70256], //holding first marker latitude and longitude
  _secondLatLng = [40.3536054, -3.5310879],//holding second marker latitude and longitude
  _polyline,    //holding polyline object
  markerA= null,
  markerB = null;

  markerA = L.marker(_firstLatLng).addTo(map).bindPopup('Point A<br/>' + _firstLatLng).openPopup();
  markerB = L.marker(_secondLatLng).addTo(map).bindPopup('Point B<br/>' + _secondLatLng).openPopup();

  _polyline = L.polyline([_firstLatLng, _secondLatLng], {
    color: 'red'
});

_polyline.addTo(map);

//get the distance between two points
let _length = map.distance(_firstLatLng, _secondLatLng);

//display the result


