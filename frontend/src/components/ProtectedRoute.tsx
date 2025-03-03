// src/components/ProtectedRoute.tsx
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';


interface AuthPayload {
  mfa: boolean;
  userSlug: string;
}

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get('token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    try {
      const decoded = jwtDecode<AuthPayload>(tokenFromUrl);
      if (decoded.userSlug) {
        localStorage.setItem('userSlug', decoded.userSlug);
      }
    } catch (error) {
      console.error("Token decoding failed: ", error)
    }
    const newUrl = location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
    const token = localStorage.getItem('token');
    if (token && !localStorage.getItem('userSlug')) {
      try {
        const decoded = jwtDecode<AuthPayload>(token);
        if (decoded.userSlug) {
          localStorage.setItem('userSlug', decoded.userSlug);
        } else {
          console.warn("No userSlug found in token from localStorage");
        }
      } catch (error) {
        console.error("Token decoding from localStorage failed: ", error);
      }
  }

  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
