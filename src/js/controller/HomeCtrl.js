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

  $scope.itempoints = [];
  $http.get("http://localhost:1337/item/?limit=80")
  .then(function (response) {
    for (i=0; i<response.data.length; i++){
      $scope.itempoints.push ({
        "type": "Feature",
        "properties": {
          "name": response.data[i].name,
          "popupContent": response.data[i].description + response.data[i].address + response.data[i].horaires
        },
        "geometry": {
          "type": "Point",
          "coordinates":response.data[i].coordinates // Probleme des coordinates, elles ont des guillemets qu'il faut absolument supprimer, sinon le Geojson peut pas etre consruit.
        }
      })
      console.log($scope.itempoints[i]);
    }
    // var geojson = L.geoJson(
    //   $scope.itempoints,
    //   {
    //     style:{
    //       radius: 8,
    //       fillColor: "#ff7800",
    //       color: "#000",
    //       weight: 1,
    //       opacity: 1,
    //       fillOpacity: 0.8
    //     }
    //   }
    // );
    // geojson.addTo(mymap);
  });
}]);
