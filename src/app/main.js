/*
	TODO:
		Save jokes
		High score page
		Easy/hard
*/
require.config({
	baseUrl: './',
	paths: {
		angular: '../bower_components/angular/angular',
		'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
		'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		config: './app/config/config',
		_app: './app/app',
		GameCtrl: './app/controllers/GameCtrl',
		ScoresCtrl: './app/controllers/ScoresCtrl',
		'limit-chars': './app/directives/limit-chars',
		text: '../bower_components/requirejs-text/text'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		'angular-ui-router': {
			deps: ['angular']
		},
		'angular-bootstrap': {
			deps: ['angular']
		}
	}
});

require(['angular', '_app', 'GameCtrl', 'ScoresCtrl'], function(angular) {
	var $html = angular.element(document.getElementsByTagName('html')[0]);
	angular.element().ready(function() {
		angular.bootstrap(document, ['Cryptoquip']);
	});
});
