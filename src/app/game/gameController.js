/*
	TODO:
		Timer
		Score
		Auto-tab text boxes to next available
		Auto width non-word chars
		Hints
*/
define([], function()
{
	/* Main */
	function gameController($scope, $http, $timeout, $interval, magic) {
		/* Config */
		var MAGIC = angular.extend({
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
		}, magic);



		/* Variables */
		var NAMESPACE = MAGIC.NAMESPACE,
			blockedKeys = '',
			countdownTimer,
			letterArray = []
		;
		$scope.quote = {};
		$scope.textBoxes = {};
		$scope.status = {
			timeRemaining: MAGIC.STARTING_TIME,
			score: MAGIC.NUMBERS.ZERO
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
				method: MAGIC.HTTP_METHOD,
				url: MAGIC.QUOTE_ENDPOINT
			})
			.error(function(data) {
				$scope.$emit(NAMESPACE + EVENTS.ERROR_GETTING_QUOTE, [data]);
			})
			.success(function(data) {
				$scope.$emit(NAMESPACE + EVENTS.GOT_NEW_QUOTE, [data]);
			})
			.then(setupTimer)
			;
		}
		function gotNewQuote(event, quoteData) {// GOT_NEW_QUOTE
			var sanitizedQuoteData = normalizeQuoteData(quoteData);
			if (sanitizedQuoteData) {
				createQuoteModel(sanitizedQuoteData.quote);
			}
			else {
				$scope.$emit(NAMESPACE + EVENTS.ERROR_GETTING_QUOTE, [quoteData]);
			}
		}
		function errorGettingQuote(event, errorData) {// ERROR_GETTING_QUOTE
			console.log(errorData);
			throw 'game.js: broken quote';
		}
		function setupTimer() {
			var countdownTick = function() {
				$scope.status.timeRemaining -= MAGIC.INTERVAL_LENGTH;
				if (!$scope.status.timeRemaining) {
					$scope.$emit(NAMESPACE + EVENTS.OUT_OF_TIME);
				}
			};

			$scope.status = {
				timeRemaining: MAGIC.STARTING_TIME,
				score: MAGIC.NUMBERS.ZERO
			};

			countdownTimer = $interval(countdownTick, MAGIC.INTERVAL_LENGTH);
		}
		function outOfTime(event) { //OUT_OF_TIME
			$interval.cancel(countdownTimer);
			countdownTimer = undefined;

			//
		}
		function testLetter($event, letterMap) {
			if ($scope.textBoxes[letterMap.KEY].letter.length === MAGIC.NUMBERS.ZERO) {
				return;
			}
			// console.log(letterMap, $scope.textBoxes);
			if (letterMap.LETTER === $scope.textBoxes[letterMap.KEY].letter.toUpperCase()) {
				$scope.textBoxes[letterMap.KEY].SOLVED = true;
				var $letterContainer = $(event.target).closest('.letterContainer'),
					$nextLetterContainer = $letterContainer.next('.letterContainer'),
					$nextLetter = $nextLetterContainer.find('.letter:not(.invalid) input.guess:enabled'),
					$tryLetter,
					tryKey = $nextLetter.length === 0 ? false : angular.element($nextLetter).scope().letter.KEY
				;
				// console.log(tryKey, $scope.textBoxes[tryKey], event.target);
				if (tryKey && $scope.textBoxes[tryKey] && $scope.textBoxes[tryKey].SOLVED) {
					$nextLetter.length = 0;
				}
				while ($nextLetter.length === 0) {
					if ($nextLetterContainer.length === 0) {
						$nextLetterContainer = $letterContainer.parent().next().find('.letterContainer').first();
						if ($nextLetterContainer.length === 0) {
							break; //Probably End of puzzle
						}
					}
					else {
						$nextLetterContainer = $nextLetterContainer.next();
					}
					$tryLetter = $nextLetterContainer.find('.letter:not(.invalid) input.guess:enabled');
					if ($tryLetter.length === 0) console.log($tryLetter);
					tryKey = angular.element($tryLetter).scope().letter.KEY;
					if (!$scope.textBoxes[tryKey] || !$scope.textBoxes[tryKey].SOLVED) {
						// console.log($scope.textBoxes, tryKey, $scope.textBoxes[tryKey]);
						$nextLetter = $tryLetter;
					}
				}
				$timeout(function() {
					$nextLetter.focus();
				}, 0, false);
				if ($nextLetter.length === 0) {
					//
				}
			}
		}
		//Utility
		function normalizeQuoteData(quoteData) {
			var translationKey = MAGIC.QUOTE_SOURCE_MAP[MAGIC.QUOTE_ENDPOINT],
				normalizedData = false
			;

			//Testing high-speed conditionals: http://jsperf.com/switch-if-else/33
			translationKey === MAGIC.QUOTE_SOURCE_MAPS.ICNDB && (normalizedData = normalize_icndb(quoteData));

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
			var ALPHABET = MAGIC.ALPHABET,
				NUM_OF_LETTERS = MAGIC.LETTERS_IN_ALPHABET,
				INVALID_INDEX = MAGIC.NUMBERS.INVALID_INDEX,
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
			var rawWords = quote.toUpperCase().split(MAGIC.STRINGS.SPACE),
				words = [],
				LETTER_REGEX = MAGIC.LETTER_REGEX,
				solutionMapping = {},
				letterIndex = MAGIC.NUMBERS.INVALID_INDEX
			;
			blockedKeys = '';
			letterArray = [];

			rawWords.forEach(function(word) {
				var rawLetters = word.split(MAGIC.STRINGS.EMPTY),
					letters = []
				;

				rawLetters.forEach(function(letter) {
					var validLetter = LETTER_REGEX.test(letter),
						letterObj = {
							LETTER: letter,
							VALID: validLetter,
							DISPLAY: validLetter ? MAGIC.STRINGS.EMPTY : letter,
							KEY: validLetter ? getKeyFromMap(solutionMapping, letter, blockedKeys) : null,
							INDEX: letterIndex++
						}
					;
					letters.push(letterObj);
					letterArray.push(letterObj);
				});


				words.push({
					LETTERS: letters
				});
			});

			$scope.quote = {
				QUOTE: quote,
				WORDS: words
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

	gameController.$inject = [
		'$scope',
		'$http',
		'$timeout',
		'$interval',
		'magic'
	];
	return gameController;
});
