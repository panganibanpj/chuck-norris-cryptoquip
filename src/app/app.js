define(['angular', 'text!./app/partials/home.html', 'text!./app/partials/scores.html', 'angular-ui-router', 'angular-bootstrap'], function(angular, gameTemplate, scoresTemplate) {
	function routes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('game', {
				url: '/',
				template: gameTemplate,
				controller: 'GameCtrl'
			})
			.state('scores', {
				url: '/scores',
				template: scoresTemplate,
				controller: 'ScoresCtrl'
			})
		;
		$urlRouterProvider.otherwise('/');
	}
	routes.$inject = [
		'$stateProvider',
		'$urlRouterProvider'
	];
	angular
		.module('Cryptoquip', [
			'ui.router'
			,'ui.bootstrap'
		])
		.config(routes)
	;
});
