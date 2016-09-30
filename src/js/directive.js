var app = require('./app.js');

app.
directive("fileModel", [function () {
    return {
        scope: {
            fileModel: "="
        },
        link: function (scope, element, attributes) {
          element.bind("change", function (changeEvent) {
            // base64 FILES
            // var reader = new FileReader();
            // reader.onload = function (loadEvent) {
            //     scope.$apply(function () {
            //         scope.fileModel = loadEvent.target.result;
            //     });
            // }
            // reader.readAsDataURL(changeEvent.target.files[0]);
            
            // SIMPLE FILE-S
            scope.$apply(function () {
                scope.fileModel = changeEvent.target.files[0];
                // or all selected files:
                // scope.fileread = changeEvent.target.files;
            });
          });
        }
    }
}])
.directive('fileReader', function() {
  return {
    scope: {
      fileReader:"="
    },
    link: function(scope, element) {
      element.bind("change", function (changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              scope.$apply(function () {
                scope.fileReader = contents;
                console.log(contents);
              });
          };

          r.readAsText(files[0]);
        }
      });
    }
  };
});