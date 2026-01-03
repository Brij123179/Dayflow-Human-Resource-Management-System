import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Preloader from './components/Preloader';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import Attendance from './components/Attendance';
import LeaveManagement from './components/LeaveManagement';
import PayrollManagement from './components/PayrollManagement';
import Notifications from './components/Notifications';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { currentUser, login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [authView, setAuthView] = useState('signin'); // 'signin' or 'signup'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const user = await res.json();
          login(user.role, user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Session validation error:', error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    checkSession();
  }, [login]);

  const handleViewChange = (view) => {
    setActiveView(view);
    setSelectedEmployee(null);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setActiveView('employee-detail');
  };

  const handleSignInSuccess = (user) => {
    login(user.role, user);
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleSignUpSuccess = () => {
    setAuthView('signin');
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .catch(() => {})
      .finally(() => {
        logout();
        setIsAuthenticated(false);
        setActiveView('dashboard');
      });
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" />
        ) : !isAuthenticated ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {authView === 'signin' ? (
              <SignIn
                onSignInSuccess={handleSignInSuccess}
                onSwitchToSignUp={() => setAuthView('signup')}
              />
            ) : (
              <SignUp
                onSignUpSuccess={handleSignUpSuccess}
                onSwitchToSignIn={() => setAuthView('signin')}
              />
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="app-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key="main"
          >
            <Sidebar 
              activeView={activeView} 
              onViewChange={handleViewChange}
              onLogout={handleLogout}
            />
            <div className="main-content">
              <AnimatePresence mode="wait">
                {activeView === 'dashboard' && (
                  <Dashboard key="dashboard" onViewChange={handleViewChange} />
                )}
                {activeView === 'employees' && (
                  <EmployeeList key="employees" onEmployeeSelect={handleEmployeeSelect} />
                )}
                {activeView === 'attendance' && (
                  <Attendance key="attendance" />
                )}
                {activeView === 'leave' && (
                  <LeaveManagement key="leave" />
                )}
                {activeView === 'payroll' && (
                  <PayrollManagement key="payroll" />
                )}
                {activeView === 'notifications' && (
                  <Notifications key="notifications" />
                )}
                {activeView === 'analytics' && (
                  <Analytics key="analytics" />
                )}
                {activeView === 'settings' && (
                  <Settings key="settings" />
                )}
                {activeView === 'employee-detail' && selectedEmployee && (
                  <EmployeeDetail key="employee-detail" employee={selectedEmployee} onBack={() => handleViewChange('employees')} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
