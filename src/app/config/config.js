/*
	Static strings + numbers, etc.
*/
define(['angular'], function(angular) {
	function config() {
		//Generic
		this.NUMBERS = {
			INVALID_INDEX: -1,
			ZERO: 0,
			ONE: 1
		};
		this.STRINGS = {
			EMPTY: '',
			SPACE: ' '
		};
		this.TYPES = {
			UNDEFINED: 'undefined'
		};
	}

	config.$inject = [
	];
	angular.module('Cryptoquip').service('config', config);
});
