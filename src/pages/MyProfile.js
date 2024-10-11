import React, { useState } from 'react';

function MyProfile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    studyStage: 'Preparing for SQE',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated user data to your backend
    console.log('Profile updated:', user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
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
        <button onClick={handleLogout} className="btn btn-secondary">Log Out</button>
        {/* Add more account management options here */}
      </section>
      <section className="study-progress">
        <h2>Study Progress</h2>
        {/* Add study progress information here */}
        <p>This section will display the user's study progress and statistics.</p>
      </section>
    </div>
  );
}

export default MyProfile;