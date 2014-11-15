/*
	Limits input to 1 char
*/
;(function(angular, app){

function limitChars(config) {
	var CONFIG = {};
	angular.extend(CONFIG, config);

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			var limit = Number(attrs.limitChars);
			function limitCharsParser(text) {
				if (text.length > limit) {
					var clippedText = text.substring(CONFIG.NUMBERS.ZERO, limit);
					ngModelCtrl.$setViewValue(clippedText);
					ngModelCtrl.$render();
					element[CONFIG.NUMBERS.ZERO].select();
					return clippedText;
				} else if (text.length === limit) element[CONFIG.NUMBERS.ZERO].select();
				return text;
			}
			ngModelCtrl.$parsers.push(limitCharsParser);
		}
	};
}

limitChars.$inject = [
	'config'
];
app.directive('limitChars', limitChars);

})(angular, app);
