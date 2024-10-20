import React from 'react';
import '../styles/AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us-container">
      <h1 className="about-us-title">About SQE Easy</h1>
      
      <section className="about-us-section">
        <h2 className="section-title">Our Story</h2>
        <p className="content-text">
        At SQE Easy, we recognised a fundamental disconnect in legal education: many providers aren't aligning with the transformative goals of the Solicitors Qualifying Examination (SQE). The SQE aims to democratise access to the solicitor profession, allowing aspiring lawyers to qualify without the traditional training contract. This innovative approach enables students from all backgrounds to prepare for their futures on their own terms.</p>
        <p>Unfortunately, many educational institutions continue to deliver SQE content in the same manner they did for the Legal Practice Course (LPC)—through rigid classes, annual courses, and significant financial commitments—often without the specific resources needed to succeed on the SQE.</p>
        <p>That’s where SQE Easy comes in. We offer tailored resources designed specifically for the SQE, focusing on the exam's unique format, which many law students have never encountered before. Our flexible service options—available in 3-month, 6-month, or annual packages—allow you to choose what works best for your study needs. If you only want to practice, our mock exam bundles are also available for purchase.</p>
        <p>With SQE Easy, you gain access to the tools and support necessary to thrive, aligning perfectly with the SQE's vision and the needs of tomorrow's solicitors. Join us in redefining legal education for a brighter future.
        </p>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">Our Goals</h2>
        <p>At SQE Easy, we are driven by a set of clear, ambitious goals:</p>
        <ul className="feature-list">
          <li>Democratise Access: We aim to make high-quality SQE preparation materials accessible to all, regardless of financial background, jobs, age, residency.</li>
          <li>Empower Students: Our resources are designed to help students not just pass the SQE, but to truly understand and apply legal concepts.</li>
          <li>Provide Efficiency: We strive to offer streamlined, focused study materials that align perfectly with the SQE's objectives.</li>
          <li>Ensure Affordability: We believe that quality education should not come at an exorbitant price.</li>
          <li>Foster Informed Learning: Our platform is built to keep students up-to-date with the latest developments in legal education and the SQE.</li>
        </ul>
      </section>

      <section className="about-us-section">
        <h2 className="section-title">Our Services</h2>
        <p>We offer a comprehensive suite of services tailored to the needs of SQE candidates:</p>
        <ul className="feature-list">
          <li>Comprehensive Subject Coverage: All topics examined in the SQE (FLK1 and FLK2 ) are available, carefully curated with the assessment objectives in mind.</li>
          <li>Efficient Study Modes: Our platform features study modes specifically designed to prepare you for the single best answer format of the SQE.</li>
          <li>Interactive Revision Tools: Utilise our Q&A tests to reinforce your learning and identify areas of improvement.</li>
          <li>MCQ Practice: Get accustomed to the single best answer format while testing your knowledge and skills.</li>
          <li>Realistic Mock Exams: Experience the time pressure, format, and stress of a real exam with our carefully crafted mock tests.</li>
          <li>Progress Tracking Dashboard: Set goals, track your scores, and access comprehensive data about your revision journey.</li>
        </ul>
        <p>At SQE Easy, we don't teach law - we help you succeed. Join us, and let's transform your legal aspirations into reality.</p>
      </section>

  </div>
  );
}

export default AboutUs;