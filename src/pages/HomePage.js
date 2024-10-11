import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here (to be implemented)
  };

  return (
    <main>
      <section id="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Master the SQE with SQE-Easy</h1>
            <p>Your ultimate question bank for SQE preparation in the UK</p>
          </div>
          <div className="login-section">
            <form id="login-form" onSubmit={handleLogin}>
              <input type="email" id="email" placeholder="Email" required />
              <input type="password" id="password" placeholder="Password" required />
              <button type="submit" id="login-button" className="btn btn-primary">Login</button>
            </form>
            <Link to="/forgot-password" id="forgot-password">Forgot password?</Link>
            <Link to="/signup" id="create-account">Create account</Link>
            <div className="social-login">
              <button id="google-login" className="btn btn-social">Google</button>
              <button id="facebook-login" className="btn btn-social">Facebook</button>
              <button id="apple-login" className="btn btn-social">Apple</button>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <h2>Why Choose SQE-Easy?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Comprehensive Question Bank</h3>
            <p>Access thousands of practice questions covering all SQE topics</p>
          </div>
          <div className="feature-card">
            <h3>Adaptive Learning</h3>
            <p>Personalized study plans based on your performance</p>
          </div>
          <div className="feature-card">
            <h3>Mock Exams</h3>
            <p>Simulate real exam conditions with our timed tests</p>
          </div>
          <div className="feature-card">
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
          <div className="feature-card">
            <h3>Mock Exams</h3>
            <p>Simulate real exam conditions with our timed tests</p>
          </div>
          <div className="feature-card">
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
        </div>
      </section>

      <section id="cta">
        <h2>Ready to Excel in Your SQE Journey?</h2>
        <p>Join thousands of successful candidates who have prepared with SQE-Easy</p>
        <Link to="/signup" className="btn btn-primary" id="cta-sign-up">Sign Up Now</Link>
      </section>
    </main>
  );
}

export default HomePage;