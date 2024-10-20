import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardRing = ({ sessionStats }) => {
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
          <h4 style={{ color: 'green' }}>Correct: {sessionStats.correct}</h4>
          <h3>Percentage: {calculatePercentage(sessionStats.correct, sessionStats.answered)}%</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardRing;
