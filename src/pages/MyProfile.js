import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MyProfile.css';

class AccountManager {
  constructor(user) {
    this.user = user;
  }

  extendSubscription(duration) {
    return `Subscription extended by ${duration} days`;
  }

  cancelSubscription() {
    return this.user.subscriptionType === 'business-commercial-law'
      ? 'Subscription cancelled'
      : 'Cancellation only available for Business and Commercial Law module';
  }

  logout() {
    return 'User logged out';
  }

  changeCardDetails(newCardInfo) {
    return 'Card details updated';
  }

  updateProfile(newInfo) {
    return 'Profile updated';
  }

  viewBillingHistory() {
    return 'Displaying billing history';
  }
}

function MyProfile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    studyStage: 'Preparing for SQE',
    subscriptionType: 'business-commercial-law'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [accountManager, setAccountManager] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setAccountManager(new AccountManager(user));
  }, [user]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = accountManager.updateProfile(user);
    setMessage(result);
    setIsEditing(false);
  };

  const handleAction = (action, ...args) => {
    if (accountManager) {
      const result = accountManager[action](...args);
      setMessage(result);
    }
  };

  return (
    <div className="my-profile">
      <h1>My Profile</h1>
      <section className="user-info">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="studyStage">Study Stage:</label>
              <select
                id="studyStage"
                name="studyStage"
                value={user.studyStage}
                onChange={handleChange}
                required
              >
                <option value="Preparing for SQE">Preparing for SQE</option>
                <option value="Studying for FLK1">Studying for FLK1</option>
                <option value="Studying for FLK2">Studying for FLK2</option>
                <option value="Completed FLK1">Completed FLK1</option>
                <option value="Completed FLK2">Completed FLK2</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Study Stage:</strong> {user.studyStage}</p>
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
          </>
        )}
      </section>
      <section className="account-management">
        <h2>Account Management</h2>
        <button onClick={() => handleAction('extendSubscription', 30)} className="btn btn-primary">Extend Subscription</button>
        <button onClick={() => handleAction('changeCardDetails', { cardNumber: '1234567890123456', expiryDate: '12/25' })} className="btn btn-primary">Change Card Details</button>
        <button onClick={() => handleAction('viewBillingHistory')} className="btn btn-primary">View Billing History</button>
        <button onClick={() => handleAction('logout')} className="btn btn-secondary">Log Out</button>
        {message && <p className="message">{message}</p>}
      </section>
      <section className="dashboard">
        <h2>Dashboard</h2>
        <Link to="/dashboard" className="btn btn-primary" id="explore-progress-btn">
          Explore Your Progress
        </Link>
      </section>
    </div>
  );
}

export default MyProfile;