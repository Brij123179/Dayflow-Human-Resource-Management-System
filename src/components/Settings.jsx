import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock, 
  Globe, 
  Moon,
  Save,
  Mail,
  Phone,
  Building,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import './Settings.css';

const Settings = () => {
  const { currentUser, login } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    department: currentUser?.department || '',
    position: currentUser?.position || '',
    bio: currentUser?.bio || ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    leaveUpdates: true,
    payrollAlerts: true,
    announcementAlerts: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timeFormat: '12h',
    dateFormat: 'MM/DD/YYYY'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await apiRequest('/api/settings');
      setNotificationSettings({
        emailNotifications: Boolean(settings.emailNotifications),
        pushNotifications: Boolean(settings.pushNotifications),
        leaveUpdates: Boolean(settings.leaveUpdates),
        payrollAlerts: Boolean(settings.payrollAlerts),
        announcementAlerts: Boolean(settings.announcementAlerts)
      });
      setPreferences({
        theme: settings.theme || 'dark',
        language: settings.language || 'en',
        timeFormat: settings.timeFormat || '12h',
        dateFormat: settings.dateFormat || 'MM/DD/YYYY'
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await apiRequest('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
      login(updatedUser.role, updatedUser);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    setLoading(true);
    try {
      await apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({
          ...notificationSettings,
          ...preferences
        })
      });
      showMessage('success', 'Notification preferences saved!');
    } catch (error) {
      showMessage('error', error.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setLoading(true);
    try {
      await apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({
          ...notificationSettings,
          ...preferences
        })
      });
      showMessage('success', 'Preferences saved!');
    } catch (error) {
      showMessage('error', error.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await apiRequest('/api/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      showMessage('success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="settings-container">
      <motion.div
        className="settings-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>
          <SettingsIcon className="header-icon" />
          Settings
        </h1>
        <p>Manage your account preferences and settings</p>
      </motion.div>

      <div className="settings-content">
        {/* Tabs */}
        <motion.div 
          className="settings-tabs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
              >
                <Icon size={20} />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          className="settings-panel"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <p className="section-description">Update your personal information</p>

              {message.text && (
                <motion.div
                  className={`message-banner ${message.type}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{message.text}</span>
                </motion.div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Building size={18} />
                    Department
                  </label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button className="save-btn" onClick={handleProfileSave} disabled={loading}>
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="section-description">Manage how you receive notifications</p>

              {message.text && (
                <motion.div
                  className={`message-banner ${message.type}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{message.text}</span>
                </motion.div>
              )}

              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <h3>Email Notifications</h3>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <h3>Push Notifications</h3>
                    <p>Receive push notifications in browser</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: e.target.checked
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <h3>Leave Updates</h3>
                    <p>Get notified about leave request status</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.leaveUpdates}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        leaveUpdates: e.target.checked
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <h3>Payroll Alerts</h3>
                    <p>Notifications about salary and payroll</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.payrollAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        payrollAlerts: e.target.checked
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <h3>Announcement Alerts</h3>
                    <p>Company-wide announcements and updates</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.announcementAlerts}
                      onChange={(e) => setNotificationSettings({
                        ...notificationSettings,
                        announcementAlerts: e.target.checked
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <button className="save-btn" onClick={handleNotificationSave} disabled={loading}>
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>Application Preferences</h2>
              <p className="section-description">Customize your application experience</p>

              {message.text && (
                <motion.div
                  className={`message-banner ${message.type}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{message.text}</span>
                </motion.div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <Moon size={18} />
                    Theme
                  </label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <Globe size={18} />
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Time Format</label>
                  <select
                    value={preferences.timeFormat}
                    onChange={(e) => setPreferences({...preferences, timeFormat: e.target.value})}
                  >
                    <option value="12h">12 Hour</option>
                    <option value="24h">24 Hour</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date Format</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <button className="save-btn" onClick={handlePreferencesSave} disabled={loading}>
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <p className="section-description">Manage your password and security options</p>

              {message.text && (
                <motion.div
                  className={`message-banner ${message.type}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{message.text}</span>
                </motion.div>
              )}

              <div className="security-options">
                <div className="security-card">
                  <Lock size={32} />
                  <h3>Change Password</h3>
                  <p>Update your password to keep your account secure</p>
                  <button className="action-btn" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                </div>

                <div className="security-card">
                  <Lock size={32} />
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  <button className="action-btn" disabled>Coming Soon</button>
                </div>

                <div className="security-card">
                  <Lock size={32} />
                  <h3>Active Sessions</h3>
                  <p>View and manage your active login sessions</p>
                  <button className="action-btn" disabled>Coming Soon</button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(26, 26, 46, 0.98)',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>Change Password</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  className="save-btn"
                  onClick={handlePasswordChange}
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  className="action-btn"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
