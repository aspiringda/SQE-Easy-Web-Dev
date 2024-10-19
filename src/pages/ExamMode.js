import React, { useState, useEffect } from 'react';
import GlobalRing from '../components/GlobalRing';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const Dashboard = () => {
  // State for storing fetched data
  const [overallPerformance, setOverallPerformance] = useState(null);
  const [mockExamData, setMockExamData] = useState([]);
  const [modulePerformance, setModulePerformance] = useState([]);

  useEffect(() => {
    // Fetch data when component mounts
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Replace these with actual API calls
      // const overallPerformanceData = await api.fetchOverallPerformance();
      // const mockExamData = await api.fetchMockExamData();
      // const modulePerformanceData = await api.fetchModulePerformance();

      // Placeholder data
      const overallPerformanceData = {
        total: 1000,
        answered: 750,
        correct: 600,
      };

      const mockExamData = [
        { name: 'Exam 1', score: 65 },
        { name: 'Exam 2', score: 70 },
        { name: 'Exam 3', score: 75 },
        { name: 'Exam 4', score: 72 },
        { name: 'Exam 5', score: 80 },
      ];

      const modulePerformanceData = [
        { name: 'Module 1', score: 75 },
        { name: 'Module 2', score: 80 },
        { name: 'Module 3', score: 65 },
        { name: 'Module 4', score: 90 },
        { name: 'Module 5', score: 70 },
        { name: 'Module 6', score: 85 },
        { name: 'Module 7', score: 78 },
        { name: 'Module 8', score: 88 },
        { name: 'Module 9', score: 72 },
        { name: 'Module 10', score: 76 },
        { name: 'Module 11', score: 82 },
        { name: 'Module 12', score: 79 },
      ];

      setOverallPerformance(overallPerformanceData);
      setMockExamData(mockExamData);
      setModulePerformance(modulePerformanceData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // TODO: Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="dashboard">
      <h1>Your Performance Dashboard</h1>

      <div className="dashboard-grid">
        <section className="overall-performance">
          <h2>Overall Performance</h2>
          {overallPerformance ? (
            <GlobalRing globalStats={overallPerformance} sessionStats={overallPerformance} />
          ) : (
            <p>Loading overall performance...</p>
          )}
        </section>

        <section className="mock-exam-progress">
          <h2>Mock Exam Progress</h2>
          {mockExamData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockExamData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading mock exam data...</p>
          )}
        </section>

        <section className="module-performance">
          <h2>Module Performance</h2>
          {modulePerformance.length > 0 ? (
            <div className="module-bars">
              {modulePerformance.map((module) => (
                <div key={module.name} className="module-bar">
                  <div className="module-name">{module.name}</div>
                  <div className="module-score-bar" style={{ width: `${module.score}%` }}>
                    {module.score}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading module performance data...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;