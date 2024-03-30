
document.addEventListener('DOMContentLoaded', () => {
    showEnterNameView();
});

let playerName = "";
let currentQuizIndex = -1;
let currentQuestionIndex = 0;
let totalQuestionsAnswered = 0;
let correctAnswers = 0;
let startTime;

async function fetchQuizData() {
    try {
        const response = await fetch('https://my-json-server.typicode.com/SeamusSJU18/seamussju18.github.io/db');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    }
}

function showEnterNameView() {
    const enterNameTemplate = Handlebars.compile(document.getElementById('enter_name').innerHTML);
    document.getElementById('app_widget').innerHTML = enterNameTemplate();
    document.getElementById('name-form').addEventListener('submit', (event) => {
        event.preventDefault();
        playerName = event.target.elements['name'].value;
        showQuizSelectionView();
        return false;
    });
}
async function showQuizSelectionView() {
    const quizData = await fetchQuizData();
    const quizSelectionTemplate = Handlebars.compile(document.getElementById('quiz_selection').innerHTML);
    document.getElementById('app_widget').innerHTML = quizSelectionTemplate({ quizzes: quizData });
    document.querySelectorAll('.start-quiz-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentQuizIndex = index;
            startQuiz();
        });
    });
}

async function startQuiz() {
    const quizData = await fetchQuizData();
    const quiz = quizData[currentQuizIndex];
    const quizTemplate = Handlebars.compile(document.getElementById('quiz-template').innerHTML);
    document.getElementById('app_widget').innerHTML = quizTemplate({ quiz: quiz });
    document.getElementById('submitAnswersBtn').addEventListener('click', submitAnswers);
    startTime = Date.now();
}

function submitAnswers() {
    const userAnswers = [];
    const quiz = quizData[currentQuizIndex];
    quiz.questions.forEach((question, index) => {
        const answer = document.querySelector(`input[name="answer${index + 1}"]:checked`);
        if (answer) {
            userAnswers.push(answer.value);
        }
    });
    displayFeedback(userAnswers);
}

async function displayFeedback(userAnswers) {
    const quiz = quizData[currentQuizIndex];
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
