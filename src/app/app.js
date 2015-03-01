define(['angular', 'config', 'limit-chars', 'GameCtrl', 'text!./app/partials/home.html', 'ScoresCtrl', 'text!./app/partials/scores.html', 'angular-ui-router', 'angular-bootstrap'],
function(angular,   config,   limitChars,    GameCtrl,   gameTemplate,                    ScoresCtrl,   scoresTemplate) {
	function routes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('game', {
				url: '/',
				template: gameTemplate,
				controller: GameCtrl
			})
			.state('scores', {
				url: '/scores',
				template: scoresTemplate,
				controller: ScoresCtrl
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
		.constant('config', config)
		.config(routes)
		.directive('limitChars', limitChars)
	;
});
