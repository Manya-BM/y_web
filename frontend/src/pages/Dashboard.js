import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaChalkboardTeacher, FaChartBar, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard fade-in">
      <div className="mb-4">
        <h1 className="mb-2 text-gradient">Welcome, {user?.name || 'User'}!</h1>
        <p className="text-muted mb-4">
          <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.9rem' }}>
            <FaUser className="me-2" /> {user?.role?.toUpperCase() || 'USER'}
          </span>
        </p>
      </div>
      
      <div className="row g-4">
        <div className="col-md-4 stagger-item">
          <div className="modern-card h-100 p-4 hover-scale">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-gradient rounded-circle p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaTrophy style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <h5 className="card-title mb-0 fw-bold">Tournaments</h5>
            </div>
            <p className="card-text text-muted mb-3">Manage tournaments, teams, and matches.</p>
            <Link to="/tournaments" className="btn btn-primary btn-modern">
              <FaTrophy className="me-2" /> View Tournaments
            </Link>
          </div>
        </div>
        
        {(user?.role === 'tournament_director' || user?.role === 'team_manager') && (
          <div className="col-md-4 stagger-item">
            <div className="modern-card h-100 p-4 hover-scale">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-gradient rounded-circle p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaChalkboardTeacher style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <h5 className="card-title mb-0 fw-bold">Coaching Programme</h5>
              </div>
              <p className="card-text text-muted mb-3">Manage children profiles, attendance, and LSAS assessments.</p>
              <Link to="/coaching" className="btn btn-success btn-modern">
                <FaChalkboardTeacher className="me-2" /> View Coaching
              </Link>
            </div>
          </div>
        )}

        {user?.role === 'tournament_director' && (
          <div className="col-md-4 stagger-item">
            <div className="modern-card h-100 p-4 hover-scale">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning bg-gradient rounded-circle p-3 me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaChartBar style={{ fontSize: '24px', color: 'white' }} />
                </div>
                <h5 className="card-title mb-0 fw-bold">Analytics</h5>
              </div>
              <p className="card-text text-muted mb-3">View reports and analytics on tournaments and coaching.</p>
              <Link to="/analytics" className="btn btn-warning btn-modern">
                <FaChartBar className="me-2" /> View Analytics
              </Link>
            </div>
          </div>
        )}

        {(user?.role !== 'tournament_director' && user?.role !== 'team_manager') && (
          <div className="col-md-12 stagger-item">
            <div className="alert alert-info modern-card" style={{ borderLeft: '4px solid #0dcaf0' }}>
              <h6 className="alert-heading fw-bold">Coaching Dashboard Access</h6>
              <p className="mb-0">
                The Coaching Dashboard is available for <strong>Tournament Director</strong> and <strong>Team Manager</strong> roles only.
                Your current role is <strong>{user?.role}</strong>.
                To access coaching features, please contact an administrator to update your role.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-5 fade-in">
        <h2 className="mb-4 text-gradient">Recent Activity</h2>
        <div className="list-group">
          <div className="list-group-item modern-card mb-3 hover-scale" style={{ border: 'none' }}>
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-bold">Summer Tournament 2023</h5>
                <p className="mb-1 text-muted">Registration is now open for the Summer Tournament.</p>
              </div>
              <span className="badge bg-primary">3 days ago</span>
            </div>
          </div>
          <div className="list-group-item modern-card hover-scale" style={{ border: 'none' }}>
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-bold">New Coaching Session</h5>
                <p className="mb-1 text-muted">New coaching session scheduled for next Monday.</p>
              </div>
              <span className="badge bg-success">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;