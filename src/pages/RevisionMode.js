import React, { useState, useEffect, useCallback } from 'react';
import '../styles/RevisionMode.css';
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
  const [selectedModules, setSelectedModules] = useState([]);
  
  const fetchAvailableModules = useCallback(async () => {
    try {
      const response = await fetch('/available-modules');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const modules = await response.json();
      setAvailableModules(modules);
    } catch (error) {
      console.error('Error fetching available modules:', error);
    }
  }, []);

  useEffect(() => {
    fetchAvailableModules();
  }, [fetchAvailableModules]);



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
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
  
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

  const applyFilters = useCallback((questions, appliedFilters) => {
    let filtered = [...questions];
  
    const moduleFilters = appliedFilters.filter(f => availableModules.includes(f));
    if (moduleFilters.length > 0) {
      filtered = filtered.filter(q => moduleFilters.includes(q.module));
    }
  
    // Other filters (seen, unseen, correct, incorrect) are handled server-side
    // but we keep this function for potential client-side filtering if needed
  

    return filtered;
  }, [availableModules]);



  const handleFilterChange = useCallback(async (newFilters) => {
    
    // Separate module filters from other filters
    const newModuleFilters = newFilters.filter(f => availableModules.includes(f));
    const otherFilters = newFilters.filter(f => !availableModules.includes(f));
  
    // Update selected modules
    setSelectedModules(newModuleFilters);
  
    // Combine other filters with selected modules for fetching questions
    const combinedFilters = [...otherFilters, ...newModuleFilters];
    setFilters(combinedFilters);
    
    const fetchedQuestions = await fetchQuestions(combinedFilters, newModuleFilters);
    setAllQuestions(fetchedQuestions);
    setFilteredQuestions(fetchedQuestions);
  }, [availableModules, fetchQuestions]);

  const applyFiltersAndStartSession = useCallback(() => {
    const filteredQuestions = applyFilters(allQuestions, filters);
    setFilteredQuestions(filteredQuestions.slice(0, numberOfQuestions));
    setCurrentQuestionIndex(0);
    setIsAnswerRevealed(false);
    setIsSessionStarted(true);
    setSessionStats({ total: 0, correct: 0 });
    setIsSessionComplete(false);
  }, [allQuestions, filters, applyFilters, numberOfQuestions]);

  const loadUserProgress = useCallback(() => {
    const savedProgress = localStorage.getItem('revisionProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    fetchAvailableModules();
    fetchQuestions().then(questions => {
      setAllQuestions(questions);
      setFilteredQuestions(questions);
    });
    loadUserProgress();
  }, [fetchAvailableModules, fetchQuestions, loadUserProgress]);

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
  
  
  const handleAnswerFeedback = useCallback(async (isCorrect) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    if (currentQuestion && !isSessionComplete) {
        const result = isCorrect ? 'correct' : 'incorrect';
        const status = 'seen';

        // Update local state
        const newProgress = {
            ...userProgress,
            [currentQuestion.Question]: { 
                id: currentQuestion.id, // Include the ID in the state
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

        try {
            // Save the result and status to the server
            const response = await fetch('/save-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentQuestion.id, // Use the ID from m4_qa_sample
                    question: currentQuestion.question,
                    answer: currentQuestion.answer,
                    module: currentQuestion.module,
                    result: result,
                    status: status
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log('Result and status saved successfully');
        } catch (error) {
            console.error('Error saving result and status:', error);
        }

        const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
        if (isLastQuestion) {
            setIsSessionComplete(true);
        } else {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setIsAnswerRevealed(false);
        }
    }
}, [filteredQuestions, currentQuestionIndex, userProgress, isSessionComplete]);
const moveToNextQuestion = useCallback(async () => {
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  if (currentQuestion) {
      // Get the user response for the current question, defaulting to an empty object if none exists
      const userResponse = userProgress[currentQuestion.question] || { seen: false, correct: undefined };
      let result;
      let status;

      // Case 1: Click "Next" without revealing answer
      if (!isAnswerRevealed) {
          result = 'incorrect';
          status = 'unseen';
      } 
      // Case 2: Click "Reveal Answer" and then "Next" without selecting correct/incorrect
      else if (isAnswerRevealed && userResponse.correct === undefined) {
          result = 'incorrect';
          status = 'seen';
      } 
      // Case 3: Click "Reveal Answer" and then "Incorrect"
      else if (isAnswerRevealed && userResponse.correct === false) {
          result = 'incorrect';
          status = 'seen';
      }
      // Case 4: Click "Reveal Answer" and then "Correct"
      else if (isAnswerRevealed && userResponse.correct === true) {
          result = 'correct';
          status = 'seen';
      }

      // Update local state based on the conditions evaluated above
      const newProgress = {
          ...userProgress,
          [currentQuestion.question]: {
              id: currentQuestion.id, // Ensure the ID is retained in the state
              seen: status === 'seen',
              correct: result === 'correct'
          }
      };
      setUserProgress(newProgress);
      localStorage.setItem('revisionProgress', JSON.stringify(newProgress));

      setSessionStats(prev => ({
          total: prev.total + 1,
          correct: prev.correct + (result === 'correct' ? 1 : 0)
      }));

      try {
          // Save the result and status to the server
          const response = await fetch('/save-result', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  id: currentQuestion.id, // Use the ID from m4_qa_sample
                  question: currentQuestion.question,
                  answer: currentQuestion.answer,
                  module: currentQuestion.module,
                  result: result,
                  status: status
              })
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

      } catch (error) {
          console.error('Error saving result:', error);
      }

      proceedToNextQuestion();
  }
}, [filteredQuestions, currentQuestionIndex, userProgress, isAnswerRevealed]);

const proceedToNextQuestion = () => {
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  if (isLastQuestion) {
      setIsSessionComplete(true);
  } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsAnswerRevealed(false); // Reset this to hide the answer for the next question
  }
};







  
  

const handleEndSession = async () => {
  if (window.confirm('Are you sure you want to end the session?')) {
      try {
          await fetch('/clear-session', { method: 'POST' });
          setSessionStats({ total: 0, correct: 0 }); // Reset session stats
          setIsSessionStarted(false);
          setIsSessionComplete(false);
      } catch (error) {
          console.error('Error clearing session:', error);
      }
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
                  <p>{currentQuestion.question}</p> {/* Changed from currentQuestion.Question */}
                  {!isAnswerRevealed ? (
                    <button id="reveal-answer" onClick={handleRevealAnswer}>Reveal Answer</button>
                  ) : (
                    <div className="answer-section">
                      <h3>Answer:</h3>
                      <p>{currentQuestion.answer}</p> {/* Changed from currentQuestion.AnswerSection */}
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
                  onClick={moveToNextQuestion}
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