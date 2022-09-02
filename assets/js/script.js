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

var questionNumber = -1; // this will keep track of which question we are on

// good for helping get the current question without reusing code
function getCurrentQuestion() {
    if(questionNumber < 0 || questionNumber > questions.length - 1) {
        return undefined;
    }
    return questions[questionNumber];
}

var mainBodyContent = document.querySelector("main"); // main body content
var quizHeader = document.querySelector("#quiz-header"); // header, will reuse to prompt each question
var quizDescription = document.querySelector("#quiz-description"); // description, will remove when quiz starts
var startQuizButton = document.querySelector("#start-quiz-button"); // start quiz button, will start quiz

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
buttonA.id = "a";
buttonB.id = "b";
buttonC.id = "c";
buttonD.id = "d";

// array of buttons is good for iterating
var buttons = [buttonA, buttonB, buttonC, buttonD];

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
        // set the text content of the button to the property matching the button element's ID
        button.textContent = question[button.id];
    });

    return true; // return true if there was a next question loaded
}

function endQuiz() {
    questionNumber = -1; // reset question number
    shuffleQuestions(); // shuffle questions again
    optionList.remove(); // remove option list

    // Display that quiz is done
    quizHeader.textContent = "All done!";
    quizDescription.textContent = "Your final score is: ";
    mainBodyContent.append(quizDescription);

    // TODO implement score
    // TODO implement high scores list
    // TODO implement replay loop
}

// TODO
// WHEN the button is pressed
// THEN display the next question, as well as if the answer was right or wrong
// WHEN the quiz ends
// THEN display a screen for the user to input their name to go on a high score list
function onOptionButtonPress(event) {
    // quiz ends if return is false
    if(!loadNextQuestion()) {
        endQuiz()
    } else {
    }
}

// iterate across each button and setup listener and DOM stuff
buttons.forEach((button) => {
    // add listener for if it's clicked
    button.addEventListener('click', onOptionButtonPress);
    // create list item and span for label
    var listItem = document.createElement("li");
    var labelSpan = document.createElement("span");
    labelSpan.textContent = button.id.toUpperCase() + ": ";
    // append span to list item
    listItem.appendChild(labelSpan);
    // then append button
    listItem.appendChild(button);
    // finally, put it on the list
    optionList.appendChild(listItem);
});

// add event listener to start the quiz
startQuizButton.addEventListener('click', function(event) {
    quizDescription.remove(); // remove the description
    startQuizButton.remove(); // remove the start quiz button
    mainBodyContent.appendChild(optionList); // append the list, this will now be modifyable
    loadNextQuestion();
});
