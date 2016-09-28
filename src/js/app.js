module.exports = (function(){
	var app = angular.module(
		'app',
		['ngRoute', 'LocalStorageModule']
	);

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

		$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		})
		.when('/admin', {
			templateUrl: 'views/admin.html',
			controller: 'AdminCtrl'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl'
		})
		.when('/upload', {
			templateUrl: 'views/upload.html',
			controller: 'UploadCtrl'
		})
		.otherwise({ redirectTo: '/' });

		$locationProvider.hashPrefix('');
	}]);

	app.config(function(localStorageServiceProvider){
		// === TODO : define a prefix for your localstorage data
		localStorageServiceProvider.setPrefix('todo');
	});

	return app;
})();
