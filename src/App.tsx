import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Staff from './pages/Staff';
import Departments from './pages/Departments';
import Leave from './pages/Leave';
import Reports from './pages/Reports';
import Patients from './pages/Patients';
import Emergency from './pages/Emergency';
import Chat from './pages/Chat';
import AIChat from './pages/AIChat';
import Integrations from './pages/Integrations';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amc-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amc-teal via-amc-blue to-amc-purple flex items-center justify-center animate-logo-glow">
            <span className="text-2xl font-extrabold text-white">A</span>
          </div>
          <div className="animate-spin w-6 h-6 border-2 border-amc-teal border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute requiredPermission="canViewSchedule">
                      <Schedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute requiredPermission="canViewAllStaff">
                      <Staff />
                    </ProtectedRoute>
                  }
                />
                <Route path="/departments" element={<Departments />} />
                <Route
                  path="/leave"
                  element={
                    <ProtectedRoute requiredPermission="canViewSchedule">
                      <Leave />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute requiredPermission="canViewReports">
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute requiredPermission="canViewPatients">
                      <Patients />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emergency"
                  element={
                    <ProtectedRoute requiredPermission="canViewEmergency">
                      <Emergency />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute requiredPermission="canViewChat">
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/integrations"
                  element={
                    <ProtectedRoute requiredPermission="canViewIntegrations">
                      <Integrations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compliance"
                  element={
                    <ProtectedRoute requiredPermission="canViewCompliance">
                      <Compliance />
                    </ProtectedRoute>
                  }
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
