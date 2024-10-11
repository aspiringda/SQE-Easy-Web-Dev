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
  const [examDuration, setExamDuration] = useState(180); // 3 hours in minutes
  const [timeRemaining, setTimeRemaining] = useState(examDuration * 60); // in seconds
  const [isExamActive, setIsExamActive] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState(null);

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

  const endExam = () => {
    setIsExamActive(false);
    setIsExamCompleted(true);
    
    const results = selectedExam.questions.map((question, index) => ({
      question: question.Question,
      userAnswer: userAnswers[index] || 'Not answered',
      correctAnswer: question['Correct Answer'],
      isCorrect: userAnswers[index] === question['Correct Answer'],
      explanation: question.Explanation
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
            <div className="navigation-buttons">
              <button onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</button>
              <button onClick={handleNext} disabled={currentQuestionIndex === selectedExam.questions.length - 1}>Next</button>
            </div>
          </div>
          <button onClick={endExam} className="end-exam-btn">End Exam</button>
        </div>
      )}
      {isExamCompleted && examResults && (
        <div className="exam-results">
          <h2>Exam Results</h2>
          <p>Score: {examResults.score}/{examResults.totalQuestions}</p>
          <p>Percentage: {examResults.percentageCorrect.toFixed(2)}%</p>
          <h3>Detailed Results:</h3>
          {examResults.detailedResults.map((result, index) => (
            <div key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
              <p><strong>Question {index + 1}:</strong> {result.question}</p>
              <p>Your Answer: {result.userAnswer}</p>
              <p>Correct Answer: {result.correctAnswer}</p>
              <p>Explanation: {result.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamMode;