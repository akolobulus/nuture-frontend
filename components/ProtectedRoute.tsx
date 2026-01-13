import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('nuture_user_session');

  if (!isLoggedIn) {
    // Redirect them to the /sign-in page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
