const BYPASS_AUTH = true;

// Global variables
let examQuestions = [];
let currentQuestionIndex = 0;
let examDuration = 0;
let timerInterval;
let userAnswers = [];
let flaggedQuestions = new Set();
let currentUser = null;

// DOM Elements
const examSetupForm = document.getElementById('exam-setup-form');
const examArea = document.getElementById('exam-area');
const examSummary = document.getElementById('exam-summary');
const examResults = document.getElementById('exam-results');
const timerDisplay = document.getElementById('time-left');
const questionDisplay = document.getElementById('question-display');
const questionNavigation = document.getElementById('question-navigation');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeExam);
examSetupForm.addEventListener('submit', startExam);
document.getElementById('prev-question').addEventListener('click', () => navigateQuestion(-1));
document.getElementById('next-question').addEventListener('click', () => navigateQuestion(1));
document.getElementById('flag-question').addEventListener('click', toggleFlagQuestion);
document.getElementById('finish-exam').addEventListener('click', finishExam);
document.getElementById('submit-exam').addEventListener('click', submitExam);

// Initialize exam setup
async function initializeExam() {
    await checkUserAuthentication();
    if (currentUser) {
        fetchTopics();
        loadSavedProgress();
    } else if (!BYPASS_AUTH) {
        window.location.href = 'login.html';
    }
}

// Check user authentication
async function checkUserAuthentication() {
    if (BYPASS_AUTH) {
        console.log('Authentication bypassed for testing');
        currentUser = { id: 'test-user', token: 'test-token' };
        return;
    }

    try {
        const response = await fetch('/api/check-auth', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
        } else {
            currentUser = null;
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        currentUser = null;
        window.location.href = 'login.html';
    }
}

// Fetch topics from server and populate topic select
async function fetchTopics() {
    try {
        const response = await fetch('/api/topics', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        if (response.ok) {
            const topics = await response.json();
            const topicSelect = document.getElementById('topic-select');
            topics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.id;
                option.textContent = topic.name;
                topicSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch topics');
        }
    } catch (error) {
        console.error('Error fetching topics:', error);
    }
}

// Load saved progress
async function loadSavedProgress() {
    try {
        const response = await fetch(`/api/saved-progress/${currentUser.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        if (response.ok) {
            const savedProgress = await response.json();
            if (savedProgress) {
                // Implement logic to resume saved exam
                console.log('Saved progress found:', savedProgress);
                // You might want to ask the user if they want to resume or start a new exam
            }
        }
    } catch (error) {
        console.error('Error loading saved progress:', error);
    }
}

// Start the exam
async function startExam(event) {
    event.preventDefault();
    const questionCount = document.getElementById('question-count').value;
    examDuration = document.getElementById('exam-duration').value * 60; // Convert to seconds
    const topics = Array.from(document.getElementById('topic-select').selectedOptions).map(option => option.value);
    const difficulty = document.getElementById('difficulty-select').value;
    const previousAttempts = document.getElementById('previous-attempts').value;

    await fetchQuestions(questionCount, topics, difficulty, previousAttempts);
}

// Fetch questions from server based on filters
async function fetchQuestions(count, topics, difficulty, previousAttempts) {
    try {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                count,
                topics,
                difficulty,
                previousAttempts,
                userId: currentUser.id
            })
        });
        if (response.ok) {
            examQuestions = await response.json();
            setupExamInterface();
        } else {
            console.error('Failed to fetch questions');
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Setup the exam interface
function setupExamInterface() {
    examSetupForm.style.display = 'none';
    examArea.style.display = 'block';
    setupQuestionNavigation();
    displayQuestion(0);
    startTimer();
}

// ... [rest of the functions remain largely the same, just add error handling and user checks where necessary]

// Save exam progress
async function saveExamProgress() {
    try {
        await fetch(`/api/save-progress/${currentUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                examQuestions,
                userAnswers,
                flaggedQuestions: Array.from(flaggedQuestions),
                timeRemaining: examDuration
            })
        });
    } catch (error) {
        console.error('Error saving exam progress:', error);
    }
}

// Submit the exam
async function submitExam() {
    examSummary.style.display = 'none';
    examResults.style.display = 'block';
    const results = calculateResults();
    document.getElementById('result-total').textContent = examQuestions.length;
    document.getElementById('correct-answers').textContent = results.correct;
    document.getElementById('incorrect-answers').textContent = results.incorrect;
    document.getElementById('exam-score').textContent = `${results.score.toFixed(2)}%`;
    
    await saveResultsToServer(results);
}

// Save results to server
async function saveResultsToServer(results) {
    try {
        await fetch(`/api/exam-results/${currentUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                results,
                examQuestions,
                userAnswers
            })
        });
    } catch (error) {
        console.error('Error saving exam results:', error);
    }
}

// Add an event listener for beforeunload to save progress when the user leaves the page
window.addEventListener('beforeunload', saveExamProgress);