import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.css';

function SignupPage() {
  const handleSignup = (e) => {
    e.preventDefault();
    // Add signup logic here (to be implemented)
  };

  return (
    <main>
      <section id="hero" className="section">
        <div className="hero-content">
          <h1>Create Your SQE-Easy Account</h1>
          <p>Start your journey to SQE success today</p>
        </div>
      </section>

      <section id="signup-form" className="section">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" required />
          </div>
          <div className="form-group">
            <label htmlFor="studyStage">Current Study Stage:</label>
            <select id="studyStage" required>
              <option value="">Select your current stage</option>
              <option value="preparing">Preparing for SQE</option>
              <option value="flk1">Studying for FLK1</option>
              <option value="flk2">Studying for FLK2</option>
              <option value="completedFlk1">Completed FLK1</option>
              <option value="completedFlk2">Completed FLK2</option>
            </select>
          </div>
          <div className="form-group">
            <input type="checkbox" id="termsAgreed" required />
            <label htmlFor="termsAgreed">
              I agree to the <Link to="/terms">Terms and Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
        <p>Already have an account? <Link to="/login">Log in here</Link></p>
      </section>
    </main>
  );
}

export default SignupPage;
