import { useState, useEffect } from 'react';

export const usePracticeStats = () => {
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    answered: 0,
    correct: 0
  });

  useEffect(() => {
    const calculateGlobalStats = () => {
      const userProgress = JSON.parse(localStorage.getItem('practiceProgress') || '{}');
      const total = Object.keys(userProgress).length;
      let answered = 0;
      let correct = 0;

      Object.values(userProgress).forEach(progress => {
        if (progress.seen) {
          answered++;
          if (progress.correct) {
            correct++;
          }
        }
      });

      setGlobalStats({ total, answered, correct });
    };

    calculateGlobalStats();

    // Set up an interval to recalculate stats every 5 seconds
    const intervalId = setInterval(calculateGlobalStats, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return globalStats;
};