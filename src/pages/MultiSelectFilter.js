import React from 'react';

const MultiSelectFilter = ({ filters, onChange, availableModules }) => {
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let newFilters;

    if (["all", "seen", "unseen"].includes(value)) {
      // If selecting a question status option, remove other question status options
      newFilters = filters.filter(f => !["all", "seen", "unseen"].includes(f));
      if (checked) {
        newFilters.push(value);
      }
    } else {
      // For other options, just add or remove as normal
      if (checked) {
        newFilters = [...filters, value];
      } else {
        newFilters = filters.filter(f => f !== value);
      }
    }

    onChange(newFilters);
  };

  return (
    <div className="multi-select-filter">
      <div>
        <h3>Question Status</h3>
        <label>
          <input
            type="checkbox"
            value="all"
            checked={filters.includes('all')}
            onChange={handleCheckboxChange}
          /> All Questions
        </label>
        <label>
          <input
            type="checkbox"
            value="seen"
            checked={filters.includes('seen')}
            onChange={handleCheckboxChange}
          /> Seen Questions
        </label>
        <label>
          <input
            type="checkbox"
            value="unseen"
            checked={filters.includes('unseen')}
            onChange={handleCheckboxChange}
          /> Unseen Questions
        </label>
      </div>
      <div>
        <h3>Answer Status</h3>
        <label>
          <input
            type="checkbox"
            value="correct"
            checked={filters.includes('correct')}
            onChange={handleCheckboxChange}
          /> Correct Answers
        </label>
        <label>
          <input
            type="checkbox"
            value="incorrect"
            checked={filters.includes('incorrect')}
            onChange={handleCheckboxChange}
          /> Incorrect Answers
        </label>
      </div>
      <div>
        <h3>Modules</h3>
        {availableModules.map(module => (
          <label key={module}>
            <input
              type="checkbox"
              value={module}
              checked={filters.includes(module)}
              onChange={handleCheckboxChange}
            /> {module}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectFilter;