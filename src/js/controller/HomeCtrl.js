var app = require('../app.js');

app
.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
  var mymap = L.map('petr').setView([43.776600, 1.435513], 11);

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHJveGltY3JlYXRpb24iLCJhIjoiY2lzZXVjaXd5MDAydDJ1bnF6N2U0NHp1cSJ9.7w32xitQZ8iFA28qdQIvvw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'your.mapbox.public.access.token'
  }).addTo(mymap);
  $scope.life = {};
  $scope.new = {};
  function onEachFeature(feature, layer) {
    var popupContent = "<p>INFOS :</p>";

    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }

    layer.bindPopup(popupContent);

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }
  $scope.petrarea = [];
  $http.get("http://localhost:1337/city/?limit=80")
  .then(function (response) {
    for (i=0; i<response.data.length; i++){
      $scope.petrarea.push ({
        "type": "Feature",
        "properties": {
          "name": response.data[i].name
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": response.data[i].coordinates

        }
      })
    }
    var geojson = L.geoJson(
      $scope.petrarea,
      {
        style:{
          "fillColor": "#47a284",
          "color": "#47a284",
          "weight": 3,
          "opacity": 0.65
        }
      }
    );
    geojson.addTo(mymap);
  });

  $scope.hgarea = [];
  $http.get("/data/departements.geojson")
  .then(function (response) {
    var id_departement;
    var dep = response.data.features;
    for(i=0; i<dep.length; i++){
      if (dep[i].properties.code == 31){
        id_departement = i;
      }
    }
    $scope.hgarea.push(dep[id_departement])
    var geojson = L.geoJson(
      $scope.hgarea,
      {
        style:{
          "fillColor": "#a2bcb3",
          "color": "#47a284",
          "weight": 2.5,
          "opacity": 0.37
        }
      }
    );
    geojson.addTo(mymap);
  });

  var greenIcon = L.icon({
    iconUrl: 'greenmark.png',
    shadowUrl: 'marker-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  $http.get("http://localhost:1337/item/?limit=80")
  .then(function (response) {
    for (i=0; i<response.data.length; i++){
      var Coord = response.data[i].coordinates[0].split(",");
      var geojsonitem =  {
        "type": "Feature",
        "properties": {
          "type": response.data[i].type,
          "name": response.data[i].name,
          "popupContent": response.data[i].description + "\n" + response.data[i].address + "\n" + response.data[i].horaires
        },
        "geometry": {
          "type": "Point",
          "coordinates": [parseFloat(Coord[0]),parseFloat(Coord[1])]  // Probleme des coordinates, elles ont des guillemets qu'il faut absolument supprimer, sinon le Geojson peut pas etre consruit.
        }
      };
      // L.geoJson(geojsonitem, {
      //   onEachFeature: onEachFeature
      // }).addTo(mymap);
    }
  });

          // switch ($scope.itempoints.properties.type) {
          //   case 'touristic': return {iconUrl: 'greenmark.png'};
          //   case 'institution':   return {iconUrl: 'yellowmark.png'};
          //   case 'entreprise':   return {iconUrl: 'bluemark.png'};
          // }
          // radius: 8,
          // fillColor: "#ff7800",
          // weight: 1,
          // opacity: 1,
          // fillOpacity: 0.8

//     var greenIcon = L.icon({
//     iconUrl: 'greenmark.png',
//     shadowUrl: 'marker-shadow.png',
//
//     iconSize:     [38, 95], // size of the icon
//     shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//     shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });
}]);
