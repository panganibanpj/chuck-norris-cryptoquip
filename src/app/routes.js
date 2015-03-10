//Routes

define(['game/gameController', 'text!game/game.html', 'highScores/highScoresController', 'text!highScores/highScores.html', 'angular-ui-router', 'angular-ui-bootstrap'],
function(gameController,        gameTemplate,          highScoresController,              highScoresTemplate)
{
	function routes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('game', {
				url: '/game',
				template: gameTemplate,
				controller: gameController
			})
			.state('high-scores', {
				url: '/high-scores',
				template: highScoresTemplate,
				controller: highScoresController
			})
		;
		$urlRouterProvider.otherwise('/game');
	}
	routes.$inject = [
		'$stateProvider',
		'$urlRouterProvider'
	];

	return routes;
});
