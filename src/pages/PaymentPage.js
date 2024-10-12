import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentPage.css';

function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentType, setPaymentType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get payment details from the location state
    // This assumes you're passing data when redirecting to this page
    const { amount, type } = location.state || {};
    if (amount && type) {
      setTotalAmount(amount);
      setPaymentType(type);
    } else {
      // Redirect back if no payment details are provided
      navigate('/subscriptions');
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically integrate with a payment gateway
    // For this example, we'll just log the details and show a success message
    console.log('Payment submitted:', paymentDetails);
    console.log('Amount:', totalAmount);
    console.log('Type:', paymentType);
    
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment successful!');
      navigate('/dashboard'); // Redirect to dashboard or confirmation page
    }, 1500);
  };

  return (
    <div className="payment-page">
      <h1>Payment Details</h1>
      <p>Total Amount: £{totalAmount}</p>
      <p>Payment for: {paymentType}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Cardholder Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={paymentDetails.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            required
            maxLength="16"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={paymentDetails.expiryDate}
              onChange={handleInputChange}
              required
              placeholder="MM/YY"
              maxLength="5"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handleInputChange}
              required
              maxLength="3"
            />
          </div>
        </div>
        <button type="submit" className="payment-button">Make Payment</button>
      </form>
    </div>
  );
}

export default PaymentPage;