import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Subscriptions.css';

  function Subscriptions() {
    const navigate = useNavigate();
  
    const handleSubscribe = (plan, duration, price) => {
      navigate('/payment', { state: { amount: price, type: `${plan} ${duration} months subscription` } });
    };
  
    const handleMockPurchase = (count, price) => {
      navigate('/payment', { state: { amount: price, type: `${count} mock exams` } });
  }
  
  return (
    <div className="subscriptions-page">
      <h1>Subscription Plans</h1>
      
      <div className="plans-container">
        <div className="plan-column">
          <h2>FLK1 & FLK2</h2>
          <div className="plan-card">
            <h3>3 Months Plan</h3>
            <p className="price">£975</p>
            <ul>
              <li>Access to all modes</li>
              <li>10 mock exams</li>
            </ul>
            <button onClick={() => handleSubscribe('Combined', 3, 975)}>Subscribe</button>
          </div>
          <div className="plan-card">
            <h3>6 Months Plan</h3>
            <p className="price">£1750</p>
            <ul>
              <li>Access to all modes</li>
              <li>15 mock exams</li>
            </ul>
            <button onClick={() => handleSubscribe('Combined', 6, 1750)}>Subscribe</button>
          </div>
        </div>

        <div className="plan-column">
          <h2>FLK1 Plans</h2>
          <div className="plan-card">
            <h3>3 Months Plan</h3>
            <p className="price">£635</p>
            <ul>
              <li>Access to all FLK1 modes</li>
              <li>5 FLK1 mock exams</li>
            </ul>
            <button onClick={() => handleSubscribe('FLK1', 3, 635)}>Subscribe</button>
          </div>
          <div className="plan-card">
            <h3>6 Months Plan</h3>
            <p className="price">£1150</p>
            <ul>
              <li>Access to all FLK1 modes</li>
              <li>10 FLK1 mock exams</li>
            </ul>
            <button onClick={() => handleSubscribe('FLK1', 6, 1150)}>Subscribe</button>
          </div>
        </div>

        <div className="plan-column">
          <h2>FLK2 Plans</h2>
          <div className="plan-card">
            <h3>3 Months Plan</h3>
            <p className="price">£635</p>
            <ul>
              <li>Access to all FLK2 modes</li>
              <li>5 FLK2 mock exams</li>
            </ul>
            <button onClick={() => handleSubscribe('FLK2', 3, 635)}>Subscribe</button>
          </div>
          <div className="plan-card">
            <h3>6 Months Plan</h3>
            <p className="price">£1150</p>
            <ul>
              <li>Access to all FLK2 modes</li>
              <li>10 FLK2 mock exams</li>
            </ul>
            <button onClick={() => handleSubscribe('FLK2', 6, 1150)}>Subscribe</button>
          </div>
        </div>

        <div className="plan-column">
          <h2>Mock Exam Packages</h2>
          <div className="plan-card mock-package">
            <h3>Single Mock Exam</h3>
            <p className="price">£45</p>
            <button onClick={() => handleMockPurchase(1, 45)}>Purchase</button>
          </div>
          <div className="plan-card mock-package">
            <h3>5 Mock Exams</h3>
            <p className="price">£220</p>
            <button onClick={() => handleMockPurchase(5, 220)}>Purchase</button>
          </div>
          <div className="plan-card mock-package">
            <h3>10 Mock Exams</h3>
            <p className="price">£400</p>
            <button onClick={() => handleMockPurchase(10, 400)}>Purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;