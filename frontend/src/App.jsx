import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Courses from './pages/Courses/Courses';
import Content from './pages/Content/Content';
import Assessments from './pages/Assessment/Assessments';
import Progress from './pages/Progress/Progress';
import Reports from './pages/Reports/Reports';
import Notifications from './pages/Notifications/Notifications';
import SettingsPage from './pages/Admin/SettingsPage';

// Main Layout Wrapper
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading App...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout><Navigate to="/dashboard" replace /></MainLayout></ProtectedRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['Admin']}><MainLayout><Users /></MainLayout></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><MainLayout><Courses /></MainLayout></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute><MainLayout><Content /></MainLayout></ProtectedRoute>} />
        <Route path="/assessments" element={<ProtectedRoute><MainLayout><Assessments /></MainLayout></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><MainLayout><Progress /></MainLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><MainLayout><Reports /></MainLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><MainLayout><Notifications /></MainLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['Admin']}><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
