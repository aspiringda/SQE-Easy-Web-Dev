import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/" id="logo-link">
            <img src={logo} alt="SQE-Easy Logo" />
          </Link>
        </div>
        <ul className="main-nav">
          <li><Link to="/" id="nav-home">Home</Link></li>
          <li><Link to="/about" id="nav-about">About Us</Link></li>
          <li><Link to="/products" id="nav-modes">Products</Link></li>
          <li><Link to="/subscriptions" id="nav-subscriptions">Subscriptions</Link></li>
          <li><Link to="/contact" id="nav-contact">Contact Us</Link></li>
          <li><Link to="/profile" id="nav-profile">My profile</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;