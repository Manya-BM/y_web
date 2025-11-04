import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/users/login', {
        email,
        password,
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
        toast.success('Login successful!');
        setLoading(false);
        navigate('/dashboard');
      }
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="row justify-content-center fade-in">
      <div className="col-md-6 col-lg-5">
        <div className="modern-card p-4">
          <div className="text-center mb-4">
            <h2 className="text-gradient mb-2">Welcome Back!</h2>
            <p className="text-muted">Sign in to continue</p>
          </div>
          <form onSubmit={onSubmit}>
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
              <button type="submit" className="btn btn-primary w-100 btn-modern" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;