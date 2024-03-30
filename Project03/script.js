document.addEventListener('DOMContentLoaded', () => {
    const appWidget = document.getElementById('app_widget');


    renderEnterName();

    async function renderEnterName() {
        const enterNameTemplateSource = document.getElementById('enter_name').innerHTML;
        const enterNameTemplate = Handlebars.compile(enterNameTemplateSource);
        appWidget.innerHTML = enterNameTemplate();

        const nameForm = document.getElementById('name-form');
        nameForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const playerName = document.getElementById('name').value.trim();
            if (playerName !== '') {
                const selectedQuiz = await fetchQuiz('https://my-json-server.typicode.com/SeamusSJU18/seamussju18.github.io');
                renderQuiz(selectedQuiz, playerName);
            } else {
                alert('Please enter your name.');
            }
        });
    }

    async function fetchQuiz(baseUrl) {
        try {
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch quiz');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching quiz:', error);
        }
    }

    async function renderQuiz(quiz, playerName) {
        const quizTemplateSource = document.getElementById('quiz-template').innerHTML;
        const quizTemplate = Handlebars.compile(quizTemplateSource);
        appWidget.innerHTML = quizTemplate({ quiz });

        const submitAnswersBtn = document.getElementById('submitAnswersBtn');
        submitAnswersBtn.addEventListener('click', async () => {
            const answers = collectAnswers();
            const score = await evaluateAnswers(quiz, answers);
            renderFeedback(score, playerName);
        });
    }

    function collectAnswers() {
        const answers = [];
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, index) => {
            if (question.classList.contains('multipleChoice')) {
                const selectedOption = question.querySelector('input[type="radio"]:checked');
                answers.push(selectedOption ? selectedOption.value : '');
            } else {
                const answerTextarea = question.querySelector('textarea');
                answers.push(answerTextarea.value.trim());
            }
        });
        return answers;
    }

    async function evaluateAnswers(quiz, answers) {
        let correctAnswers = 0;
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            const userAnswer = answers[i];
            if (question.type === 'multipleChoice' || question.type === 'imageSelection') {
                if (userAnswer === question.answer) {
                    correctAnswers++;
                }
            } else if (question.type === 'narrative') {
                if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
                    correctAnswers++;
                }
            }
        }
        return Math.round((correctAnswers / quiz.questions.length) * 100);
    }

    function renderFeedback(score, playerName) {
        const feedbackTemplateSource = document.getElementById('feedback-template').innerHTML;
        const feedbackTemplate = Handlebars.compile(feedbackTemplateSource);
        const correct = score >= 80;
        const correctAnswer = correct ? '' : getCorrectAnswers();
        appWidget.innerHTML = feedbackTemplate({ correct, correctAnswer });

        if (!correct) {
            const gotItBtn = document.getElementById('gotItBtn');
            gotItBtn.addEventListener('click', () => {
                const selectedQuiz = fetchQuiz('https://my-json-server.typicode.com/yourusername/yourrepositoryname/Quiz/1'); // Change the quiz number and URL as needed
                renderQuiz(selectedQuiz, playerName);
            });
        } else {
            setTimeout(() => {
                const selectedQuiz = fetchQuiz('https://my-json-server.typicode.com/yourusername/yourrepositoryname/Quiz/1'); // Change the quiz number and URL as needed
                renderQuiz(selectedQuiz, playerName);
            }, 1000);
        }
    }

    function getCorrectAnswers() {
        const questions = document.querySelectorAll('.question');
        const correctAnswers = [];
        questions.forEach((question, index) => {
            const correctAnswer = question.querySelector('input[type="radio"][value]').value;
            correctAnswers.push(correctAnswer);
        });
        return correctAnswers;
    }
});
