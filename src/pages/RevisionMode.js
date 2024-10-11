import React, { useState, useEffect, useCallback } from 'react';
import '../styles/RevisionMode.css';
import Papa from 'papaparse';
import questionsCSV from '../data/questions.csv';

function RevisionMode() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [numQuestions, setNumQuestions] = useState(10);
  const [filterType, setFilterType] = useState('all');
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [progressStats, setProgressStats] = useState({ correct: 0, incorrect: 0, unseen: 0 });

  useEffect(() => {
    fetch(questionsCSV)
      .then(response => response.text())
      .then(csvString => {
        const result = Papa.parse(csvString, { header: true });
        setAllQuestions(result.data);
      })
      .catch(error => console.error('Error loading questions:', error));

    const savedProgress = localStorage.getItem('revisionProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    updateProgressStats();
  }, [userProgress, allQuestions]);

  const updateProgressStats = useCallback(() => {
    const stats = { correct: 0, incorrect: 0, unseen: 0 };
    allQuestions.forEach(q => {
      if (!userProgress[q.Question]) {
        stats.unseen++;
      } else if (userProgress[q.Question].correct) {
        stats.correct++;
      } else {
        stats.incorrect++;
      }
    });
    setProgressStats(stats);
  }, [allQuestions, userProgress]);

  const startRevision = useCallback(() => {
    let filtered = [...allQuestions];
    
    if (filterType === 'unseen') {
      filtered = filtered.filter(q => !userProgress[q.Question]);
    } else if (filterType === 'incorrect') {
      filtered = filtered.filter(q => userProgress[q.Question]?.correct === false);
    } else if (filterType === 'correct') {
      filtered = filtered.filter(q => userProgress[q.Question]?.correct === true);
    }

    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    setSelectedQuestions(filtered);
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setSessionScore({ correct: 0, total: 0 });
    setIsSessionActive(true);
  }, [allQuestions, userProgress, filterType, numQuestions]);

  const handleSubmit = () => {
    setIsAnswerRevealed(true);
  };

  const handleAnswer = (correct) => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const newProgress = { 
      ...userProgress, 
      [currentQuestion.Question]: { 
        seen: true,
        correct: correct,
        attempts: (userProgress[currentQuestion.Question]?.attempts || 0) + 1
      } 
    };
    setUserProgress(newProgress);
    localStorage.setItem('revisionProgress', JSON.stringify(newProgress));

    const newScore = {
      correct: sessionScore.correct + (correct ? 1 : 0),
      total: sessionScore.total + 1
    };
    setSessionScore(newScore);

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerRevealed(false);
    } else {
      endSession(newScore);
    }
  };

  const endSession = (finalScore = sessionScore) => {
    setIsSessionActive(false);
    const percentageCorrect = (finalScore.correct / selectedQuestions.length) * 100;
    alert(`Session completed!\nScore: ${finalScore.correct}/${selectedQuestions.length}\nPercentage: ${percentageCorrect.toFixed(2)}%`);
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerRevealed(false);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsAnswerRevealed(false);
    }
  };

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="revision-mode">
      <h1>Revision Mode</h1>
      {!isSessionActive && (
        <div className="controls">
          <label htmlFor="num-questions">
            Number of questions:
            <input 
              id="num-questions"
              type="number" 
              value={numQuestions} 
              onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </label>
          <select id="filter-type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Questions</option>
            <option value="unseen">Unseen Questions</option>
            <option value="incorrect">Incorrect Answers</option>
            <option value="correct">Correct Answers</option>
          </select>
          <button id="start-revision" onClick={startRevision}>Start Revision</button>
        </div>
      )}
      {isSessionActive && currentQuestion && (
        <div className="question-card">
          <h2>Question:</h2>
          <p>{currentQuestion.Question}</p>
          {!isAnswerRevealed ? (
            <button id="submit-answer" onClick={handleSubmit}>Submit Answer</button>
          ) : (
            <div className="answer-section">
              <h3>Answer:</h3>
              <p>{currentQuestion.Answer}</p>
              <button id="answer-correct" onClick={() => handleAnswer(true)}>Correct</button>
              <button id="answer-incorrect" onClick={() => handleAnswer(false)}>Incorrect</button>
            </div>
          )}
          <div className="navigation-buttons">
            <button id="nav-back" onClick={handleBack} disabled={currentQuestionIndex === 0}>Back</button>
            <button id="nav-next" onClick={handleNext} disabled={currentQuestionIndex === selectedQuestions.length - 1}>Next</button>
          </div>
        </div>
      )}
      {isSessionActive && (
        <div className="session-controls">
          <div className="progress">
            Question {currentQuestionIndex + 1} of {selectedQuestions.length}
          </div>
          <button id="end-session" onClick={() => endSession()} className="end-session-btn">End Session</button>
        </div>
      )}
      <div className="overall-progress">
        <h3>Overall Progress</h3>
        <p>Correct: {progressStats.correct}</p>
        <p>Incorrect: {progressStats.incorrect}</p>
        <p>Unseen: {progressStats.unseen}</p>
        <p>Total Questions: {allQuestions.length}</p>
      </div>
    </div>
  );
}

export default RevisionMode;