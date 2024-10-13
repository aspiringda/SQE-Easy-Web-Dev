/*import React from 'react';
import '../styles/DashboardRing.css';

const DashboardRing = ({ globalStats, sessionStats }) => {
  const RingChart = ({ stats, title }) => {
    const totalQuestions = stats.total;
    const unseenQuestions = totalQuestions - stats.answered;
    const correctAnswers = stats.correct;
    const incorrectAnswers = stats.answered - stats.correct;

    const calculatePercentage = (value) => (value / totalQuestions) * 100;

    const unseenPercentage = calculatePercentage(unseenQuestions);
    const correctPercentage = calculatePercentage(correctAnswers);

    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    const unseenOffset = 0;
    const correctOffset = (unseenPercentage / 100) * circumference;
    const incorrectOffset = ((unseenPercentage + correctPercentage) / 100) * circumference;

    return (
      <div className="ring-container">
        <h3>{title}</h3>
        <svg viewBox="0 0 100 100" className="ring-chart">
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#e0e0e0" 
            strokeWidth="10" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#444444" 
            strokeWidth="10" 
            strokeDasharray={circumference}
            strokeDashoffset={unseenOffset}
            className="ring-segment unseen"
          />
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#4CAF50" 
            strokeWidth="10" 
            strokeDasharray={circumference}
            strokeDashoffset={correctOffset}
            className="ring-segment correct"
          />
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="#F44336" 
            strokeWidth="10" 
            strokeDasharray={circumference}
            strokeDashoffset={incorrectOffset}
            className="ring-segment incorrect"
          />
          <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="20">
            {`${Math.round((stats.correct/ stats.answered) * 100)}%`}
          </text>
        </svg>
        <div className="stats-text">
          <p>Total: {totalQuestions}</p>
          <p>Seen: {stats.answered}</p>
          <p>Correct: {stats.correct}</p>
          <p>Incorrect: {incorrectAnswers}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-ring">
      <RingChart stats={globalStats} title="Overall Progress" />
      <RingChart stats={sessionStats} title="Current Session" />
    </div>
  );
};

export default DashboardRing;*/

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardRing = ({ globalStats, sessionStats }) => {
  const createChartData = (stats) => {
    const total = stats.total || 1; // Prevent division by zero
    return {
      labels: ['Correct', 'Incorrect', 'Unseen'],
      datasets: [
        {
          data: [
            stats.correct,
            stats.answered - stats.correct,
            total - stats.answered
          ],
          backgroundColor: ['#4CAF50', '#F44336', '#444444'],
          hoverBackgroundColor: ['#45a049', '#da190b', '#333333']
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${percentage}%`;
          }
        }
      }
    }
  };

  const calculatePercentage = (correct, total) => {
    if (total === 0) return '0.0';
    return ((correct / total) * 100).toFixed(1);
  };

  return (
    <div className="dashboard-ring">
      <div className="ring-container">
        <h3>Current Session</h3>
        <div style={{ height: '300px', width: '300px' }}>
          <Doughnut data={createChartData(sessionStats)} options={options} />
        </div>
        <div className="stats-text">
          <p>Total Questions: {sessionStats.total}</p>
          <p>Answered: {sessionStats.answered}</p>
          <p>Correct: {sessionStats.correct}</p>
          <p>Percentage: {calculatePercentage(sessionStats.correct, sessionStats.answered)}%</p>
        </div>
      </div>
      <div className="ring-container">
        <h3>Overall Progress</h3>
        <div style={{ height: '300px', width: '300px' }}>
          <Doughnut data={createChartData(globalStats)} options={options} />
        </div>
        <div className="stats-text">
          <p>Total Questions: {globalStats.total}</p>
          <p>Answered: {globalStats.answered}</p>
          <p>Correct: {globalStats.correct}</p>
          <p>Percentage: {calculatePercentage(globalStats.correct, globalStats.answered)}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardRing;