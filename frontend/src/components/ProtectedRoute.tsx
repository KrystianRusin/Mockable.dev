// src/components/ProtectedRoute.tsx
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface AuthPayload {
  mfa: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    const newUrl = location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<AuthPayload>(token);
    if (!decoded.mfa) {
      return <Navigate to="/login" replace />;
    } 
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
