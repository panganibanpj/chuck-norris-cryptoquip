/*
	Router
*/
define(['angular'], function(angular) {
	function routes($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: './app/partials/home.html',
				controller: 'GameCtrl'
			})
			.when('/scores', {
				templateUrl: './app/partials/scores.html',
				controller: 'ScoresCtrl'
			})
			.otherwise({
				redirectTo: '/'
			})
		;
	}

	routes.$inject = [
		'$routeProvider'
	];
	angular.module('Cryptoquip').config(routes);
});
