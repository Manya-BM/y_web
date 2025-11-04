import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requireRole }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  
  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Check if specific role is required
  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return children;
};

export default PrivateRoute;