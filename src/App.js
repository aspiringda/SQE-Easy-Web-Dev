import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import Header from './components/Header';
import Footer from './components/Footer';
import BecomingSolicitor from './pages/BecomingSolicitor';
import Resources from './pages/Resources';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import RevisionMode from './pages/RevisionMode';
import PracticeMode from './pages/PracticeMode';
import ExamMode from './pages/ExamMode';
import ContactUs from './pages/ContactUs';
import MyProfile from './pages/MyProfile';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import './pages/DashboardRing';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/becoming-solicitor" element={<BecomingSolicitor />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/revision" element={<RevisionMode />} />
          <Route path="/practice" element={<PracticeMode />} /> 
          <Route path="/exam" element={<ExamMode />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;