define(['angular', 'config', 'routes', 'directives/limit-chars'],
function(angular,   config,   routes,   limitChars)
{
	var injections = [
		'ui.router'
		,'ui.bootstrap'
	];
	return angular
		.module('Cryptoquip', injections)
		.constant('magic', config)
		.config(routes)
		.directive('limitChars', limitChars)
	;
});
