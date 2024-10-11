import React from 'react';

function AboutUs() {
  return (
    <div className="about-us">
      <h1>About SQE-Easy</h1>
      <section className="mission">
        <h2>Our Mission</h2>
        <p>At SQE-Easy, we're committed to helping aspiring solicitors succeed in their SQE journey. Our platform provides comprehensive, user-friendly study materials designed to make your preparation as effective and efficient as possible.</p>
      </section>
      <section className="team">
        <h2>Our Team</h2>
        <p>Our team consists of experienced legal professionals, education experts, and tech enthusiasts, all dedicated to revolutionizing SQE preparation.</p>
        {/* You can add team member profiles here later */}
      </section>
      <section className="history">
        <h2>Our History</h2>
        <p>Founded in [Year], SQE-Easy has grown from a small startup to a leading provider of SQE preparation materials, helping thousands of students achieve their goals.</p>
      </section>
    </div>
  );
}

export default AboutUs;