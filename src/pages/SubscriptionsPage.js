import React, { useState } from 'react';
import '../styles/Subscriptions.css';

function Subscriptions() {
  const [mockCount, setMockCount] = useState(1);
  const [flk1Count, setFlk1Count] = useState(0);
  const [flk2Count, setFlk2Count] = useState(0);

  const handleSubscribe = (plan, duration, price) => {
    // TODO: Implement subscription logic
    console.log(`Subscribing to ${plan} for ${duration} months at £${price}`);
  };

  const handleMockPurchase = (count, price) => {
    // TODO: Implement mock exam purchase logic
    console.log(`Purchasing ${count} mock exams for £${price}`);
  };

  const handleCustomMockPurchase = () => {
    const totalCount = flk1Count + flk2Count;
    const price = totalCount * 45;
    // TODO: Implement custom mock exam purchase logic
    console.log(`Purchasing ${flk1Count} FLK1 and ${flk2Count} FLK2 mock exams for £${price}`);
  };

  return (
    <div className="subscriptions">
      <h1>Subscription Plans</h1>
      
      <section className="combined-plans">
        <h2>Combined FLK1 & FLK2 Plans</h2>
        <div className="plan-card">
          <h3>3 Months Plan</h3>
          <p>£975</p>
          <ul>
            <li>Access to all modes</li>
            <li>10 mock exams</li>
          </ul>
          <button id="subscribe-3-months-combined" onClick={() => handleSubscribe('Combined', 3, 975)}>Subscribe</button>
        </div>
        <div className="plan-card">
          <h3>6 Months Plan</h3>
          <p>£1750</p>
          <ul>
            <li>Access to all modes</li>
            <li>15 mock exams</li>
          </ul>
          <button id="subscribe-6-months-combined" onClick={() => handleSubscribe('Combined', 6, 1750)}>Subscribe</button>
        </div>
      </section>

      <section className="flk1-plans">
        <h2>FLK1 Plans</h2>
        <div className="plan-card">
          <h3>3 Months Plan</h3>
          <p>£635</p>
          <ul>
            <li>Access to all FLK1 modes</li>
            <li>5 FLK1 mock exams</li>
          </ul>
          <button id="subscribe-3-months-flk1" onClick={() => handleSubscribe('FLK1', 3, 635)}>Subscribe</button>
        </div>
        <div className="plan-card">
          <h3>6 Months Plan</h3>
          <p>£1150</p>
          <ul>
            <li>Access to all FLK1 modes</li>
            <li>10 FLK1 mock exams</li>
          </ul>
          <button id="subscribe-6-months-flk1" onClick={() => handleSubscribe('FLK1', 6, 1150)}>Subscribe</button>
        </div>
      </section>

      <section className="flk2-plans">
        <h2>FLK2 Plans</h2>
        <div className="plan-card">
          <h3>3 Months Plan</h3>
          <p>£635</p>
          <ul>
            <li>Access to all FLK2 modes</li>
            <li>5 FLK2 mock exams</li>
          </ul>
          <button id="subscribe-3-months-flk2" onClick={() => handleSubscribe('FLK2', 3, 635)}>Subscribe</button>
        </div>
        <div className="plan-card">
          <h3>6 Months Plan</h3>
          <p>£1150</p>
          <ul>
            <li>Access to all FLK2 modes</li>
            <li>10 FLK2 mock exams</li>
          </ul>
          <button id="subscribe-6-months-flk2" onClick={() => handleSubscribe('FLK2', 6, 1150)}>Subscribe</button>
        </div>
      </section>

      <section className="mock-exams">
        <h2>Mock Exam Packages</h2>
        <div className="mock-package">
          <h3>Single Mock Exam</h3>
          <p>£45</p>
          <button id="purchase-single-mock" onClick={() => handleMockPurchase(1, 45)}>Purchase</button>
        </div>
        <div className="mock-package">
          <h3>5 Mock Exams</h3>
          <p>£220</p>
          <button id="purchase-5-mocks" onClick={() => handleMockPurchase(5, 220)}>Purchase</button>
        </div>
        <div className="mock-package">
          <h3>10 Mock Exams</h3>
          <p>£400</p>
          <button id="purchase-10-mocks" onClick={() => handleMockPurchase(10, 400)}>Purchase</button>
        </div>
        <div className="custom-mock-package">
          <h3>Custom Mock Exam Package</h3>
          <div className="mock-selector">
            <label htmlFor="flk1-count">FLK1 Mocks:</label>
            <input 
              id="flk1-count"
              type="number" 
              value={flk1Count} 
              onChange={(e) => setFlk1Count(Math.max(0, parseInt(e.target.value) || 0))} 
              min="0"
            />
            <label htmlFor="flk2-count">FLK2 Mocks:</label>
            <input 
              id="flk2-count"
              type="number" 
              value={flk2Count} 
              onChange={(e) => setFlk2Count(Math.max(0, parseInt(e.target.value) || 0))} 
              min="0"
            />
          </div>
          <p>Total: £{(flk1Count + flk2Count) * 45}</p>
          <button id="purchase-custom-mocks" onClick={handleCustomMockPurchase}>Purchase Custom Package</button>
        </div>
      </section>
    </div>
  );
}

export default Subscriptions;