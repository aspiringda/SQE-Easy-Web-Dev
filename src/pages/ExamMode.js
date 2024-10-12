import React, { useState, useEffect, useCallback } from 'react';
import '../styles/ExamMode.css';
import Papa from 'papaparse';
import questionsCSV from '../data/mockexam1.csv';

function ExamMode() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [mockExams, setMockExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [sideNotes, setSideNotes] = useState({});
  const [examDuration] = useState(180); // 3 hours in minutes
  const [timeRemaining, setTimeRemaining] = useState(examDuration * 60); // in seconds
  const [isExamActive, setIsExamActive] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState(null);
  const [selectedResultQuestion, setSelectedResultQuestion] = useState(null);

  useEffect(() => {
    fetch(questionsCSV)
      .then(response => response.text())
      .then(csvString => {
        const result = Papa.parse(csvString, { header: true });
        setAllQuestions(result.data);
        const mockExamsList = [
          { id: 1, name: "Mock Exam 1", questions: result.data.slice(0, 180) },
          { id: 2, name: "Mock Exam 2", questions: result.data.slice(180, 360) },
        ];
        setMockExams(mockExamsList);
      })
      .catch(error => console.error('Error loading questions:', error));
  }, []);

  useEffect(() => {
    let timer;
    if (isExamActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endExam();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamActive, timeRemaining]);

  const startExam = useCallback(() => {
    if (selectedExam) {
      setIsExamActive(true);
      setTimeRemaining(examDuration * 60);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
    }
  }, [selectedExam, examDuration]);

  const handleSelectExam = (examId) => {
    const exam = mockExams.find(e => e.id === examId);
    setSelectedExam(exam);
  };

  const handleAnswerSelect = (answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedExam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleSideNote = (note) => {
    setSideNotes(prev => ({
      ...prev,
      [currentQuestionIndex]: note
    }));
  };

  const endExam = () => {
    setIsExamActive(false);
    setIsExamCompleted(true);
    
    const results = selectedExam.questions.map((question, index) => ({
      question: question.Question,
      userAnswer: userAnswers[index] || 'Not answered',
      correctAnswer: question['Correct Answer'],
      isCorrect: userAnswers[index] === question['Correct Answer'],
      explanation: question.Explanation,
      flagged: flaggedQuestions[index] || false,
      sideNote: sideNotes[index] || ''
    }));

    const score = results.filter(r => r.isCorrect).length;
    const percentageCorrect = (score / selectedExam.questions.length) * 100;

    setExamResults({
      score,
      totalQuestions: selectedExam.questions.length,
      percentageCorrect,
      detailedResults: results
    });
  };

  const handleResultQuestionSelect = (index) => {
    setSelectedResultQuestion(index);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = selectedExam?.questions[currentQuestionIndex];

  return (
    <div className="exam-mode">
      <h1>Exam Mode</h1>
      {!isExamActive && !isExamCompleted && (
        <div className="exam-setup">
          <select onChange={(e) => handleSelectExam(Number(e.target.value))}>
            <option value="">Select a Mock Exam</option>
            {mockExams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.name}</option>
            ))}
          </select>
          <button onClick={startExam} disabled={!selectedExam}>Start Exam</button>
        </div>
      )}
      {isExamActive && currentQuestion && (
        <div className="exam-area">
          <div className="left-panel">
            <div className="timer">Time Remaining: {formatTime(timeRemaining)}</div>
            <div className="question-card">
              <h2>Question {currentQuestionIndex + 1}:</h2>
              <p>{currentQuestion.Question}</p>
              <div className="answer-options">
                {['A', 'B', 'C', 'D', 'E'].map((option) => (
                  currentQuestion[`Option ${option}`] && (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`answer-option ${userAnswers[currentQuestionIndex] === option ? 'selected' : ''}`}
                    >
                      {currentQuestion[`Option ${option}`]}
                    </button>
                  )
                ))}
              </div>
              <button onClick={handleFlagQuestion} className="flag-btn">
                {flaggedQuestions[currentQuestionIndex] ? 'Unflag' : 'Flag'} Question
              </button>
              <textarea
                placeholder="Add a side note..."
                value={sideNotes[currentQuestionIndex] || ''}
                onChange={(e) => handleSideNote(e.target.value)}
              />
              <div className="navigation-buttons">
                <button onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</button>
                <button onClick={handleNext} disabled={currentQuestionIndex === selectedExam.questions.length - 1}>Next</button>
              </div>
              {currentQuestionIndex === selectedExam.questions.length - 1 && (
                <button onClick={endExam} className="end-exam-btn">End Exam</button>
              )}
            </div>
          </div>
          <div className="right-panel">
            <div className="question-grid">
              {selectedExam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`grid-item ${userAnswers[index] ? 'answered' : ''} ${flaggedQuestions[index] ? 'flagged' : ''}`}
                >
                  <span>{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {isExamCompleted && examResults && (
        <div className="exam-results">
          <h2>Exam Results</h2>
          <p>Score: {examResults.score}/{examResults.totalQuestions}</p>
          <p>Percentage: {examResults.percentageCorrect.toFixed(2)}%</p>
          <div className="results-grid">
            {examResults.detailedResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleResultQuestionSelect(index)}
                className={`grid-item ${result.isCorrect ? 'correct' : 'incorrect'} ${result.flagged ? 'flagged' : ''}`}
              >
                <span>{index + 1}</span>
              </button>
            ))}
          </div>
          {selectedResultQuestion !== null && (
            <div className="result-detail">
              <h3>Question {selectedResultQuestion + 1}</h3>
              <p><strong>Question:</strong> {examResults.detailedResults[selectedResultQuestion].question}</p>
              <p><strong>Your Answer:</strong> {examResults.detailedResults[selectedResultQuestion].userAnswer}</p>
              <p><strong>Correct Answer:</strong> {examResults.detailedResults[selectedResultQuestion].correctAnswer}</p>
              <p><strong>Explanation:</strong> {examResults.detailedResults[selectedResultQuestion].explanation}</p>
              {examResults.detailedResults[selectedResultQuestion].sideNote && (
                <p><strong>Your Note:</strong> {examResults.detailedResults[selectedResultQuestion].sideNote}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamMode;