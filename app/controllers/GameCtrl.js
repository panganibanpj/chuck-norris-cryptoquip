/*
TODO:
	Timer
	Score
	Auto-tab text boxes to next available
	Auto width non-word chars
	Hints
*/

;(function(angular, app) {



/* Main */
function GameCtrl($scope, config, $http, $interval) {
	/* Config */
	var CONFIG = {
		NAMESPACE: 'GAME.',

		//Fetching and massaging
		HTTP_METHOD: 'GET',
		LETTER_REGEX: /[a-zA-Z]/,
		QUOTE_ENDPOINT: 'http://api.icndb.com/jokes/random?exclude=[explicit]',
		QUOTE_SOURCE_MAP: {
			'http://api.icndb.com/jokes/random?exclude=[explicit]': 'ICNDB'
		},
		QUOTE_SOURCE_MAPS: {
			ICNDB: 'ICNDB'
		},

		//Creating map
		ALPHABET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		LETTERS_IN_ALPHABET: 26,

		//Timer
		STARTING_TIME: 60000,
		INTERVAL_LENGTH: 100
	};
	angular.extend(CONFIG, config);



	/* Variables */
	var NAMESPACE = CONFIG.NAMESPACE,
		blockedKeys = '',
		countdownTimer
	;
	$scope.quote = {};
	$scope.textBoxes = {};
	$scope.status = {
		timeRemaining: CONFIG.STARTING_TIME,
		score: CONFIG.NUMBERS.ZERO
	};



	/* Events */
	var EVENTS = $scope.EVENTS = {
		START_NEW_GAME: 'START_NEW_GAME',
		GET_NEW_QUOTE: 'GET_NEW_QUOTE',
		GOT_NEW_QUOTE: 'GOT_NEW_QUOTE',
		ERROR_GETTING_QUOTE: 'ERROR_GETTING_QUOTE',
		INITIALIZED: 'INITIALIZED',
		TEST_LETTER: 'TEST_LETTER',
		OUT_OF_TIME: 'OUT_OF_TIME'
	};



	/* Functions */
	//Events
	function startNewGame(event) {// START_NEW_GAME
		$scope.$emit(NAMESPACE + EVENTS.GET_NEW_QUOTE);
	}
	function getNewQuote(event) {// GET_NEW_QUOTE
		$http({
			method: CONFIG.HTTP_METHOD,
			url: CONFIG.QUOTE_ENDPOINT
		})
		.error(function(data) { $scope.$emit(NAMESPACE + EVENTS.ERROR_GETTING_QUOTE, [data]); })
		.success(function(data) { $scope.$emit(NAMESPACE + EVENTS.GOT_NEW_QUOTE, [data]); })
		.then(setupTimer)
		;
	}
	function gotNewQuote(event, quoteData) {// GOT_NEW_QUOTE
		var sanitizedQuoteData = normalizeQuoteData(quoteData);
		if (!sanitizedQuoteData) {
			$scope.$emit(NAMESPACE + EVENTS.ERROR_GETTING_QUOTE, [quoteData]);
			return;
		}

		createQuoteModel(sanitizedQuoteData.quote);
	}
	function errorGettingQuote(event, errorData) {// ERROR_GETTING_QUOTE
		console.log(errorData);
		throw 'game.js: broken quote';
	}
	function setupTimer() {
		var countdownTick = function() {
			$scope.status.timeRemaining -= CONFIG.INTERVAL_LENGTH;
			if (!$scope.status.timeRemaining) $scope.$emit(NAMESPACE + EVENTS.OUT_OF_TIME);
		};

		$scope.status = {
			timeRemaining: CONFIG.STARTING_TIME,
			score: CONFIG.NUMBERS.ZERO
		};

		countdownTimer = $interval(countdownTick, CONFIG.INTERVAL_LENGTH);
	}
	function outOfTime(event) { //OUT_OF_TIME
		$interval.cancel(countdownTimer);
		countdownTimer = undefined;

		//
	}
	function testLetter(event, letterMap) {
		if ($scope.textBoxes[letterMap.KEY].length === CONFIG.NUMBERS.ZERO) return;

		console.log(letterMap.LETTER === $scope.textBoxes[letterMap.KEY].toUpperCase());
	}
	//Utility
	function normalizeQuoteData(quoteData) {
		var translationKey = CONFIG.QUOTE_SOURCE_MAP[CONFIG.QUOTE_ENDPOINT],
			normalizedData = false
		;

		//Testing high-speed conditionals: http://jsperf.com/switch-if-else/33
		translationKey === CONFIG.QUOTE_SOURCE_MAPS.ICNDB && (normalizedData = normalize_icndb(quoteData));

		return normalizedData;
	}
	function normalize_icndb(quoteData) {
		quoteData = quoteData[0];
		var htmlDecoder = document.createElement('div');
		htmlDecoder.innerHTML = quoteData.value.joke;
		var joke = htmlDecoder.firstChild.nodeValue;
		return quoteData.type !== 'success' || !joke || joke.length === 0 ? false : { 'id': quoteData.value.id, 'quote': joke };
	}
	function getKeyFromMap(map, letter) {
		var ALPHABET = CONFIG.ALPHABET,
			NUM_OF_LETTERS = CONFIG.LETTERS_IN_ALPHABET,
			INVALID_INDEX = CONFIG.NUMBERS.INVALID_INDEX,
			alreadyTriedLetters = ''
		;
		while(!map[letter] && alreadyTriedLetters.length < NUM_OF_LETTERS) {
			var tryLetter = ALPHABET[Math.floor(Math.random() * NUM_OF_LETTERS)];
			if (blockedKeys.indexOf(tryLetter) === INVALID_INDEX && alreadyTriedLetters.indexOf(tryLetter) === INVALID_INDEX && letter !== tryLetter) {
				blockedKeys += tryLetter;
				map[letter] = tryLetter;
			}
			alreadyTriedLetters += tryLetter;
		}
		return map[letter];
	}
	function createQuoteModel(quote) {
		var rawWordArray = quote.toUpperCase().split(CONFIG.STRINGS.SPACE),
			rawWordArrayIterator = rawWordArray.length - CONFIG.NUMBERS.ONE,
			wordArray = [],
			LETTER_REGEX = CONFIG.LETTER_REGEX,
			solutionMapping = {}
		;
		blockedKeys = '';

		do {
			var word = rawWordArray[rawWordArrayIterator],
				rawLetterArray = word.split(CONFIG.STRINGS.EMPTY),
				rawLetterArrayIterator = rawLetterArray.length - CONFIG.NUMBERS.ONE,
				currentLetterArray = []
			;

			do {
				var letter = rawLetterArray[rawLetterArrayIterator],
					validLetter = LETTER_REGEX.test(letter)
				;
				currentLetterArray.push({
					LETTER: letter,
					VALID: validLetter,
					DISPLAY: validLetter ? CONFIG.STRINGS.EMPTY : letter,
					KEY: validLetter ? getKeyFromMap(solutionMapping, letter, blockedKeys) : null
				});
			} while(rawLetterArrayIterator--);


			wordArray.push({ LETTERS: currentLetterArray.reverse() });
		} while(rawWordArrayIterator--);

		$scope.quote = {
			QUOTE: quote,
			WORDS: wordArray.reverse()
		};
	}



	/* Listeners */
	$scope.$on(NAMESPACE + EVENTS.START_NEW_GAME, startNewGame);
	$scope.$on(NAMESPACE + EVENTS.GET_NEW_QUOTE, getNewQuote);
	$scope.$on(NAMESPACE + EVENTS.GOT_NEW_QUOTE, gotNewQuote);
	$scope.$on(NAMESPACE + EVENTS.ERROR_GETTING_QUOTE, errorGettingQuote);
	$scope.$on(NAMESPACE + EVENTS.TEST_LETTER, testLetter);
	$scope.$on(NAMESPACE + EVENTS.OUT_OF_TIME, outOfTime);
	//Interface
	$scope.testLetter = function(letterMap) {
		$scope.$emit(NAMESPACE + EVENTS.TEST_LETTER, letterMap);
	};



	/* Initialize */
	function init() {
		$scope.$emit(NAMESPACE + EVENTS.INITIALIZED);
		$scope.$emit(NAMESPACE + EVENTS.START_NEW_GAME);
	}
	init();
}



GameCtrl.$inject = [
	'$scope',
	'config',
	'$http',
	'$interval'
];
app.controller('GameCtrl', GameCtrl);



})(angular, app);
