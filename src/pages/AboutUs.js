import React from 'react';
import '../styles/AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us-container">
      <h1 className="about-us-title">About SQE Easy</h1>
      
      <section className="about-us-section">
        <h2 className="section-title">Our Mission</h2>
        <p className="content-text">
          At SQE Easy, our mission is to empower aspiring solicitors by providing comprehensive, accessible, and effective preparation tools for the Solicitors Qualifying Examination (SQE). We believe in breaking down barriers to legal education and fostering a diverse, well-prepared generation of legal professionals.
        </p>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">Why Choose Us</h2>
        <ul className="feature-list">
          <li>Comprehensive SQE1 and SQE2 preparation materials</li>
          <li>Adaptive learning technology to personalize your study experience</li>
          <li>Expert-crafted practice questions and mock exams</li>
          <li>Flexible subscription plans to fit your needs and budget</li>
          <li>Dedicated support from experienced legal professionals</li>
        </ul>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">Our Team</h2>
        <div className="team-member">
          <img src="/path-to-image.jpg" alt="Jane Doe" className="team-member-image" />
          <div className="team-member-info">
            <h3>Jane Doe</h3>
            <p>Founder & Legal Education Expert</p>
            <p className="content-text">Jane brings over 15 years of experience in legal education and qualification preparation. Her vision drives SQE Easy's commitment to excellence and innovation in SQE training.</p>
          </div>
        </div>
     </section>
  </div>
  );
}

export default AboutUs;