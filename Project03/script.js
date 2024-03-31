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
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

async function showEnterNameView() {
    const enterNameTemplate = Handlebars.compile(document.getElementById('enter_name').innerHTML);
    document.getElementById('app_widget').innerHTML = enterNameTemplate();

    const startQuizButtons = document.querySelectorAll('.start-quiz-btn');

    startQuizButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            playerName = document.getElementById('name').value.trim();
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
    document.getElementById('app_widget').innerHTML = `<h3>${selectedQuiz.name}</h3>`;

    startTime = Date.now();

    renderQuestion();
}
function renderQuestion() {
    
    if (currentQuestionIndex < quizData.Quiz[currentQuizIndex].questions.length) {
        
        const question = quizData.Quiz[currentQuizIndex].questions[currentQuestionIndex];

       
        const questionTemplate = Handlebars.compile(document.getElementById('quiz-question-template').innerHTML);
        
        
        document.getElementById('app_widget').innerHTML = questionTemplate({
            questionIndex: currentQuestionIndex + 1,
            totalQuestions: quizData.Quiz[currentQuizIndex].questions.length,
            question: question,
        });

        
        document.getElementById('submitAnswerBtn').addEventListener('click', function() {
            
            submitAnswer();
        });

    } else {
       
        showScoreboard();
    }
}
function submitAnswer() {
    const question = quizData.Quiz[currentQuizIndex].questions[currentQuestionIndex - 1];

    let userAnswer;
    if (question.isMultipleChoice || question.isImageSelection) {
        // For multiple choice or image selection, find the checked radio button
        const selectedOption = document.querySelector('input[name="questionAnswer"]:checked');
        userAnswer = selectedOption ? selectedOption.value : null;
    } else if (question.isNarrative) {
        // For narrative, get the text from the textarea
        userAnswer = document.getElementById('narrativeAnswer').value;
    }

    if (userAnswer && userAnswer === question.answer) {
        correctAnswers++; 
    } else {
        
    }
}
async function displayFeedback(userAnswers) {
    const quiz = quizData.Quiz[currentQuizIndex]; // Access quiz data from quizData
    const feedbackTemplate = Handlebars.compile(document.getElementById('feedback-template').innerHTML);
    let correct = 0;
    userAnswers.forEach((answer, index) => {
        const question = quiz.questions[index];
        if (answer === question.answer) {
            correct++;
        }
    });
    correctAnswers += correct;
    totalQuestionsAnswered += quiz.questions.length;
    document.getElementById('app_widget').innerHTML = feedbackTemplate({ correct: correct });
    if (correct < quiz.questions.length) {
        const correctAnswer = quiz.questions[currentQuestionIndex].answer;
        document.querySelector('.card-text').textContent += ` The correct answer is: ${correctAnswer}.`;
        document.getElementById('gotItBtn').addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quiz.questions.length) {
                renderQuestion();
            } else {
                showScoreboard();
            }
        });
    } else {
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quiz.questions.length) {
                renderQuestion();
            } else {
                showScoreboard();
            }
        }, 1000);
    }
}
}

function showScoreboard() {
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalScore = ((correctAnswers / totalQuestionsAnswered) * 100).toFixed(2);
    const scoreboardTemplate = Handlebars.compile(document.getElementById('scoreboard-template').innerHTML);
    document.getElementById('app_widget').innerHTML = scoreboardTemplate({
        playerName: playerName,
        questionsAnswered: totalQuestionsAnswered,
        elapsedTime: elapsedTime,
        totalScore: totalScore
    });
}
