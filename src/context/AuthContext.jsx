import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const getDefaultAvatar = (role) => {
    const avatars = { admin: '👩‍💻', hr: '👨‍💼', employee: '👩‍💼' };
    return avatars[role] || '👤';
  };

  const getRolePosition = (role) => {
    const positions = { 
      admin: 'Administrator', 
      hr: 'HR Officer', 
      employee: 'Employee' 
    };
    return positions[role] || 'Employee';
  };

  const login = (role, userData) => {
    setCurrentUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: role,
      avatar: userData.avatar || getDefaultAvatar(role),
      department: userData.department,
      position: getRolePosition(role)
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role) => {
    // Keep the same user record but change their active role (demo-only helper)
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        role,
        avatar: prev.avatar || getDefaultAvatar(role),
        position: getRolePosition(role)
      };
    });
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    
    const permissions = {
      // Admin: Full system access
      admin: [
        'manage_employees',
        'view_all_employees',
        'edit_all_employees',
        'delete_employees',
        'approve_leave',
        'reject_leave',
        'view_all_attendance',
        'edit_attendance',
        'manage_attendance',
        'view_payroll',
        'manage_payroll',
        'manage_roles',
        'view_reports',
        'system_settings'
      ],
      // HR Officer: Employee management and approval privileges
      hr: [
        'manage_employees',
        'view_all_employees',
        'edit_all_employees',
        'approve_leave',
        'reject_leave',
        'view_all_attendance',
        'edit_attendance',
        'manage_attendance',
        'view_payroll',
        'view_reports'
      ],
      // Employee: Limited to personal data only
      employee: [
        'view_own_profile',
        'edit_own_profile',
        'view_own_attendance',
        'apply_leave',
        'view_leave_history',
        'view_own_salary',
        'view_leave_balance'
      ]
    };
    return permissions[currentUser.role]?.includes(permission) || false;
  };

  const isAdmin = currentUser?.role === 'admin';
  const isHR = currentUser?.role === 'hr' || currentUser?.role === 'admin';
  const isEmployee = currentUser?.role === 'employee';

  const value = {
    currentUser,
    login,
    logout,
    switchRole,
    hasPermission,
    isAdmin,
    isHR,
    isEmployee
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
