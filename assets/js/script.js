var quizButtonIDStart = "quiz-button"; // all quiz buttons have an ID that starts with this
var choiceAttribute = "choice"; // this will be the name of the custom attribute that holds the choice of the option

var mainBodyContent = document.querySelector("main"); // main body content
var quizHeader = document.querySelector("#quiz-header"); // header, will reuse to prompt each question
var quizDescription = document.querySelector("#quiz-description"); // description, will remove when quiz starts
var startQuizButton = document.querySelector("#" + quizButtonIDStart); // start quiz button, will start quiz
var timeSpan = document.querySelector("#time"); // time span, control to modify displayed time left to complete quiz
var questionNumber = -1; // this will keep track of which question we are on
var timeLeft = 0; // start at 0
var timerInterval = undefined; // keep this undefined when timer is not running
var resultInterval = undefined; // keep this undefined when span is not appended

function alignText(element, type) {
    element.setAttribute("style", "text-align: " + type + ";");
}

// keep this process of updating time as a function to prevent any misbehavior between various elements/variables
function updateTime(skipRemaining) {
    // if true, update time left to 0 before updating span
    if(skipRemaining) {
        timeLeft = 0;
    }

    // update span
    timeSpan.textContent = timeLeft.toString();
}

/*
Questions will be js objects with the following format:
{
    prompt: <string with question prompt>,
    a: <string with option a>,
    b: <string with option b>,
    c: <string with option c>,
    d: <string with option d>,
    answer: <string with either A, B, C, or D>
}
*/
// Because it couldn't be easy, guess it has to be messy 🙄
var questions = [
    {
        prompt: "Commonly used data types DO NOT include:",
        a: "strings",
        b: "booleans",
        c: "alerts",
        d: "numbers",
        answer: "c"
    },
    {
        prompt: "The condition in an if/else statement is enclosed within ____.",
        a: "quotes",
        b: "curly braces",
        c: "parenthesis",
        d: "square brackets",
        answer: "c"
    },
    {
        prompt: "Arrays in JavaScript can be used to store ____.",
        a: "numbers and strings",
        b: "other arrays",
        c: "booleans",
        d: "all of the above",
        answer: "d"
    },
    {
        prompt: "Strings values must be enclosed within ____ when assigned to variables.",
        a: "commas",
        b: "curly braces",
        c: "quotes",
        d: "parenthesis",
        answer: "c"
    },
    {
        prompt: "A very useful tool used during development and debugging for printing content to the debugger is:",
        a: "JavaScript",
        b: "terminal/bash",
        c: "for loops",
        d: "console.log",
        answer: "d"
    }
];

// shuffle this array so that it's random what order the questions are given
function shuffleQuestions() {
    for(var i = questions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var qai = questions[i];
        questions[i] = questions[j];
        questions[j] = qai;
    }
}

shuffleQuestions();

// good for helping get the current question without reusing code
function getCurrentQuestion() {
    if(questionNumber < 0 || questionNumber > questions.length - 1) {
        return undefined;
    }
    return questions[questionNumber];
}

// save default quiz header and description text to reload later
var defaultQuizHeaderText = quizHeader.textContent;
var defaultQuizDescriptionText = quizDescription.textContent;

// create option element layout ahead of time
var optionList = document.createElement("ol");
// load and setup buttons in advance
var buttonA = document.createElement("button");
var buttonB = document.createElement("button");
var buttonC = document.createElement("button");
var buttonD = document.createElement("button");
// set ids of buttons to the option they represent.
// this will help us later when determining if it's the correct answer, as we can compare it to the one in the question json object
buttonA.id = quizButtonIDStart + "-a";
buttonB.id = quizButtonIDStart + "-b";
buttonC.id = quizButtonIDStart + "-c";
buttonD.id = quizButtonIDStart + "-d";

// array of buttons is good for iterating
var buttons = [buttonA, buttonB, buttonC, buttonD];

// create a span for telling the user if their last answer was correct or incorrect, we will reuse this as necessary.
var questionResultSpan = document.createElement("span");
questionResultSpan.id = "question-result";

function displayQuestionResultSpan(correct, endQuiz) {
    questionResultSpan.textContent = correct? "Correct!" : "Wrong";

    if(resultInterval !== undefined) {
        // if the result interval is not undefined we currently have an interval handling the span disappearing automatically
        // as a result, we need to clear the interval prematurally as we want to re-use the span that is already appended.
        clearInterval(resultInterval);
        // if it's the end of the quiz, we need to remove and reappend the result span or else it will appear improperly on the screen
        if(endQuiz) {
            questionResultSpan.remove();
            mainBodyContent.append(questionResultSpan);
        }
    } else {
        // otherwise we append the span, if the interval is undefined that means the last interval handling the span disappearing
        // automatically ran, and thus the span needs to be re-appended.
        mainBodyContent.append(questionResultSpan);
    }

    resultInterval = setInterval(() => {
        questionResultSpan.remove();
        clearInterval(resultInterval);
        resultInterval = undefined;
    }, 1500); // 1.5 seconds
}

function loadNextQuestion() {
    questionNumber++; // increment current question number before we load the question so we get the next one
    var question = getCurrentQuestion();

    // if the current question is undefined we've reached the end of the quiz and so we should return false
    if(question === undefined) {
        return false;
    }

    // we have a next question, continue with loading

    // change the quiz header to the question prompt
    quizHeader.textContent = question.prompt;

    buttons.forEach((button) => {
        // get the choice attribute
        var choice = button.getAttribute(choiceAttribute);
        // set the text content of the button to the property matching the button element's choice attribute
        // format should be like:
        // <choice>: <choice here>
        button.textContent = choice.toUpperCase() + ": " + question[choice];
    });

    return true; // return true if there was a next question loaded
}

function endQuiz(timeOut) {
    clearInterval(timerInterval); // clear the interval for the timer
    updateTime(timeOut); // update the time while setting displayed timer to zero
    questionNumber = -1; // reset question number
    shuffleQuestions(); // shuffle questions again
    optionList.remove(); // remove option list

    // Display that quiz is done
    quizHeader.textContent = "All done!";
    alignText(quizHeader, "left"); // should already be left aligned but just in case.
    quizDescription.textContent = "Your final score is: " + timeLeft;
    alignText(quizDescription, "left"); // align left
    mainBodyContent.append(quizDescription);

    // End time


    // TODO implement score
    // TODO implement high scores list
    // TODO implement replay loop
}

function resetDefaultPageText() {
    quizHeader.textContent = defaultQuizHeaderText;
    alignText(quizHeader, "center");
    quizDescription.textContent = defaultQuizDescriptionText;
    alignText(quizDescription, "center");

    // do not reappend elements, let other places do that
}

// TODO
// WHEN the quiz ends
// THEN display a screen for the user to input their name to go on a high score list
function onOptionButtonPress(event) {
    var buttonId = event.target.getAttribute(choiceAttribute);
    var correct = buttonId === questions[questionNumber].answer;
    // if the answer was incorrect, we need to deduct remaining time and possibly end the quiz
    if(!correct) {
        // first, deduct 15 seconds for an incorrect answer, or if there is less than 15 seconds left set to 0;
        timeLeft = Math.max(timeLeft - 15, 0);
        // next, check if it's greater than 0
        if(timeLeft > 0) {
            // if it is, we update the time remaining on the page without ending the quiz
            updateTime(false);
        } else {
            // otherwise, we end the quiz: the deduction resulted in time running out
            endQuiz(true);
            displayQuestionResultSpan(correct, true);
            return; // we can return here
        }
    }

    // if we try to load another question but none remain, that was the last question
    if(!loadNextQuestion()) {
        endQuiz(false);
        displayQuestionResultSpan(correct, true);
        return;
    }

    // TODO display whether the last answer was correct or incorrect
    displayQuestionResultSpan(correct, false);
}

// iterate across each button and setup listener and DOM stuff
buttons.forEach((button) => {
    // add listener for if it's clicked
    button.addEventListener('click', onOptionButtonPress);
    // create list item and span for label
    var listItem = document.createElement("li");

    // var labelSpan = document.createElement("span");

    // last char of id is choice
    var choice = button.id.charAt(button.id.length - 1);
    // set choice attribute to the letter of the choice
    button.setAttribute(choiceAttribute, choice);

    // set the span label text to the letter of the choice
    // labelSpan.textContent = choice.toUpperCase() + ": ";

    // append span to list item
    // listItem.appendChild(labelSpan);

    // then append button
    listItem.appendChild(button);
    // finally, put it on the list
    optionList.appendChild(listItem);
});

// add event listener to start the quiz
startQuizButton.addEventListener('click', function(event) {
    // preload first question
    loadNextQuestion();

    quizDescription.remove(); // remove the description
    startQuizButton.remove(); // remove the start quiz button
    alignText(quizHeader, "left");

     // append the list, this will now be modifyable
    mainBodyContent.appendChild(optionList);
    // start timer with 75 seconds on the clock
    timeLeft = 75;
    // update the time on the page
    updateTime(false);
    // start an interval
    timerInterval = setInterval(() => {
        // deincrement one second;
        timeLeft--;
        // if time runs out -> clear interval and skip to end of quiz
        if(timeLeft <= 0) {
            endQuiz(); // this will also update the time
        } else {
            // just update time to reflect the interval running
            updateTime(false);
        }
    }, 1000); // ms (runs once every second)
});
