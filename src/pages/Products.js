import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products.css';

function Products() {
  const studyModes = [
    {
      id: 'revision',
      name: 'Revision Mode',
      description: 'Master your knowledge with our ANKI-style flashcard system.',
      features: [
        'ANKI-style flashcards for effective learning',
        'Customizable number of questions per session',
        'Filtering options: all, unseen, correct, or incorrect questions',
        'Progress tracking across sessions'
      ]
    },
    {
      id: 'practice',
      name: 'Practice Mode',
      description: 'Hone your skills with our extensive question bank.',
      features: [
        'Comprehensive question bank covering all SQE topics',
        'Detailed explanations for each answer',
        'Performance analytics to track your progress',
        'Customizable practice sessions'
      ]
    },
    {
      id: 'exam',
      name: 'Exam Mode',
      description: 'Simulate real exam conditions to prepare for the big day.',
      features: [
        'Timed tests mimicking the actual SQE exam format',
        'Realistic exam environment simulation',
        'Comprehensive performance report after each mock exam',
        'Strategies and tips for exam day success'
      ]
    }
  ];

  return (
    <div className="products">
      <h1>Our Study Modes</h1>
      
      <div className="study-modes">
        {studyModes.map((mode) => (
          <div key={mode.id} className="mode-card">
            <h2>{mode.name}</h2>
            <p>{mode.description}</p>
            <h3>Key Features:</h3>
            <ul>
              {mode.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <Link to={`/${mode.id}`} className="btn btn-primary">Start {mode.name}</Link>
          </div>
        ))}
      </div>

      <section className="additional-features">
        <h2>Additional Features</h2>
        <ul>
          <li>Adaptive learning technology</li>
          <li>Mobile-friendly interface for studying on-the-go</li>
          <li>Regular content updates to align with the latest SQE syllabus</li>
        </ul>
      </section>

      {/* Placeholder for future additions */}
      <section className="future-developments">
        <h2>Coming Soon</h2>
        <p>We're constantly working on new features to enhance your study experience. Stay tuned for upcoming additions!</p>
      </section>
    </div>
  );
}

export default Products;