import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../styles/ExamBreakdown.css';

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

const ExamBreakdownPopup = ({ isOpen, onClose, examData }) => {
  if (!examData) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {examData.name} Breakdown
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            layout="vertical"
            data={examData.moduleBreakdown}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={150}
              tick={<CustomYAxisTick />}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="correct" stackId="a" fill="#2d6a4f" barSize={20} />
            <Bar dataKey="incorrect" stackId="a" fill="#c54d25" barSize={20} />
            <Bar dataKey="unseen" stackId="a" fill="#3333" barSize={20}/>
          </BarChart>
        </ResponsiveContainer>
      </DialogContent>
    </Dialog>
  );
};

const ExamBreakdown = ({ mockExamData }) => {
  const [selectedExam, setSelectedExam] = useState(null);

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
  };

  return (
    <>
      <section className="mock-exam-progress">
        <h2>Mock Exam Progress</h2>
        {mockExamData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockExamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#8884d8" 
                activeDot={{ 
                  r: 8, 
                  onClick: (event, payload) => handleExamClick(payload.payload)
                }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading mock exam data...</p>
        )}
      </section>

      <ExamBreakdownPopup 
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        examData={selectedExam}
      />
    </>
  );
};

export default ExamBreakdown;