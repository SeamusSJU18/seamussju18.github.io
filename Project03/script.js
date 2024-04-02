document.addEventListener('DOMContentLoaded', () => {
    fetchQuizData()
        .then(() => showEnterNameView())
        .catch(error => console.error('Error fetching quiz data:', error));
});

let playerName = "";
let currentQuizIndex = -1;
let currentQuestionIndex = 0;
let totalQuestionsAnswered = 0;
let correctAnswers = 0;
let startTime;
let quizData;

async function fetchQuizData() {
    try {
        const response = await fetch('https://my-json-server.typicode.com/SeamusSJU18/seamussju18.github.io/db');
        quizData = await response.json();
        
        quizData.Quiz.forEach(quiz => {
            quiz.questions.forEach(question => {
                question.isMultipleChoice = question.type === 'multipleChoice';
                question.isImageSelection = question.type === 'imageSelection';
                question.isNarrative = question.type === 'narrative';
            });
        });
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}
async function showEnterNameView() {
    const enterNameTemplate = Handlebars.compile(document.querySelector(#enter_name).innerHTML);
    document.querySelector(#app_widget).innerHTML = enterNameTemplate();

    const startQuizButtons = document.querySelectorAll('.start-quiz-btn');

    startQuizButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            playerName = document.querySelector(#name).value.trim();
            if (playerName === '') {
                alert('Please enter your name');
                return;
            }
            currentQuizIndex = parseInt(this.getAttribute('data-quiz-index'));
            startQuiz(currentQuizIndex);
        });
    });
    return false;
}
async function startQuiz(selectedQuizIndex) {
    currentQuizIndex = selectedQuizIndex; 
    const selectedQuiz = quizData.Quiz[selectedQuizIndex];
    document.querySelector(#app_widget).innerHTML = `<h3>${selectedQuiz.name}</h3>`;

    startTime = Date.now();

    renderQuestion();
}
function renderQuestion() {
    
    if (currentQuestionIndex < quizData.Quiz[currentQuizIndex].questions.length) {
        
        const question = quizData.Quiz[currentQuizIndex].questions[currentQuestionIndex];

       
        const questionTemplate = Handlebars.compile(document.querySelector(#quiz-question-template).innerHTML);
        
        
        document.querySelector(#app_widget).innerHTML = questionTemplate({
            questionIndex: currentQuestionIndex + 1,
            totalQuestions: quizData.Quiz[currentQuizIndex].questions.length,
            question: question,
        });

        
        document.querySelector(#submitAnswerBtn).addEventListener('click', function() {
            
            submitAnswer();
        });

    } else {
       
        showScoreboard();
    }
}
function submitAnswer() {
    const question = quizData.Quiz[currentQuizIndex].questions[currentQuestionIndex];

    let userAnswer;
    if (question.isMultipleChoice || question.isImageSelection) {
        const selectedOption = document.querySelector('input[name="questionAnswer"]:checked');
        userAnswer = selectedOption ? selectedOption.value : null;
    } else if (question.isNarrative) {
        userAnswer = document.querySelector(narrativeAnswer).value;
    }

    let feedbackMessage;
    if (userAnswer && userAnswer === question.answer) {
        correctAnswers++;
        totalQuestionsAnswered++;
        feedbackMessage = "Correct! Nice job!"; 
    } else {
        totalQuestionsAnswered++;
        feedbackMessage = `Wrong. The correct answer is: ${question.answer}.`; 
    }

    
    document.querySelector(#app_widget).innerHTML = `<div class='feedback'>${feedbackMessage}</div>`;

    
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.Quiz[currentQuizIndex].questions.length) {
            renderQuestion();
        } else {
            showScoreboard();
        }
    }, 1000); 
}
function showScoreboard() {
    const score = ((correctAnswers / totalQuestionsAnswered) * 100);
    const scoreboardTemplate = Handlebars.compile(document.querySelector(#scoreboard-template).innerHTML);
    document.querySelctor(app_widget).innerHTML = scoreboardTemplate({
        playerName: playerName,
        correctAnswers: correctAnswers,
        score: score
    });
}
