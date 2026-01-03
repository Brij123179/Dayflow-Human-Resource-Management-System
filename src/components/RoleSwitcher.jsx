import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './RoleSwitcher.css';

const RoleSwitcher = () => {
  const { currentUser, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { id: 'admin', name: 'Admin', icon: '👑', color: '#f59e0b' },
    { id: 'hr', name: 'HR Officer', icon: '👨‍💼', color: '#3b82f6' },
    { id: 'employee', name: 'Employee', icon: '👤', color: '#10b981' }
  ];

  const currentRole = roles.find(r => r.id === currentUser.role);

  const handleRoleSwitch = (roleId) => {
    switchRole(roleId);
    setIsOpen(false);
  };

  return (
    <div className="role-switcher">
      <motion.button
        className="role-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="role-icon" style={{ background: currentRole.color }}>
          {currentRole.icon}
        </span>
        <div className="role-info">
          <span className="role-label">Role</span>
          <span className="role-name">{currentRole.name}</span>
        </div>
        <span className="toggle-arrow">{isOpen ? '▲' : '▼'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="role-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {roles.map((role) => (
              <motion.button
                key={role.id}
                className={`role-option ${currentUser.role === role.id ? 'active' : ''}`}
                onClick={() => handleRoleSwitch(role.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="role-option-icon" style={{ background: role.color }}>
                  {role.icon}
                </span>
                <span className="role-option-name">{role.name}</span>
                {currentUser.role === role.id && (
                  <span className="active-check">✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
