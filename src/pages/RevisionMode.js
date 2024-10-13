import React, { useState, useEffect, useCallback } from 'react';
import '../styles/RevisionMode.css';
import Papa from 'papaparse';
import questionsCSV from '../data/questions.csv';
import MultiSelectFilter from './MultiSelectFilter';
import DashboardRing from './DashboardRing';

function RevisionMode() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [filters, setFilters] = useState(['all']);
  const [availableModules, setAvailableModules] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [globalStats, setGlobalStats] = useState({ total: 0, answered: 0, correct: 0 });
  const [sessionStats, setSessionStats] = useState({ total: 0, correct: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  useEffect(() => {
    fetchQuestions();
    loadUserProgress();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(questionsCSV);
      const csvString = await response.text();
      const result = Papa.parse(csvString, { header: true });
      setAllQuestions(result.data);
      const modules = [...new Set(result.data.map(q => q.Module))];
      setAvailableModules(modules);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = () => {
    const savedProgress = localStorage.getItem('revisionProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  const handleFilterChange = useCallback((selectedFilters) => {
    setFilters(selectedFilters);
  }, []);

  const applyFiltersAndStartSession = useCallback(() => {
    let filtered = [...allQuestions];

    if (!filters.includes('all')) {
      if (filters.includes('seen')) {
        filtered = filtered.filter(q => userProgress[q.Question]?.seen);
      }
      if (filters.includes('unseen')) {
        filtered = filtered.filter(q => !userProgress[q.Question]?.seen);
      }
      if (filters.includes('correct')) {
        filtered = filtered.filter(q => userProgress[q.Question]?.correct);
      }
      if (filters.includes('incorrect')) {
        filtered = filtered.filter(q => userProgress[q.Question]?.correct === false);
      }
      const moduleFilters = filters.filter(f => availableModules.includes(f));
      if (moduleFilters.length > 0) {
        filtered = filtered.filter(q => moduleFilters.includes(q.Module));
      }
    }

    filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);

    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setIsSessionStarted(true);
    setSessionStats({ total: 0, correct: 0 });
    setIsSessionComplete(false);
  }, [allQuestions, filters, userProgress, availableModules, numberOfQuestions]);

  useEffect(() => {
    const totalQuestions = allQuestions.length;
    const answeredQuestions = Object.values(userProgress).filter(p => p.seen).length;
    const correctAnswers = Object.values(userProgress).filter(p => p.correct).length;
    setGlobalStats({
      total: totalQuestions,
      answered: answeredQuestions,
      correct: correctAnswers
    });
  }, [allQuestions, userProgress]);

  const handleRevealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (currentQuestion) {
      const newProgress = {
        ...userProgress,
        [currentQuestion.Question]: { ...userProgress[currentQuestion.Question], seen: true }
      };
      setUserProgress(newProgress);
      localStorage.setItem('revisionProgress', JSON.stringify(newProgress));
    }
  }, [filteredQuestions, currentQuestionIndex, userProgress]);

  const handleAnswerFeedback = useCallback((isCorrect) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (currentQuestion && !isSessionComplete) {
      const newProgress = {
        ...userProgress,
        [currentQuestion.Question]: { 
          ...userProgress[currentQuestion.Question], 
          seen: true,
          correct: isCorrect
        }
      };
      setUserProgress(newProgress);
      localStorage.setItem('revisionProgress', JSON.stringify(newProgress));

      setSessionStats(prev => ({
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0)
      }));

      const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
      if (isLastQuestion) {
        setIsSessionComplete(true);
      } else {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }
    }
    setIsAnswerRevealed(false);
  }, [filteredQuestions, currentQuestionIndex, userProgress, isSessionComplete]);

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end the session?')) {
      setIsSessionStarted(false);
      setIsSessionComplete(false);
    }
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="revision-mode">
      <h1>Revision Mode</h1>
      <div className="dashboard-layout">
        <div className="stats-panel">
          <DashboardRing
            globalStats={{
              total: allQuestions.length,
              answered: globalStats.answered,
              correct: globalStats.correct
            }}
            sessionStats={{
              total: filteredQuestions.length,
              answered: sessionStats.total,
              correct: sessionStats.correct
            }}
          />
        </div>
        <div className="question-panel">
          {!isSessionStarted ? (
            <>
              <MultiSelectFilter 
                filters={filters} 
                onChange={handleFilterChange}
                availableModules={availableModules}
              />
              <div className="number-of-questions">
                <label htmlFor="questionCount">Number of Questions:</label>
                <input
                  id="questionCount"
                  type="number"
                  min="1"
                  max={allQuestions.length}
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Math.max(1, Math.min(allQuestions.length, parseInt(e.target.value) || 1)))}
                />
              </div>
              <button id="start-session" onClick={applyFiltersAndStartSession}>Start Session</button>
            </>
          ) : (
            <>
              {currentQuestion ? (
                <div className="question-card">
                  <h2>Question:</h2>
                  <p>{currentQuestion.Question}</p>
                  {!isAnswerRevealed ? (
                    <button id="reveal-answer" onClick={handleRevealAnswer}>Reveal Answer</button>
                  ) : (
                    <div className="answer-section">
                      <h3>Answer:</h3>
                      <p>{currentQuestion.Answer}</p>
                      {!isSessionComplete && (
                        <>
                          <button id="mark-correct" onClick={() => handleAnswerFeedback(true)}>Correct</button>
                          <button id="mark-incorrect" onClick={() => handleAnswerFeedback(false)}>Incorrect</button>
                        </>
                      )}
                      {isSessionComplete && (
                        <p>Session complete. You've answered all questions.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p>No questions available. Try adjusting your filters.</p>
              )}
              <div className="navigation-buttons">
                <button 
                  id="prev-question"
                  onClick={() => {
                    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                    setIsAnswerRevealed(false);
                  }}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button 
                  id="next-question"
                  onClick={() => {
                    setCurrentQuestionIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1));
                    setIsAnswerRevealed(false);
                  }}
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                >
                  Next
                </button>
              </div>
              <div className="session-progress">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </div>
              <button id="end-session" onClick={handleEndSession}>End Session</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevisionMode;