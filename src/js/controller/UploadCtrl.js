var app = require('../app.js');
app
.controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
  console.log("controller upload");

  // TODO : coder le local parse
  $scope.form = {

  };

  $scope.parseAndPost = function(file){
    var fileContent = file.split('\n');
    fileContent = _.map(fileContent, function(l){
      var data = l.split(',');
      data = _.map(data, function(s){return s.trim()});
      return data;
    })
    _.each(fileContent, function(data){//<==> .on("data", function(data){
      if (a==0){
        for (var i=0;i< data.length;i++){
          if (data[i]== "insee" || data[i]=="INSEE"){
            insee_column = i;
          }
          titres.push(data[i]);
        }
        console.log(titres);
        console.log("La colonne ou sont les insee est à l'index :" + insee_column + "(soit +1 en nombre de colonne)");
      }
      else{
        var formkey = {};
        for (var j = 0; j < titres.length; j++){
          if(data[j].indexOf('[')==0){
            formkey[titres[j]] = JSON.parse(data[j]);
          }
          else{
            formkey[titres[j]] = data[j];
          }

        }
        $http.get(
          'http://localhost:1337/city?where={"' + titres[insee_column] + '":"' + data[insee_column] + '"}',
          function (error, response, body){
            if (!error && response.statusCode.toString().indexOf('20')==0) {
              if (body == "[]"){
                console.log("Création de nouvel enregistrement INSEE");
                console.log(formkey);
                http({
                  method: 'POST',
                  uri:  'http://localhost:1337/city/',
                  body: formkey,
                  json: true
                },
                function (error, response, body){
                  if (!error && response.statusCode.toString().indexOf('20')==0) {
                    console.log(response.body.name + ' added');
                  }
                  else{
                    console.log('POST KO');
                    console.log(response.body);
                  }
                })
              }
              else{
                console.log("MàJ des informations d'un enregistrement existant");
                formkey.insee = undefined;
                http({
                  method: 'PUT',
                  uri:  'http://localhost:1337/city/'+ JSON.parse(body)[0].id,
                  body: formkey,
                  json: true
                },
                function (error, response, body){
                  if (!error && response.statusCode.toString().indexOf('20')==0) {
                    console.log('MAJ OK');
                    console.log(body) // Show the HTML for the Google homepage.
                  }
                  else{
                    console.log('Failed MaJ');
                    console.log(response.body);
                  }
                })
              }
            }
            else{
              console.log('Failed first put/post');
              console.log(response.body);
            }
          }
        )
      }
      a++;
    });
    console.log(fileContent);
  }


}]);
