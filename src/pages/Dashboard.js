import React, { useState, useEffect } from 'react';
import GlobalRing from '../components/GlobalRing';
import ExamBreakdown from '../components/ExamBreakdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const CustomYAxisTick = ({ x, y, payload }) => {
  const [moduleNum, ...rest] = payload.value.split(':');
  const restOfText = rest.join(':').trim();
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="#666" className="module-label">
        <tspan x={0} className="module-number">{moduleNum}</tspan>
        <tspan x={0} dy="1.2em" className="module-name">{restOfText}</tspan>
      </text>
    </g>
  );
};

const Dashboard = () => {
  const [overallPerformance, setOverallPerformance] = useState(null);
  const [mockExamData, setMockExamData] = useState([]);
  const [modulePerformance, setModulePerformance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulated API call - replace with actual API call in production
      const overallPerformanceData = {
        total: 1000,
        answered: 750,
        correct: 600,
      };

      const mockExamData = [
        { 
          name: 'Exam 1', 
          score: 65,
          moduleBreakdown: [
            { name: 'Module 1 : Business Law and Practice', unseen: 20, correct: 60, incorrect: 20 },
            { name: 'Module 2 : Dispute Resolution', unseen: 15, correct: 70, incorrect: 15 },
            { name: 'Module 3 : Contract', unseen: 25, correct: 55, incorrect: 20 },
            { name: 'Module 4 : Tort Law ', unseen: 10, correct: 80, incorrect: 10 },
            { name: 'Module 5 :The Legal System', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 6 : Property Practice', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 7 : Wills and Administration of Estates', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 8 :Solicitors Accounts', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 9 : Land Law', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 10 : Trusts ', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 11 : Criminal Law and Practice ', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 12 :', unseen: 30, correct: 50, incorrect: 20 }
          ]
        },
        { 
          name: 'Exam 2', 
          score: 70,
        moduleBreakdown : [
            { name: 'Module 1 : Business Law and Practice', unseen: 20, correct: 60, incorrect: 20 },
            { name: 'Module 2 : Dispute Resolution', unseen: 15, correct: 70, incorrect: 15 },
            { name: 'Module 3 : Contract', unseen: 25, correct: 55, incorrect: 20 },
            { name: 'Module 4 : Tort Law ', unseen: 10, correct: 80, incorrect: 10 },
            { name: 'Module 5 :The Legal System', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 6 : Property Practice', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 7 : Wills and Administration of Estates', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 8 :Solicitors Accounts', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 9 : Land Law', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 10 : Trusts ', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 11 : Criminal Law and Practice ', unseen: 30, correct: 50, incorrect: 20 },
            { name: 'Module 12 :', unseen: 30, correct: 50, incorrect: 20 }
          ]
        }
      ];
// More exams

      const modulePerformanceData = [
        { name: 'Module 1 : Business Law and Practice', unseen: 20, correct: 60, incorrect: 20 },
        { name: 'Module 2 : Dispute Resolution', unseen: 15, correct: 70, incorrect: 15 },
        { name: 'Module 3 : Contract', unseen: 25, correct: 55, incorrect: 20 },
        { name: 'Module 4 : Tort Law ', unseen: 10, correct: 80, incorrect: 10 },
        { name: 'Module 5 : The Legal System', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 6 : Property Practice', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 7 : Wills and Administration of Estates', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 8 : Solicitors Accounts', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 9 : Land Law', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 10 :Trusts ', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 11 :Criminal Law and Practice ', unseen: 30, correct: 50, incorrect: 20 },
        { name: 'Module 12 :', unseen: 30, correct: 50, incorrect: 20 },
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
        {/* Overall Performance section */}
        <section className="overall-performance">
          <h2>Overall Performance</h2>
          {overallPerformance ? (
            <GlobalRing globalStats={overallPerformance} sessionStats={overallPerformance} />
          ) : (
            <p>Loading overall performance...</p>
          )}
        </section>

        {/* Mock Exam Progress section */}
        <ExamBreakdown mockExamData={mockExamData} />

        {/* Module Performance section */}
        <section className="module-performance">
          <h2>Module Performance</h2>
        {modulePerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={modulePerformance.length * 50 + 100}>
              <BarChart
                layout="vertical"
                data={modulePerformance}
                margin={{ top: 20, right: 0, left: 25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={170}
                  tick={<CustomYAxisTick />}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" stackId="a" fill="#2d6a4f" barSize={20} />
                <Bar dataKey="incorrect" stackId="a" fill="#c54d25" barSize={20} />
                <Bar dataKey="unseen" stackId="a" fill="#3333" barSize={20}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Loading module performance data...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;