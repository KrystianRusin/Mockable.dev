import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Home from './pages/Home.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import LandingPage from './pages/LandingPage.tsx'
import Endpoints from './pages/Endpoints.tsx'
import Documentation from './pages/Documentation.tsx'
import SchemaValidator from './pages/SchemaValidator.tsx'
import AuthenticatedNavbar from './components/AuthenticatedNavbar.tsx'
import UnauthenticatedNavbar from './components/UnauthenticatedNavbar.tsx'

function App() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <>
                <AuthenticatedNavbar />
                <Home />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/validate-schema"
          element={
            <ProtectedRoute>
              <>
                <AuthenticatedNavbar />
                <SchemaValidator />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/endpoints"
          element={
            <ProtectedRoute>
              <>
                <AuthenticatedNavbar />
                <Endpoints />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/documentation"
          element={
            <ProtectedRoute>
              <>
                <AuthenticatedNavbar />
                <Documentation />
              </>
            </ProtectedRoute>
          }
        />

        {/* Routes Accessible Without Authentication */}
        <Route
          path="/landing"
          element={<UnauthenticatedNavbar />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
