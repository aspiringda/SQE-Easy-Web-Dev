// Global variables
let questions = [];
let currentQuestionIndex = 0;
let totalQuestions = 0;
let easyCount = 0;
let mediumCount = 0;
let hardCount = 0;

// DOM elements
const csvFileInput = document.getElementById('csv-file');
const questionCountInput = document.getElementById('question-count');
const startPracticeButton = document.getElementById('start-practice');
const practiceSetup = document.getElementById('practice-setup');
const practiceArea = document.getElementById('practice-area');
const practiceSummary = document.getElementById('practice-summary');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const showAnswerButton = document.getElementById('show-answer');
const answerButtons = document.getElementById('answer-buttons');
const progressBar = document.getElementById('progress');
const restartPracticeButton = document.getElementById('restart-practice');

// Event listeners
startPracticeButton.addEventListener('click', startPractice);
showAnswerButton.addEventListener('click', showAnswer);
document.getElementById('easy').addEventListener('click', () => rateQuestion('easy'));
document.getElementById('medium').addEventListener('click', () => rateQuestion('medium'));
document.getElementById('hard').addEventListener('click', () => rateQuestion('hard'));
restartPracticeButton.addEventListener('click', restartPractice);

// Function to parse CSV file
function parseCSV(csv) {
    console.log('Parsing CSV:', csv.substring(0, 100) + '...'); // Log the first 100 characters of CSV
    const lines = csv.split('\n');
    return lines.map(line => {
        const [question, answer] = line.split(',');
        return { question: question.trim(), answer: answer.trim() };
    });
}

// Function to start practice
function startPractice() {
    const file = csvFileInput.files[0];
    if (!file) {
        alert('Please select a CSV file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        questions = parseCSV(e.target.result);
        totalQuestions = Math.min(parseInt(questionCountInput.value), questions.length);
        questions = questions.sort(() => 0.5 - Math.random()).slice(0, totalQuestions);
        currentQuestionIndex = 0;
        easyCount = 0;
        mediumCount = 0;
        hardCount = 0;

        practiceSetup.style.display = 'none';
        practiceArea.style.display = 'block';
        displayQuestion();
    };
    reader.readAsText(file);
}

// Function to display question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answerText.textContent = question.answer;
    answerText.style.display = 'none';
    showAnswerButton.style.display = 'block';
    answerButtons.style.display = 'none';
    updateProgressBar();
}

// Function to show answer
function showAnswer() {
    answerText.style.display = 'block';
    showAnswerButton.style.display = 'none';
    answerButtons.style.display = 'flex';
}

// Function to rate question and move to next
function rateQuestion(difficulty) {
    switch (difficulty) {
        case 'easy':
            easyCount++;
            break;
        case 'medium':
            mediumCount++;
            break;
        case 'hard':
            hardCount++;
            break;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        displayQuestion();
    } else {
        showSummary();
    }
}

// Function to update progress bar
function updateProgressBar() {
    const progress = (currentQuestionIndex / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
}

// Function to show practice summary
function showSummary() {
    practiceArea.style.display = 'none';
    practiceSummary.style.display = 'block';
    document.getElementById('easy-count').textContent = easyCount;
    document.getElementById('medium-count').textContent = mediumCount;
    document.getElementById('hard-count').textContent = hardCount;
}

// Function to restart practice
function restartPractice() {
    practiceSummary.style.display = 'none';
    practiceSetup.style.display = 'block';
    csvFileInput.value = '';
    questionCountInput.value = '10';
}