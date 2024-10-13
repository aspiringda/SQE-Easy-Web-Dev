// File: /Users/chadielhasnaoui/Desktop/my-app/src/pages/StudyProgressDashboard.js

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  overallPerformance: {
    review: 75,
    practice: 60,
    test: 80
  },
  moduleScores: [
    { name: 'Contract Law', score: 85 },
    { name: 'Tort Law', score: 72 },
    { name: 'Constitutional Law', score: 68 },
    { name: 'Criminal Law', score: 90 },
    { name: 'Property Law', score: 78 }
  ]
};

const RingDashboard = ({ data }) => {
  // Placeholder for RingDashboard
  return (
    <div>
      <h4>Overall Performance</h4>
      <p>Review: {data.review}%</p>
      <p>Practice: {data.practice}%</p>
      <p>Test: {data.test}%</p>
    </div>
  );
};

const ModuleBreakdown = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" domain={[0, 100]} />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const StudyProgressDashboard = () => {
  return (
    <div className="study-progress-dashboard">
      <h2>Study Progress Dashboard</h2>
      <div className="overall-performance">
        <h3>Overall Performance</h3>
        <RingDashboard data={mockData.overallPerformance} />
      </div>
      <div className="module-breakdown">
        <h3>Module Breakdown</h3>
        <ModuleBreakdown data={mockData.moduleScores} />
      </div>
    </div>
  );
};

export default StudyProgressDashboard;