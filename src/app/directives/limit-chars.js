/*
	Limits input
*/
define(['angular', 'config'], function(angular) {
	function limitChars(config) {
		var CONFIG = angular.extend({}, config);

		function link(scope, element, attrs, ngModelCtrl) {
			var limit = Number(attrs.limitChars);
			function limitCharsParser(text) {
				if (text.length > limit) {
					var clippedText = text.substring(CONFIG.NUMBERS.ZERO, limit);
					ngModelCtrl.$setViewValue(clippedText);
					ngModelCtrl.$render();
					element[CONFIG.NUMBERS.ZERO].select();
					return clippedText;
				}
				else if (text.length === limit) {
					element[CONFIG.NUMBERS.ZERO].select();
				}
				return text;
			}
			ngModelCtrl.$parsers.push(limitCharsParser);
		}

		return {
			restrict: 'A',
			require: 'ngModel',
			link: link
		};
	}

	limitChars.$inject = [
		'config'
	];
	angular.module('Cryptoquip').directive('limitChars', limitChars);
});
