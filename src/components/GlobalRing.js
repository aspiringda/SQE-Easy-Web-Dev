import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/GlobalRing.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const GlobalRing = ({ globalStats }) => {
  const { total, answered, correct } = globalStats;

  const data = {
    labels: ['Correct', 'Incorrect', 'Unseen'],
    datasets: [
      {
        data: [correct, answered - correct, total - answered],
        backgroundColor: ['#2d6a4f', '#c54d25', '#9EA3B0'],
        hoverBackgroundColor: ['#45a049', '#da190b', '#8a8e99'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="dashboard-ring">
    <div className="ring-container">
      <h2>Overall Progress Revision Mode</h2>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
      <div className="stats-text">
        <p>Total Questions: {total}</p>
        <p>Answered: {answered}</p>
        <p>Correct: {correct}</p>
        <p>Percentage: {percentage}%</p>
      </div>
    </div>
    <div className="ring-container">
      <h2>Overall Progress Practice Mode</h2>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
      <div className="stats-text">
        <p>Total Questions: {total}</p>
        <p>Answered: {answered}</p>
        <p>Correct: {correct}</p>
        <p>Percentage: {percentage}%</p>
      </div>
    </div>
  </div>
  );
};

export default GlobalRing;