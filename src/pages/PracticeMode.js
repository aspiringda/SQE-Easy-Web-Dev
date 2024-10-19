import React, { useState, useEffect, useCallback } from 'react';
import '../styles/PracticeMode.css';
import Papa from 'papaparse';
import questionsCSV from '../data/mcq_questions.csv';
import MultiSelectFilter from './MultiSelectFilter';
import DashboardRing from './DashboardRing';
import { usePracticeStats } from '../pages/usePracticeStats';

function PracticeMode() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [filters, setFilters] = useState(['all']);
  const [availableModules, setAvailableModules] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ total: 0, answered: 0, correct: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const globalStats = usePracticeStats(allQuestions, userProgress);

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
    const savedProgress = localStorage.getItem('practiceProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  const handleFilterChange = useCallback((selectedFilters) => {
    setFilters(selectedFilters);
  }, []);

  const handleAnswerSelect = useCallback((option) => {
    if (!isAnswerRevealed && !isSessionComplete) {
      setSelectedAnswer(option);
    }
  }, [isAnswerRevealed, isSessionComplete]);

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
    setSelectedAnswer('');
    setIsAnswerRevealed(false);
    setIsSessionStarted(true);
    setSessionStats({ total: filtered.length, answered: 0, correct: 0 });
    setIsSessionComplete(false);
  }, [allQuestions, filters, userProgress, availableModules, numberOfQuestions]);

  const handleSubmit = useCallback(() => {
    if (selectedAnswer && !isAnswerRevealed && !isSessionComplete) {
      const currentQuestion = filteredQuestions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion['Correct Answer'];
      const newProgress = {
        ...userProgress,
        [currentQuestion.Question]: {
          seen: true,
          correct: isCorrect,
          attempts: (userProgress[currentQuestion.Question]?.attempts || 0) + 1
        }
      };
      setUserProgress(newProgress);
      localStorage.setItem('practiceProgress', JSON.stringify(newProgress));
      setIsAnswerRevealed(true);
      setSessionStats(prev => ({
        total: prev.total,
        answered: prev.answered + 1,
        correct: prev.correct + (isCorrect ? 1 : 0)
      }));

      if (currentQuestionIndex === filteredQuestions.length - 1) {
        setIsSessionComplete(true);
      }
    }
  }, [selectedAnswer, isAnswerRevealed, isSessionComplete, filteredQuestions, currentQuestionIndex, userProgress]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
      setIsAnswerRevealed(false);
    } else {
      setIsSessionComplete(true);
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end the session?')) {
      setIsSessionStarted(false);
      setIsSessionComplete(false);
      setFilteredQuestions([]);
      setCurrentQuestionIndex(0);
    }
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="practice-mode">
      <h1>Practice Mode</h1>
      <div className="dashboard-layout">
        <DashboardRing
          globalStats={globalStats}
          sessionStats={sessionStats}
        />
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
                  <div className="answer-options">
                    {['A', 'B', 'C', 'D', 'E'].map((option) => (
                      currentQuestion[`Option ${option}`] && (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(option)}
                          className={`answer-option 
                            ${selectedAnswer === option ? 'selected' : ''} 
                            ${isAnswerRevealed ? 
                              (option === currentQuestion['Correct Answer'] ? 'correct' : 
                              (selectedAnswer === option && selectedAnswer !== currentQuestion['Correct Answer'] ? 'incorrect' : '')) 
                             : ''}`}
                          disabled={isAnswerRevealed || isSessionComplete}
                        >
                          {currentQuestion[`Option ${option}`]}
                        </button>
                      )
                    ))}
                  </div>
                  {!isAnswerRevealed && !isSessionComplete && (
                    <button id="submit-answer" onClick={handleSubmit} disabled={!selectedAnswer}>Submit Answer</button>
                  )}
                  {isAnswerRevealed && (
                    <div className="explanation">
                      <h3>{selectedAnswer === currentQuestion['Correct Answer'] ? 'Correct!' : 'Incorrect'}</h3>
                      <p>The correct answer is: {currentQuestion['Correct Answer']}</p>
                      <h3>Explanation:</h3>
                      <p>{currentQuestion.Explanation}</p>
                      {!isSessionComplete && (
                        <button id="next-question" onClick={handleNext}>Next Question</button>
                      )}
                    </div>
                  )}
                  {isSessionComplete && (
                    <p>Session complete. You've answered all questions.</p>
                  )}
                </div>
              ) : (
                <p>No questions available. Try adjusting your filters.</p>
              )}
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

export default PracticeMode;