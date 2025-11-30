import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Staff from './pages/Staff';
import Departments from './pages/Departments';
import Leave from './pages/Leave';
import Reports from './pages/Reports';
import Patients from './pages/Patients';
import Emergency from './pages/Emergency';
import Integrations from './pages/Integrations';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
