import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Settings, LogOut, Menu, X, Calendar, Clock, DollarSign, Bell, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { currentUser } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'leave', label: 'Leave Management', icon: Clock },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.button 
        className="sidebar-toggle"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {isOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}

      <motion.aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <motion.button 
          className="sidebar-close"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} />
        </motion.button>
        
        <div className="sidebar-header">
          <motion.div 
            className="logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="logo-icon">
              <motion.div 
                className="logo-circle"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="logo-gradient"></span>
              </motion.div>
            </div>
            <h1>DayFlow</h1>
          </motion.div>
          <p className="subtitle">HR Management</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => {
                  onViewChange(item.id);
                  setIsOpen(false);
                }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ x: 10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {activeView === item.id && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <motion.div 
          className="sidebar-footer"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <RoleSwitcher />
          <div className="user-profile">
            <motion.div 
              className="avatar"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <div className="avatar-emoji">{currentUser.avatar}</div>
            </motion.div>
            <div className="user-info">
              <h3>{currentUser.name}</h3>
              <p>{currentUser.email}</p>
            </div>
          </div>
          <motion.button 
            className="logout-btn"
            onClick={onLogout}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
          </motion.button>
        </motion.div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
