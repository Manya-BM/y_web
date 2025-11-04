import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaUsers, FaChartLine, FaRocket } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page fade-in">
      {/* Hero Section with Gradient */}
      <div className="gradient-bg text-white p-5 rounded-4 mb-5 position-relative" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <div className="position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-3 fw-bold mb-4 slide-in-left">
            <span className="text-gradient" style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Y-Ultimate Management System
            </span>
          </h1>
          <p className="lead fs-4 mb-4 slide-in-right" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
            A unified platform for managing tournaments and coaching programmes for children from under-resourced communities.
          </p>
          <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />
          <p className="mb-4 fs-5" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Y-Ultimate teaches life skills through Ultimate Frisbee to children from under-resourced communities.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/tournaments" className="btn btn-light btn-lg px-4 py-3 btn-modern hover-scale" style={{ borderRadius: '12px', fontWeight: '600' }}>
              <FaTrophy className="me-2" /> View Tournaments
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3 btn-modern hover-scale" style={{ borderRadius: '12px', fontWeight: '600', borderWidth: '2px' }}>
              <FaRocket className="me-2" /> Join Us
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards with Animation */}
      <div className="row mt-5 g-4">
        <div className="col-md-4 mb-4 stagger-item">
          <div className="modern-card h-100 p-4 hover-scale" style={{ position: 'relative' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-gradient rounded-circle p-3 me-3 float-animation" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTrophy style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <h5 className="card-title mb-0 fw-bold">Tournament Management</h5>
            </div>
            <p className="card-text text-muted">
              Create and manage tournaments, register teams, schedule matches, and track live scores and spirit points.
            </p>
          </div>
        </div>
        
        <div className="col-md-4 mb-4 stagger-item">
          <div className="modern-card h-100 p-4 hover-scale" style={{ position: 'relative' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-gradient rounded-circle p-3 me-3 float-animation" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '0.5s' }}>
                <FaUsers style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <h5 className="card-title mb-0 fw-bold">Coaching Programme</h5>
            </div>
            <p className="card-text text-muted">
              Track child profiles, attendance, life skills assessments, and coach workload in one centralized system.
            </p>
          </div>
        </div>
        
        <div className="col-md-4 mb-4 stagger-item">
          <div className="modern-card h-100 p-4 hover-scale" style={{ position: 'relative' }}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-warning bg-gradient rounded-circle p-3 me-3 float-animation" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', animationDelay: '1s' }}>
                <FaChartLine style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <h5 className="card-title mb-0 fw-bold">Real-Time Updates</h5>
            </div>
            <p className="card-text text-muted">
              Get live score updates, announcements, and engage with photos and spirit leaderboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;