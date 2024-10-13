import React from 'react';
import '../styles/Resources.css';

function Resources() {
  return (
    <div className="resources-page">
      <h1>SQE Preparation Resources</h1>
      
      <section className="resource-section">
        <h2>Official SQE Information</h2>
        <ul>
          <li><a href="https://sqe.sra.org.uk/" target="_blank" rel="noopener noreferrer">SQE Official Website</a> - Official information about the SQE from the Solicitors Regulation Authority.</li>
          <li><a href="https://www.sra.org.uk/become-solicitor/sqe/" target="_blank" rel="noopener noreferrer">SRA - Qualifying as a Solicitor</a> - Comprehensive guide on the qualification process.</li>
        </ul>
      </section>
      
      <section className="resource-section">
        <h2>Study Materials</h2>
        <ul>
          <li><strong>SQE-Easy Practice Questions</strong> - Our curated collection of practice questions to help you prepare for the SQE.</li>
          <li><a href="https://www.lawsociety.org.uk/career-advice/becoming-a-solicitor/sqe/" target="_blank" rel="noopener noreferrer">The Law Society - SQE Resources</a> - Guidance and resources from The Law Society.</li>
          <li><a href="https://www.barbri.com/sqe/" target="_blank" rel="noopener noreferrer">BARBRI SQE Prep</a> - Comprehensive SQE preparation courses.</li>
        </ul>
      </section>
      
      <section className="resource-section">
        <h2>Legal Research Tools</h2>
        <ul>
          <li><a href="https://www.legislation.gov.uk/" target="_blank" rel="noopener noreferrer">legislation.gov.uk</a> - Official home of UK legislation.</li>
          <li><a href="https://www.bailii.org/" target="_blank" rel="noopener noreferrer">BAILII</a> - Free access to British and Irish case law and legislation.</li>
          <li><a href="https://www.lawgazette.co.uk/" target="_blank" rel="noopener noreferrer">The Law Society Gazette</a> - Latest legal news and features.</li>
        </ul>
      </section>
      
      <section className="resource-section">
        <h2>Professional Development</h2>
        <ul>
          <li><a href="https://communities.lawsociety.org.uk/" target="_blank" rel="noopener noreferrer">Law Society Communities</a> - Network with other legal professionals.</li>
          <li><a href="https://www.lawcareers.net/" target="_blank" rel="noopener noreferrer">LawCareers.Net</a> - Career advice and job opportunities for aspiring solicitors.</li>
        </ul>
      </section>
      
      <section className="resource-section">
        <h2>SQE-Easy Tools</h2>
        <ul>
          <li><strong>Practice Exams</strong> - Take our simulated SQE exams to test your knowledge and exam readiness.</li>
          <li><strong>Flashcards</strong> - Use our digital flashcards to reinforce key legal concepts.</li>
          <li><strong>Progress Tracker</strong> - Monitor your study progress and identify areas for improvement.</li>
        </ul>
      </section>
      
      <section className="resource-section">
        <h2>Additional Reading</h2>
        <ul>
          <li><a href="https://www.amazon.co.uk/Complete-Guide-SQE-Assessment-Success/dp/1913226638" target="_blank" rel="noopener noreferrer">The Complete Guide to the SQE</a> by Rosie Gunn - Comprehensive guide to the SQE assessment.</li>
          <li><a href="https://www.amazon.co.uk/English-Legal-System-2023-24/dp/0198871651" target="_blank" rel="noopener noreferrer">English Legal System</a> by Steve Wilson - Essential reading for understanding the UK legal system.</li>
        </ul>
      </section>
      
      <p className="disclaimer">Disclaimer: External links are provided for informational purposes only. SQE-Easy is not responsible for the content of external websites.</p>
    </div>
  );
}

export default Resources;