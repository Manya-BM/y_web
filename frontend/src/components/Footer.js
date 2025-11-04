import React from 'react';
import { FaHeart, FaTrophy, FaCircle } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-5" style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      color: 'white',
      padding: '2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="row text-center">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <FaTrophy className="me-2 icon-bounce" style={{ fontSize: '1.5rem', color: '#6366f1' }} />
              <h5 className="mb-0 fw-bold">Y-Ultimate Management System</h5>
            </div>
            <p className="mb-2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Teaching life skills through Ultimate Frisbee
            </p>
            <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} Y-Ultimate. Made with <FaHeart style={{ color: '#ef4444' }} /> for the community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;