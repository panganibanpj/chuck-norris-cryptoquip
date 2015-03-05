//Routes

define(['controllers/game', 'text!./app/views/home.html', 'controllers/scores', 'text!./app/views/scores.html', 'angular-ui-router', 'angular-ui-bootstrap'],
function(GameCtrl,           gameTemplate,                 ScoresCtrl,           scoresTemplate)
{
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

	return routes;
});
