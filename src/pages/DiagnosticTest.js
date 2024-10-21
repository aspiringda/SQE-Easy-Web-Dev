import React, { useState } from 'react';

function DiagnosticTest() {
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    setLog(prevLog => [...prevLog, message]);
  };

  const fetchAvailableModules = async () => {
    try {
      addLog('Fetching available modules...');
      const response = await fetch('/available-modules');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const modules = await response.json();
      addLog(`Fetched modules: ${JSON.stringify(modules)}`);
    } catch (error) {
      addLog(`Error fetching modules: ${error.message}`);
    }
  };

  const fetchQuestions = async () => {
    try {
      addLog('Fetching questions...');
      const response = await fetch('/qa-questions');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const questions = await response.json();
      addLog(`Fetched ${questions.length} questions`);
    } catch (error) {
      addLog(`Error fetching questions: ${error.message}`);
    }
  };

  const clearSession = async () => {
    try {
      addLog('Clearing session...');
      const response = await fetch('/clear-session', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      addLog('Session cleared');
    } catch (error) {
      addLog(`Error clearing session: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Diagnostic Test</h1>
      <button onClick={fetchAvailableModules}>Fetch Modules</button>
      <button onClick={fetchQuestions}>Fetch Questions</button>
      <button onClick={clearSession}>Clear Session</button>
      <div>
        <h2>Log:</h2>
        {log.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>
    </div>
  );
}

export default DiagnosticTest;