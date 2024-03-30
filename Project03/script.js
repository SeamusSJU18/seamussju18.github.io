document.addEventListener('DOMContentLoaded', async function() {
    let quizData = [];
    let playerName = '';
    let selectedQuiz = null;

    async function fetchQuizData() {
        try {
            const response = await fetch('https://my-json-server.typicode.com/<your-username>/<your-repo>/Quiz');
            if (!response.ok) {
                throw new Error('Failed to fetch quiz data');
            }
            quizData = await response.json();
            console.log('Quiz data:', quizData);
            renderStartPage();
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    }

    function renderStartPage() {
        const startPageTemplate = Handlebars.compile(document.getElementById('enter_name').innerHTML);
        document.getElementById('app_widget').innerHTML = startPageTemplate({ quizzes: quizData });
        document.getElementById('name-form').addEventListener('submit', startQuiz);
    }

    function startQuiz(event) {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        playerName = nameInput.value.trim();
        const quizSelect = document.getElementById('quiz-select');
        const selectedIndex = quizSelect.selectedIndex;
        selectedQuiz = quizData[selectedIndex];
        if (playerName && selectedQuiz) {
            renderQuiz();
        } else {
            console.log('Please enter your name and select a quiz');
        }
    }

    function renderQuiz() {
        const quizTemplate = Handlebars.compile(document.getElementById('quiz-template').innerHTML);
        document.getElementById('app_widget').innerHTML = quizTemplate({ quiz: selectedQuiz });
        document.getElementById('submitAnswersBtn').addEventListener('click', submitAnswers);
    }

    async function submitAnswers() {
        // Logic to handle submitting answers and displaying feedback
        // Update scoreboard
        // Move to next question or finish quiz
    }

    await fetchQuizData();
});
