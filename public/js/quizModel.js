function Quiz() {

	var self = $.observable(this);
	var answers = [];
	var storage = Storage('answers');

	storage.reset();

	self.on('answerChecked', function () {
		storage.put(answers);
	});

	self.checkAnswer = function (answer) {

		var answerIndex = answers.length;
		var answerToCheck = questions[answerIndex];
		var wasCorrect = answer === answerToCheck.type;

		answers[answerIndex] = {
			name: answerToCheck.name,
			type: answerToCheck.type,
			correct: wasCorrect,
			response: wasCorrect ? 'Correct!' : 'Wrong!'
		};

		self.emit('answerChecked', answers[answerIndex]);
	};

	self.getNextQuestion = function () {
		return questions[answers.length];
	};

	self.howManyCorrectAnswers = function () {
		var correctAnswers = 0;

		for (var i = 0; i < answers.length; i++) {
			if (answers[i].correct)
				correctAnswers++;
		}

		return correctAnswers;
	};

	self.isLastQuestion = function () {
		return (answers.length === questions.length)
	};

	self.getProgress = function () {
		var progress = {
			currentlyOn: answers.length + 1,
			total: questions.length,
			correctAnswers: self.howManyCorrectAnswers()
		}

		return progress;
	}

	self.getFinalResults = function () {

		var totalCorrect = self.howManyCorrectAnswers();
		var resultMsg = resultsMessages[1];
		var finalResult;

		if (totalCorrect === 0) {
			resultMsg = resultsMessages[0];
		}

		if (totalCorrect === questions.length) {
			resultMsg = resultsMessages[2];
		}

		finalResult = {
			totalCorrect: totalCorrect,
			totalQuestions: questions.length,
			msg: resultMsg
		}

		return finalResult;

	}

	self.shuffleQuestions = function (array) {

		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

}

function Storage(key) {
   var store = window.localStorage;

   return {
      get: function() {
         return JSON.parse(store[key] || '{}')
      },

      put: function(data) {
         store[key] = JSON.stringify(data)
      },

      reset: function () {
      	store.clear();
      }
   }
}