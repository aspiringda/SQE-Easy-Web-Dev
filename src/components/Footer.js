import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/" id="footer-home">Home</Link></li>
            <li><Link to="/about" id="footer-about">About Us</Link></li>
            <li><Link to="/products" id="footer-modes">Study Modes</Link></li>
            <li><Link to="/subscriptions" id="footer-subscriptions">Subscriptions</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: <a href="mailto:info@sqe-easy.com" id="footer-email">info@sqe-easy.com</a></p>
          <p>Phone: <a href="tel:+441234567890" id="footer-phone">+44 123 456 7890</a></p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" id="social-facebook">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" id="social-twitter">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" id="social-linkedin">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 SQE-Easy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;