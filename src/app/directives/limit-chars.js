/*
	Limits input
*/
define([], function()
{
	function limitChars(magic) {
		var MAGIC = angular.extend({}, magic);

		function link(scope, element, attrs, ngModelCtrl) {
			var limit = Number(attrs.limitChars);
			function limitCharsParser(text) {
				if (text.length > limit) {
					var clippedText = text.substring(MAGIC.NUMBERS.ZERO, limit);
					ngModelCtrl.$setViewValue(clippedText);
					ngModelCtrl.$render();
					element[MAGIC.NUMBERS.ZERO].select();
					return clippedText;
				}
				else if (text.length === limit) {
					element[MAGIC.NUMBERS.ZERO].select();
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
		'magic'
	];

	return limitChars;
});
