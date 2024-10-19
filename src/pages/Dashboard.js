import React from 'react';
import GlobalRing from '../components/GlobalRing';
import { usePracticeStats } from './usePracticeStats';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const globalStats = usePracticeStats();

  const accuracy = globalStats.answered > 0
    ? ((globalStats.correct / globalStats.answered) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        <GlobalRing globalStats={globalStats} />
        <div className="additional-stats">
          <h2>Overall Progress</h2>
          <p>Total Questions: {globalStats.total}</p>
          <p>Answered Questions: {globalStats.answered}</p>
          <p>Correct Answers: {globalStats.correct}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;