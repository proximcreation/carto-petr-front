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
  $scope.life = {
    checki: true,
    checkt: true,
    checke: true
  };
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

  var titem;
  var eitem;
  var iitem;

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
    iitem = L.geoJson(_.filter($scope.itempoints, function(point){return point.properties.type == 'institution'}),{
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#1e7ad0",
          color: "#000",
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(mymap);
    iitem.bringToFront();

    titem = L.geoJson(_.filter($scope.itempoints, function(point){return point.properties.type == 'touristic'}),{
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#e22121",
          color: "#000",
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(mymap);
    titem.bringToFront();

    eitem = L.geoJson(_.filter($scope.itempoints, function(point){return point.properties.type == 'entreprise'}),{
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#dbee0c",
          color: "#000",
          weight: 1,
          opacity: 0.9,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(mymap);
    eitem.bringToFront();
  });

  $scope.$watch(
    function() { return [$scope.life.checki, $scope.life.checkt, $scope.life.checke]; },
    function() {
      if ($scope.life.checki == true){ // si i est checké
        if (iitem !== undefined){
          iitem.addTo(mymap);
          iitem.bringToFront();
        }
      }
      else { // si i n'est pas checké
          mymap.removeLayer(iitem);
      }
      if ($scope.life.checkt == true){ // si i est checké
        if (titem !== undefined){
          titem.addTo(mymap);
          titem.bringToFront();
        }
      }
      else { // si i n'est pas checké
          mymap.removeLayer(titem);
      }
      if ($scope.life.checke == true){ // si i est checké
        if (eitem !== undefined){
          eitem.addTo(mymap);
          eitem.bringToFront();
        }
      }
      else { // si i n'est pas checké
          mymap.removeLayer(eitem);
      }
    },
    true
  );
}]);
