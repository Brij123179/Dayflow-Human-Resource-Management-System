import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  Settings,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { currentUser, isEmployee, isHR, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'alerts', 'emails'
  const [showSettings, setShowSettings] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    leaveRequests: true,
    approvals: true,
    attendanceAlerts: true,
    payrollUpdates: true,
    systemUpdates: false
  });

  useEffect(() => {
    generateNotifications();
  }, [currentUser, isEmployee]);

  const generateNotifications = () => {
    const baseNotifications = [
      {
        id: 1,
        type: 'email',
        category: 'approval',
        title: 'Leave Request Approved',
        message: 'Your leave request for Jan 15-17 has been approved.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: CheckCircle,
        iconColor: '#22c55e'
      },
      {
        id: 2,
        type: 'alert',
        category: 'attendance',
        title: 'Attendance Reminder',
        message: 'Don\'t forget to check in for today.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: AlertCircle,
        iconColor: '#f59e0b'
      },
      {
        id: 3,
        type: 'info',
        category: 'payroll',
        title: 'Payroll Processed',
        message: 'Your salary for December has been processed and will be credited on Jan 31.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: Info,
        iconColor: '#667eea'
      },
      {
        id: 4,
        type: 'email',
        category: 'system',
        title: 'Profile Update Required',
        message: 'Please update your emergency contact information.',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: Mail,
        iconColor: '#8b5cf6'
      },
    ];

    const hrNotifications = [
      {
        id: 5,
        type: 'alert',
        category: 'approval',
        title: 'Pending Leave Approvals',
        message: '3 leave requests are waiting for your approval.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: AlertCircle,
        iconColor: '#ef4444'
      },
      {
        id: 6,
        type: 'info',
        category: 'attendance',
        title: 'Attendance Summary',
        message: '2 employees are absent today.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: Info,
        iconColor: '#667eea'
      }
    ];

    if (isEmployee) {
      setNotifications(baseNotifications);
    } else {
      setNotifications([...hrNotifications, ...baseNotifications]);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.read);
    } else if (filter === 'alerts') {
      filtered = notifications.filter(n => n.type === 'alert');
    } else if (filter === 'emails') {
      filtered = notifications.filter(n => n.type === 'email');
    }
    
    return filtered;
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>
            <Bell className="header-icon" />
            Notifications
          </h1>
          <p>Stay updated with alerts and messages</p>
        </motion.div>
        
        <div className="header-actions">
          {unreadCount > 0 && (
            <motion.button
              className="mark-all-btn"
              onClick={markAllAsRead}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={18} />
              Mark all as read
            </motion.button>
          )}
          <motion.button
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={18} />
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <motion.div 
        className="notification-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Filter size={18} />
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'alerts' ? 'active' : ''}`}
          onClick={() => setFilter('alerts')}
        >
          Alerts
        </button>
        <button 
          className={`filter-btn ${filter === 'emails' ? 'active' : ''}`}
          onClick={() => setFilter('emails')}
        >
          Emails
        </button>
      </motion.div>

      {/* Notifications List */}
      <div className="notifications-list">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div 
                  className="notification-icon"
                  style={{ backgroundColor: `${notification.iconColor}20` }}
                >
                  <notification.icon 
                    size={24} 
                    style={{ color: notification.iconColor }}
                  />
                </div>
                
                <div className="notification-content">
                  <div className="notification-header-row">
                    <h3>{notification.title}</h3>
                    <span className="notification-time">
                      {getRelativeTime(notification.timestamp)}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                  <div className="notification-meta">
                    <span className={`notification-badge ${notification.type}`}>
                      {notification.type}
                    </span>
                    <span className="notification-category">
                      {notification.category}
                    </span>
                  </div>
                </div>

                <motion.button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>

                {!notification.read && (
                  <span className="unread-indicator"></span>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Bell size={64} />
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              className="settings-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  <Mail size={24} />
                  Email Notification Settings
                </h2>
                <button onClick={() => setShowSettings(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="settings-content">
                <p className="settings-description">
                  Choose which notifications you'd like to receive via email
                </p>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={emailSettings.leaveRequests}
                      onChange={(e) => setEmailSettings({...emailSettings, leaveRequests: e.target.checked})}
                    />
                    <span>Leave Request Updates</span>
                  </label>
                  <p>Get notified when your leave requests are approved or rejected</p>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={emailSettings.approvals}
                      onChange={(e) => setEmailSettings({...emailSettings, approvals: e.target.checked})}
                    />
                    <span>Approval Reminders</span>
                  </label>
                  <p>Receive reminders for pending approvals (HR/Admin only)</p>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={emailSettings.attendanceAlerts}
                      onChange={(e) => setEmailSettings({...emailSettings, attendanceAlerts: e.target.checked})}
                    />
                    <span>Attendance Alerts</span>
                  </label>
                  <p>Daily reminders to check in and attendance summaries</p>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={emailSettings.payrollUpdates}
                      onChange={(e) => setEmailSettings({...emailSettings, payrollUpdates: e.target.checked})}
                    />
                    <span>Payroll Updates</span>
                  </label>
                  <p>Get notified about salary processing and payslips</p>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={emailSettings.systemUpdates}
                      onChange={(e) => setEmailSettings({...emailSettings, systemUpdates: e.target.checked})}
                    />
                    <span>System Updates</span>
                  </label>
                  <p>Important system announcements and updates</p>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="save-settings-btn"
                  onClick={() => {
                    alert('Email settings saved!');
                    setShowSettings(false);
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
