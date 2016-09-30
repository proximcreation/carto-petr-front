var app = require('../app.js');
// var request = require("request");
app
.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
  var mymap = L.map('petr').setView([43.776600, 1.435513], 10);

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
    for (i=1; i<response.data.length; i++){
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
          "fillColor": "blue",
          "weight": 5,
          "opacity": 0.65
        }
      }
    );
    geojson.addTo(mymap);
  });



  //   var petrarea = [{
  //     "type": "Feature",
  //     "properties": {
  //       "name": body.name,
  //       "amenity": "Partie exterieure d'auzielle,",
  //       "popupContent": "Route d'auzielle : vers Odars, Escalquens, Saint Orens"
  //     },
  //     "geometry": {
  //         "type": "Polygon",
  //         "coordinates":
  //
  //         ]]
  //     }
  //   }]
  // }
// var geojson = L.geoJson(
//   auziellearea,
//   {
//     style:{
//       "fillColor": "blue",
//       "weight": 5,
//       "opacity": 0.65
//     }
//   }
// );
}]);
