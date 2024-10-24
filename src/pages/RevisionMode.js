import React, { useState, useEffect, useCallback } from 'react';
import '../styles/RevisionMode.css';
import MultiSelectFilter from './MultiSelectFilter';
import DashboardRing from './DashboardRing';
import QuestionFeedback from '../components/QuestionFeedback';

function RevisionMode() {
  // Core state declarations
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [filters, setFilters] = useState(['all']);
  const [availableModules, setAvailableModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionMetrics, setSessionMetrics] = useState({
    unseen: 0,
    correct: 0,
    incorrect: 0
  });

  // Fetch session metrics
  const fetchSessionMetrics = useCallback(async () => {
    try {
      const response = await fetch('/session-metrics');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const metrics = await response.json();
      setSessionMetrics(metrics);
    } catch (error) {
      console.error('Error fetching session metrics:', error);
    }
  }, []);

  // Fetch available modules
  const fetchAvailableModules = useCallback(async () => {
    try {
      const response = await fetch('/available-modules');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const modules = await response.json();
      setAvailableModules(modules);
    } catch (error) {
      console.error('Error fetching available modules:', error);
    }
  }, []);

  // Fetch questions
  const fetchQuestions = useCallback(async (selectedFilters = ['all'], selectedModules = []) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (selectedModules.length > 0) {
        queryParams.append('modules', selectedModules.join(','));
      }

      let url;
      if (!selectedFilters || selectedFilters.includes('all')) {
        url = `/qa-questions?${queryParams.toString()}`;
      } else {
        if (selectedFilters.includes('seen')) queryParams.append('seen', 'true');
        if (selectedFilters.includes('unseen')) queryParams.append('unseen', 'true');
        if (selectedFilters.includes('correct')) queryParams.append('correct', 'true');
        if (selectedFilters.includes('incorrect')) queryParams.append('incorrect', 'true');
        url = `/filtered-questions?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const questions = await response.json();
      return questions.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        module: q.module
      }));
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter handling
  const applyFilters = useCallback((questions, appliedFilters) => {
    let filtered = [...questions];
    const moduleFilters = appliedFilters.filter(f => availableModules.includes(f));
    if (moduleFilters.length > 0) {
      filtered = filtered.filter(q => moduleFilters.includes(q.module));
    }
    return filtered;
  }, [availableModules]);

  const handleFilterChange = useCallback(async (newFilters) => {
    const newModuleFilters = newFilters.filter(f => availableModules.includes(f));
    const otherFilters = newFilters.filter(f => !availableModules.includes(f));
    
    setSelectedModules(newModuleFilters);
    const combinedFilters = [...otherFilters, ...newModuleFilters];
    setFilters(combinedFilters);
    
    const fetchedQuestions = await fetchQuestions(combinedFilters, newModuleFilters);
    setAllQuestions(fetchedQuestions);
    setFilteredQuestions(fetchedQuestions);
  }, [availableModules, fetchQuestions]);

  // Session handling
  const applyFiltersAndStartSession = useCallback(async () => {
    const filteredQuestions = applyFilters(allQuestions, filters);
    const selectedQuestions = filteredQuestions.slice(0, numberOfQuestions);
    setFilteredQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setIsSessionStarted(true);
    setIsSessionComplete(false);

    try {
      await fetch('/clear-session', { method: 'POST' });
      
      for (const question of selectedQuestions) {
        await fetch('/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...question,
            status: 'unseen',
            result: null
          })
        });
      }

      await fetchSessionMetrics();
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }, [allQuestions, filters, applyFilters, numberOfQuestions, fetchSessionMetrics]);

  const handleEndSession = async () => {
    if (window.confirm('Are you sure you want to end the session?')) {
      try {
        await fetch('/clear-session', { method: 'POST' });
        setIsSessionStarted(false);
        setIsSessionComplete(false);
        await fetchSessionMetrics();
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
  };

  // Question handling
  const handleRevealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
    const question = filteredQuestions[currentQuestionIndex];
    if (question) {
      const newProgress = {
        ...userProgress,
        [question.question]: { ...userProgress[question.question], seen: true }
      };
      setUserProgress(newProgress);
      localStorage.setItem('revisionProgress', JSON.stringify(newProgress));
    }
  }, [filteredQuestions, currentQuestionIndex, userProgress]);

  const handleAnswerFeedback = useCallback(async (isCorrect) => {
    const question = filteredQuestions[currentQuestionIndex];
    if (question && !isSessionComplete) {
      const result = isCorrect ? 'correct' : 'incorrect';

      const newProgress = {
        ...userProgress,
        [question.question]: {
          id: question.id,
          seen: true,
          correct: isCorrect
        }
      };
      setUserProgress(newProgress);
      localStorage.setItem('revisionProgress', JSON.stringify(newProgress));

      try {
        const response = await fetch('/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...question,
            result,
            status: 'seen'
          })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        await fetchSessionMetrics();

        if (currentQuestionIndex === filteredQuestions.length - 1) {
          setIsSessionComplete(true);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsAnswerRevealed(false);
        }
      } catch (error) {
        console.error('Error saving result:', error);
      }
    }
  }, [filteredQuestions, currentQuestionIndex, userProgress, isSessionComplete, fetchSessionMetrics]);

  // Initial load effects
  useEffect(() => {
    fetchAvailableModules();
    fetchQuestions().then(questions => {
      setAllQuestions(questions);
      setFilteredQuestions(questions);
    });
    
    const savedProgress = localStorage.getItem('revisionProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, [fetchAvailableModules, fetchQuestions]);

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  return (
    <div className="revision-mode">
      <h1>Revision Mode</h1>
      <div className="dashboard-layout">
        <div className="stats-panel">
          <DashboardRing
            sessionStats={{
              total: numberOfQuestions,
              answered: sessionMetrics.correct + sessionMetrics.incorrect,
              correct: sessionMetrics.correct,
              incorrect: sessionMetrics.incorrect,
              unseen: sessionMetrics.unseen
            }}
          />
        </div>
        <div className="question-panel">
          {!isSessionStarted ? (
            <>
              <MultiSelectFilter 
                filters={[...filters, ...selectedModules]} 
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
                  onChange={(e) => setNumberOfQuestions(
                    Math.max(1, Math.min(allQuestions.length, parseInt(e.target.value) || 1))
                  )}
                />
              </div>
              <button id="start-session" onClick={applyFiltersAndStartSession}>
                Start Session
              </button>
            </>
          ) : (
            <>
              {currentQuestion ? (
                <div className="question-card">
                  <h2>Question:</h2>
                  <p>{currentQuestion.question}</p>
                  <QuestionFeedback 
                    questionId={currentQuestion.id}
                    userEmail={localStorage.getItem('userEmail')}
                    handleSuccess={() => console.log('Feedback submitted successfully')}
                  />
                  {!isAnswerRevealed ? (
                    <button id="reveal-answer" onClick={handleRevealAnswer}>
                      Reveal Answer
                    </button>
                  ) : (
                    <div className="answer-section">
                      <h3>Answer:</h3>
                      <p>{currentQuestion.answer}</p>
                      {!isSessionComplete && (
                        <>
                          <button id="mark-correct" onClick={() => handleAnswerFeedback(true)}>
                            Correct
                          </button>
                          <button id="mark-incorrect" onClick={() => handleAnswerFeedback(false)}>
                            Incorrect
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p>No questions available. Try adjusting your filters.</p>
              )}
              {isSessionComplete && (
                <h2>Session complete. You've answered all questions.</h2>
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
                    const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
                    if (!isLastQuestion) {
                      setCurrentQuestionIndex(prev => prev + 1);
                      setIsAnswerRevealed(false);
                    } else {
                      setIsSessionComplete(true);
                    }
                  }}
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                >
                  Next
                </button>
              </div>
              <div className="session-progress">
                Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </div>
              <button id="end-session" onClick={handleEndSession}>
                End Session
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevisionMode;