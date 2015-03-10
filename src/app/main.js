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

		config: './common/config',
		routes: './app/routes',
		directives: './app/directives',

		game: './app/game',
		highScores: './app/highScores'
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

require(['angular', 'config', 'routes', 'directives/limit-chars'],
function( angular,   config,   routes,   limitChars)
{
	var injections = [
		'ui.router'
		,'ui.bootstrap'
	];
	angular
		.module('Cryptoquip', injections)
		.constant('magic', config)
		.config(routes)
		.directive('limitChars', limitChars)
	;

	angular.element().ready(function() {
		angular.bootstrap(document, ['Cryptoquip']);
	});
});
