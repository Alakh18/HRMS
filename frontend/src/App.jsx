import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './utils/ProtectedRoute';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Notifications from './pages/Notifications';

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignIn />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {isAdmin() ? <AdminDashboard /> : <EmployeeDashboard />}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <Leave />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <Payroll />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;

