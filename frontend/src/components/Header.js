import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTrophy, FaChalkboardTeacher, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const onLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '1rem 0'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{ fontSize: '1.5rem' }}>
          <FaTrophy className="me-2 icon-bounce" /> Y-Ultimate
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ border: 'none' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center hover-scale" to="/" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center hover-scale" to="/tournaments" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <FaTrophy className="me-2" /> Tournaments
              </Link>
            </li>
            {user && (user.role === 'admin' || user.role === 'coach') && (
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center hover-scale" to="/coaching" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                  <FaChalkboardTeacher className="me-2" /> Coaching
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav d-flex align-items-center">
            {user ? (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link d-flex align-items-center hover-scale" to="/dashboard" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <FaUser className="me-2" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm d-flex align-items-center hover-scale" 
                    onClick={onLogout}
                    style={{ borderRadius: '8px', borderWidth: '2px' }}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link d-flex align-items-center hover-scale" to="/login" style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <FaSignInAlt className="me-2" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light btn-sm d-flex align-items-center hover-scale" to="/register" style={{ borderRadius: '8px' }}>
                    <FaUserPlus className="me-2" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;