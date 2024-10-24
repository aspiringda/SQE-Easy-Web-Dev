import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubscriptionDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, duration, price, count } = location.state || {};
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    // Replace this with your actual authentication check
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  };

  const getFeatures = () => {
    switch (plan) {
      case 'FLK1':
      case 'FLK2':
        return [
          `Access to all ${plan} modes`,
          `${duration === 3 ? 5 : duration === 6 ? 10 : 15} ${plan} mock exams`,
          'Personalized study plan',
          'Progress tracking',
          'Mobile app access',
        ];
      case 'Combined':
        return [
          'Access to all modes - FLK1 and FLK2',
          `${duration === 3 ? 10 : duration === 6 ? 15 : 20} mock exams - FLK1 and FLK2`,
          'Comprehensive study materials',
          'Priority support',
          'Performance analytics',
        ];
      case 'Business Module':
        return [
          'Access to all Q&A for Business & Commercial Law Module',
          'Access to all modes for Business & Commercial Law Module',
          'Targeted practice questions',
          'Expert-curated content',
        ];
      case 'Free Sample':
        return [
          '20 Q&A cards - FLK1 and FLK2',
          '60 MCQ mock exam',
          'Limited time access',
        ];
      case 'Mock Exam':
        return [
          `${count} mock exam${count > 1 ? 's' : ''}`,
          'Realistic exam simulation',
          'Detailed performance analysis',
          `${count === 1 ? '1 Month' : 'Subscription duration'} access`,
        ];
      default:
        return ['Details not available'];
    }
  };

  const handleContinue = () => {
    if (!isLoggedIn) {
      navigate('/signup', { state: { returnTo: '/payment', planDetails: { plan, duration, price, count } } });
    } else {
      navigate('/payment', { state: { amount: price, type: getSubscriptionType() } });
    }
  };

  const handleBack = () => {
    navigate('/subscriptions');
  };

  const getSubscriptionType = () => {
    if (plan === 'Mock Exam') {
      return `${count} mock exam${count > 1 ? 's' : ''}`;
    } else if (plan === 'Free Sample') {
      return 'Free Sample subscription';
    } else {
      return `${plan} ${duration} months subscription`;
    }
  };

  const handleFeatureClick = (feature) => {
    console.log(`Feature clicked: ${feature}`);
    // You can add more logic here, like opening a modal with more details
  };

  const handleAdditionalBenefitClick = (benefit) => {
    console.log(`Additional benefit clicked: ${benefit}`);
    // You can add more logic here, like opening a modal with more details
  };

  if (!plan || (!duration && plan !== 'Mock Exam' && plan !== 'Free Sample') || !price) {
    return <div>No subscription details available. Please select a plan.</div>;
  }

  return (
    <div className="subscription-details-page">
      <h1>{plan} Details</h1>
      <div className="details-container">
        <h2>Plan Summary</h2>
        {plan !== 'Mock Exam' && plan !== 'Free Sample' && (
          <p><strong>Duration:</strong> {duration} months</p>
        )}
        {plan === 'Mock Exam' && (
          <p><strong>Quantity:</strong> {count} exam{count > 1 ? 's' : ''}</p>
        )}
        <p><strong>Price:</strong> £{price}</p>
        
        <h2>What's Included</h2>
        <ul>
          {getFeatures().map((feature, index) => (
            <li key={index}>
              <button 
                id={`feature-${index}`}
                onClick={() => handleFeatureClick(feature)}
              >
                {feature}
              </button>
            </li>
          ))}
        </ul>
        
        <h2>Additional Benefits</h2>
        <ul>
          {['24/7 access to online materials', 'Regular content updates', 'Community forum access'].map((benefit, index) => (
            <li key={index}>
              <button 
                id={`benefit-${index}`}
                onClick={() => handleAdditionalBenefitClick(benefit)}
              >
                {benefit}
              </button>
            </li>
          ))}
        </ul>
        
        <div className="action-buttons">
          <button 
            id="back-to-plans-btn"
            onClick={handleBack} 
            className="back-button"
          >
            Back to Plans
          </button>
          <button 
            id="continue-btn"
            onClick={handleContinue} 
            className="continue-button"
          >
            {isLoggedIn ? 'Continue to Payment' : 'Sign up & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsPage;