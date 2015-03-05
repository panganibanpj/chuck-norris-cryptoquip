/*
	TODO:
		Save jokes
		High score page
		Easy/hard
*/
require.config({
	baseUrl: './',
	paths: {
		angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular',
		'angular-ui-router': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router',
		'angular-ui-bootstrap': '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.11.2/ui-bootstrap-tpls',
		text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text',
		_app: './app/app',
		config: './app/config',
		routes: './app/routes',
		model: './app/model/modelFactory',
		'services/joke': './app/services/jokeService',
		'controllers/game': './app/controllers/GameCtrl',
		'controllers/scores': './app/controllers/ScoresCtrl',
		'directives/limit-chars': './app/directives/limit-chars'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		'angular-ui-router': {
			deps: ['angular']
		},
		'angular-ui-bootstrap': {
			deps: ['angular']
		}
	}
});

require(['angular', '_app'], function(angular)
{
	angular.element().ready(function() {
		angular.bootstrap(document, ['Cryptoquip']);
	});
});
