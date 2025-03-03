// src/components/ProtectedRoute.tsx
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface AuthPayload {
  mfa: boolean;
  userSlug: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    try {
      const decoded = jwtDecode<AuthPayload>(tokenFromUrl)
      if (decoded.userSlug){
        localStorage.setItem('userslug', decoded.userSlug)
      }
      if (!decoded.mfa) {
        return <Navigate to="/login" replace />;
      } 
    } catch (error) {
      console.error("Token decoding failed: ", error)
    }
    const newUrl = location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
