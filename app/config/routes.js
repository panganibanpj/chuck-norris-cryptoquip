/*
	Router
*/
;(function(app) {

function routes($routeProvider) {
	$routeProvider
		.when('/', {
		// 	templateUrl: './partials/home.html',
		// 	controller: 'GameCtrl'
		// })
		// .when('/scores', {
			templateUrl: './partials/scores.html',
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
app.config(routes);

})(app);
