var app = require('../app.js');

app
.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
  var mymap = L.map('petr').setView([43.776600, 1.435513], 11);

  var map = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHJveGltY3JlYXRpb24iLCJhIjoiY2lzZXVjaXd5MDAydDJ1bnF6N2U0NHp1cSJ9.7w32xitQZ8iFA28qdQIvvw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'your.mapbox.public.access.token'
  }).addTo(mymap);
  map.bringToBack();
  $scope.life = {};
  $scope.new = {};

  function onEachFeature(feature, layer) {
    var popupContent = "<center> informations :</center>";

    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }

    layer.bindPopup(popupContent);

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
    geojson.bringToBack();
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
      var Coord = response.data[i].coordinates[0].split(",");
      $scope.itempoints.push ({
        "type": "Feature",
        "properties": {
          "type": response.data[i].type,
          "name": response.data[i].name,
          "popupContent":
                "<center><h2>" + response.data[i].name + "</h2></center>"
              + "<center><strong>" + response.data[i].description + "<br><br></strong></center>"
              + "adresse : <i>" + response.data[i].address + "</i><br><br>"
              + response.data[i].horaires
        },
        "geometry": {
          "type": "Point",
          "coordinates": [parseFloat(Coord[1]),parseFloat(Coord[0])]
        }
      });
    }

    // $scope.$watch(
    //   // This function returns the value being watched. It is called for each turn of the $digest loop
    //   function() { return checki; },
    //   // This is the change listener, called when the value returned from the above function changes
    //   function(newValue, oldValue) {
    //     if ( newValue !== oldValue ) {
    //       // Only increment the counter if the value changed
    //       console.log("afficher/desafficher")
    //     }
    //   }
    // );

    var gitem = L.geoJson($scope.itempoints, {
      pointToLayer: function (feature, latlng) {
        var typecolor;
        switch (feature.properties.type) {
          case 'touristic':
          typecolor = "#e22121"
          break;
          case 'institution':
          typecolor = "#1e7ad0"
          break;
          case 'entreprise':
          typecolor = "#dbee0c"
          break;
          default:
          typecolor = "#4aa989"
        }
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: typecolor,
          color: "#000",
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(mymap);
    gitem.bringToFront();
  });
  console.log($scope.itempoints);
}]);
