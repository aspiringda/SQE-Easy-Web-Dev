import React from 'react';
import '../styles/BecomingSolicitor.css';

function BecomingSolicitor() {
  return (
    <div className="becoming-solicitor">
      <h1>Becoming a Solicitor in the UK</h1>
      
      <section className="intro">
        <p>Becoming a solicitor in the United Kingdom is a rewarding career path that requires dedication, hard work, and a thorough understanding of the legal system. This guide will walk you through the key steps to qualify as a solicitor in the UK.</p>
      </section>
      
      <section className="steps">
        <h2>Steps to Become a Solicitor</h2>
        <ol>
          <li>
            <h3>Academic Stage</h3>
            <p>Complete a qualifying law degree (LLB) or any non-law degree followed by a Graduate Diploma in Law (GDL) or Common Professional Examination (CPE).</p>
          </li>
          <li>
            <h3>Solicitors Qualifying Examination (SQE)</h3>
            <p>Pass the SQE, which consists of two stages:</p>
            <ul>
              <li>SQE1: Tests your functional legal knowledge</li>
              <li>SQE2: Assesses your practical legal skills</li>
            </ul>
          </li>
          <li>
            <h3>Qualifying Work Experience (QWE)</h3>
            <p>Complete two years of qualifying work experience. This can be done before, during, or after the SQE assessments.</p>
          </li>
          <li>
            <h3>Character and Suitability Requirements</h3>
            <p>Meet the Solicitors Regulation Authority's (SRA) character and suitability requirements to demonstrate you're fit to practice as a solicitor.</p>
          </li>
        </ol>
      </section>
      
      <section className="sqe-info">
        <h2>About the SQE</h2>
        <p>The Solicitors Qualifying Examination (SQE) is a centralized assessment for qualifying solicitors in England and Wales. It ensures that all newly qualified solicitors meet consistent, high standards at the point of entry to the profession.</p>
        <ul>
          <li><strong>SQE1:</strong> Multiple choice questions testing legal knowledge</li>
          <li><strong>SQE2:</strong> Practical legal skills assessments including client interview, advocacy, legal writing, and legal drafting</li>
        </ul>
      </section>
      
      <section className="resources">
        <h2>Useful Resources</h2>
        <ul>
          <li><a href="https://www.sra.org.uk/" target="_blank" rel="noopener noreferrer">Solicitors Regulation Authority (SRA)</a></li>
          <li><a href="https://www.lawsociety.org.uk/" target="_blank" rel="noopener noreferrer">The Law Society</a></li>
          <li><a href="https://sqe.sra.org.uk/" target="_blank" rel="noopener noreferrer">SQE Official Website</a></li>
        </ul>
      </section>
      
      <section className="conclusion">
        <p>Becoming a solicitor requires commitment and perseverance, but it offers a challenging and fulfilling career. With the introduction of the SQE, the path to qualification has become more flexible and accessible. Start your journey today and take the first step towards a rewarding legal career!</p>
      </section>
    </div>
  );
}

export default BecomingSolicitor;