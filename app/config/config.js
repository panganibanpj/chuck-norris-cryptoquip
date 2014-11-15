/*
	Static strings + numbers, etc.
*/
;(function(app) {

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
app.service('config', config);

})(app);
