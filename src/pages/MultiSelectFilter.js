import React from 'react';
import '../styles/MultiSelectFilter.css';

const MultiSelectFilter = ({ filters, onChange, availableModules }) => {
  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    let newFilters = [...filters];

    if (type === 'radio') {
      // For question status (all, seen, unseen)
      newFilters = newFilters.filter(f => !['all', 'seen', 'unseen'].includes(f));
      if (checked) newFilters.push(value);
      
      // Remove 'correct' and 'incorrect' if 'all' or 'unseen' is selected
      if (['all', 'unseen'].includes(value)) {
        newFilters = newFilters.filter(f => !['correct', 'incorrect'].includes(f));
      }
    } else if (name === 'answerStatus') {
      // For answer status (correct, incorrect)
      if (checked) {
        newFilters.push(value);
      } else {
        newFilters = newFilters.filter(f => f !== value);
      }
    } else if (name === 'modules') {
      // For modules
      if (checked) {
        newFilters.push(value);
      } else {
        newFilters = newFilters.filter(f => f !== value);
      }
    }

    onChange(newFilters);
  };

  const isDisabled = (value) => {
    if (filters.includes('all')) return value !== 'all';
    if (filters.includes('unseen')) return ['correct', 'incorrect'].includes(value);
    return false;
  };

  return (
    <div className="multi-select-filter">
      <div className="filter-section">
        <h3>Question Status</h3>
        <div className="radio-group">
          {['all', 'seen', 'unseen'].map(status => (
            <label key={status} className="radio-label">
              <input
                type="radio"
                name="questionStatus"
                value={status}
                checked={filters.includes(status)}
                onChange={handleInputChange}
              />
              <span className="radio-custom"></span>
              {status.charAt(0).toUpperCase() + status.slice(1)} Questions
            </label>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h3>Answer Status</h3>
        <div className="checkbox-group">
          {['correct', 'incorrect'].map(status => (
            <label key={status} className="checkbox-label">
              <input
                type="checkbox"
                name="answerStatus"
                value={status}
                checked={filters.includes(status)}
                onChange={handleInputChange}
                disabled={isDisabled(status)}
              />
              <span className="checkbox-custom"></span>
              {status.charAt(0).toUpperCase() + status.slice(1)} Answers
            </label>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h3>Modules</h3>
        <div className="checkbox-group">
          {availableModules.map(module => (
            <label key={module} className="checkbox-label">
              <input
                type="checkbox"
                name="modules"
                value={module}
                checked={filters.includes(module)}
                onChange={handleInputChange}
              />
              <span className="checkbox-custom"></span>
              {module}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectFilter;