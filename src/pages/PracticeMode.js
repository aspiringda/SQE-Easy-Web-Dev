import React, { useState, useEffect } from 'react';
import '../styles/PracticeMode.css';
import Papa from 'papaparse';
import questionsCSV from '../data/mcq_questions.csv';

function PracticeMode() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userProgress, setUserProgress] = useState({});
  const [cumulativeScore, setCumulativeScore] = useState(0);
  const [filterCriteria, setFilterCriteria] = useState({
    module: '',
    seenStatus: 'all',
    answerStatus: 'all'
  });
  const [availableModules, setAvailableModules] = useState([]);

  useEffect(() => {
    fetch(questionsCSV)
      .then(response => response.text())
      .then(csvString => {
        const result = Papa.parse(csvString, { header: true });
        setAllQuestions(result.data);
        setFilteredQuestions(result.data);
        
        const modules = [...new Set(result.data.map(q => q.Module))];
        setAvailableModules(modules);
      })
      .catch(error => console.error('Error loading questions:', error));

    const savedProgress = localStorage.getItem('practiceProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    const uniqueCorrectAnswers = new Set(
      Object.values(userProgress)
        .filter(progress => progress.correct)
        .map(progress => progress.questionId)
    );
    setCumulativeScore(uniqueCorrectAnswers.size);
  }, [userProgress]);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      setCurrentQuestion(filteredQuestions[currentQuestionIndex]);
    }
  }, [filteredQuestions, currentQuestionIndex]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer && currentQuestion) {
      const isCorrect = selectedAnswer === currentQuestion['Correct Answer'];
      const newProgress = {
        ...userProgress,
        [currentQuestion.Question]: {
          seen: true,
          correct: isCorrect,
          attempts: (userProgress[currentQuestion.Question]?.attempts || 0) + 1,
          questionId: currentQuestion.Question
        }
      };
      setUserProgress(newProgress);
      localStorage.setItem('practiceProgress', JSON.stringify(newProgress));
      setIsAnswerRevealed(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setSelectedAnswer('');
      setIsAnswerRevealed(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
      setIsAnswerRevealed(false);
    }
  };

  const applyFilters = () => {
    let filtered = allQuestions;

  
    if (filterCriteria.module) {
      filtered = filtered.filter(q => q.Module === filterCriteria.module);
    }
    if (filterCriteria.seenStatus !== 'all') {
      filtered = filtered.filter(q => 
        filterCriteria.seenStatus === 'seen' ? userProgress[q.Question]?.seen : !userProgress[q.Question]?.seen
      );
    }
    if (filterCriteria.answerStatus !== 'all') {
      filtered = filtered.filter(q => 
        filterCriteria.answerStatus === 'correct' ? userProgress[q.Question]?.correct : userProgress[q.Question]?.correct === false
      );
    }

    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
  };

  const handleFilterChange = (e) => {
    setFilterCriteria({ ...filterCriteria, [e.target.name]: e.target.value });
  };

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="practice-mode">
      <h1>Practice Mode</h1>
      <div className="filters">
        <select id="module-filter" name="module" onChange={handleFilterChange}>
          <option value="">All Modules</option>
          {availableModules.map(module => (
            <option key={module} value={module}>{module}</option>
          ))}
        </select>
        <select id="seen-status-filter" name="seenStatus" onChange={handleFilterChange}>
          <option value="all">All Questions</option>
          <option value="seen">Seen</option>
          <option value="unseen">Unseen</option>
        </select>
        <select id="answer-status-filter" name="answerStatus" onChange={handleFilterChange}>
          <option value="all">All Answers</option>
          <option value="correct">Correct</option>
          <option value="incorrect">Incorrect</option>
        </select>
        <button id="apply-filters" onClick={applyFilters}>Apply Filters</button>
      </div>
      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {filteredQuestions.length}
      </div>
      <div className="question-card">
        <h2>Question:</h2>
        <p>{currentQuestion.Question}</p>
        
        <div className="answer-options">
  {['A', 'B', 'C', 'D', 'E'].map((option) => (
    currentQuestion[`Option ${option}`] && (
      <button
        key={option}
        id={`option-${option}`}
        onClick={() => handleAnswerSelect(option)}
        className={`answer-option 
          ${selectedAnswer === option ? 'selected' : ''} 
          ${isAnswerRevealed ? (option === currentQuestion['Correct Answer'] ? 'correct' : 
            (selectedAnswer === option ? 'incorrect' : '')) : ''}`}
        disabled={isAnswerRevealed}
      >
        {currentQuestion[`Option ${option}`]}
      </button>
    )
  ))}
</div>

        {!isAnswerRevealed ? (
          <button id="submit-answer" onClick={handleSubmit} disabled={!selectedAnswer}>Submit Answer</button>
        ) : (
          <div className="explanation">
            <h3>{selectedAnswer === currentQuestion['Correct Answer'] ? 'Correct!' : 'Incorrect'}</h3>
            <p>The correct answer is: {currentQuestion['Correct Answer']}</p>
            <h3>Explanation:</h3>
            <p>{currentQuestion.Explanation}</p>
          </div>
        )}
        <div className="navigation-buttons">
          <button id="prev-question" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
          <button id="next-question" onClick={handleNextQuestion} disabled={currentQuestionIndex === filteredQuestions.length - 1}>Next</button>
        </div>
      </div>
      <div className="score">
        <p>Cumulative Score: {cumulativeScore} / {allQuestions.length}</p>
      </div>
    </div>
  );
}

export default PracticeMode;