function DashboardRing({ globalStats, sessionStats }) {
  return (
    <div className="dashboard-ring">
      <div className="global-stats">
        <h3>Global Stats</h3>
        <p>Total Questions: {globalStats.total}</p>
        <p>Answered: {globalStats.answered}</p>
        <p>Correct: {globalStats.correct}</p>
      </div>
      <div className="session-stats">
        <h3>Current Session</h3>
        <p>Correct: {sessionStats.correct}</p>
        <p>Incorrect: {sessionStats.incorrect}</p>
        <p>Unseen: {sessionStats.unseen}</p>
      </div>
    </div>
  );
}
