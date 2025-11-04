import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'player'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, password2, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/users', {
        name,
        email,
        password,
        role,
      });

      if (response.data) {
        const user = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Registration successful!');
        setLoading(false);
        navigate('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="row justify-content-center fade-in">
      <div className="col-md-6 col-lg-5">
        <div className="modern-card p-4">
          <div className="text-center mb-4">
            <h2 className="text-gradient mb-2">Join Y-Ultimate</h2>
            <p className="text-muted">Create your account to get started</p>
          </div>
          <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={role}
                  onChange={onChange}
                >
                  <option value="player">Player</option>
                  <option value="team_manager">Team Manager</option>
                  <option value="field_official">Field Official</option>
                  <option value="spectator">Spectator</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-modern" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Register;