var app = require('../app.js');
app
.controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
  console.log("controller upload");
  
  // TODO : coder le local parse
  $scope.form = {};
  
  $scope.parseAndPost = function(file){
    var fileContent = file.split('\n');
    fileContent = _.map(fileContent, function(l){
      var data = l.split(',');
      data = _.map(data, function(s){return s.trim()});
      return data;
    })
    
    _.each(fileContent, function(data){//<==> .on("data", function(data){
      
    });
    
    
    console.log(fileContent);
  }
  
  
}]);
