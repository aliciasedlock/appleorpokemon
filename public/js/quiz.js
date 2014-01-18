$(function () {

	/** Variables
	 ** =============
	 ** Get this shit set up dawg.
	**/
	var model = new Quiz();
	var root = $('#quizContainer');
	var quizTemplate = $('#quizTemplate').html();
	var progressTemplate = $('#progressTemplate').html();
	var questionTemplate  = $('#questionTemplate').html();
	var answerTemplate = $('#answerTemplate').html();
	var resultsTemplate = $('#resultsTemplate').html();

	// Put the questions in a random order so it's not the same for everyone
	questions = model.shuffleQuestions(questions);

	/** Event Listeners
	 ** =============
	 ** Handle all that ish that's yellin'
	**/

	$(document).on('click', '#playMusic', function (event) {
		event.preventDefault();

		if (document.getElementById('ytPlayer') === null) {
			$(event.target).addClass('hidden');
			$('#stopMusic').removeClass('hidden');
			$('.audio').append('<iframe id="ytPlayer" style="display: none" width="420" height="315" src="http://www.youtube.com/embed/JuYeHPFR3f0?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>')
		}

	});

	$(document).on('click', '#stopMusic', function (event) {
		event.preventDefault();

		if (document.getElementById('ytPlayer') != null) {
			$(event.target).addClass('hidden');
			$('#playMusic').removeClass('hidden');
			$('.audio iframe').remove();
		}

	});

	// Listen for when a user selects 'Start Quiz' button
	// And start the quiz
	$(document).on('click', '#startQuiz', function () {
		var progressData = {
			currentlyOn: 1,
			total: questions.length,
			correctAnswers: model.howManyCorrectAnswers()
		}

		root.html(quizTemplate);
		updateProgress(progressData);
		updateQuestion();
	});

	// When a user selects an answer option, check if they're choice was correct
	$(document).on('click', 'button.answer', function (event) {
		model.checkAnswer(event.target.value);
	});

	// They know they're right or wrong. Let them move on.
	$(document).on('click', '#continueQuiz', function () {
		updateProgress(model.getProgress());
		updateQuestion();
	});

	// Quiz is done, time to let them know how wrong they were
	$(document).on('click', '#showResults', function () {
		showResults();
	});

	// When the model is done checking the answer, show the user the result
	model.on('answerChecked', function (answerData) {
		showAnswer(answerData);
	});

	/** Functions
	 ** =============
	 ** For when we gotta do some other ish
	 ** Mainly for template updates
	**/

	var showAnswer = function (answerData) {
		$('#quizQuestion').html($.el(answerTemplate, answerData));
		$('button.answer').hide();

		if (!model.isLastQuestion())
			$('#continueQuiz').show();
		else
			$('#showResults').show();
	}

	var showResults = function () {
		var results = model.getFinalResults();
		root.html($.el(resultsTemplate, results));
	}

	var updateProgress = function (progressData) {
		$('#progress').html($.el(progressTemplate, progressData));
	}

	var updateQuestion = function () {

		var questionData = model.getNextQuestion();

		$('#quizQuestion').html($.el(questionTemplate, questionData));
		$('button.answer').show();
		$('#continueQuiz').hide();
	}


});