import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Award, TrendingUp, Clock, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './EmployeeDetail.css';

const EmployeeDetail = ({ employee, onBack }) => {
  const { hasPermission, isEmployee } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    phone: employee.phone,
    email: employee.email,
    address: employee.location,
    position: employee.position,
    department: employee.department,
    salary: employee.salary || '$85,000',
  });

  const handleSave = () => {
    // In a real app, this would make an API call
    alert('Profile updated successfully!');
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedData({
      phone: employee.phone,
      email: employee.email,
      address: employee.location,
      position: employee.position,
      department: employee.department,
      salary: employee.salary || '$85,000',
    });
    setEditMode(false);
  };

  // Determine which fields can be edited
  const canEditField = (field) => {
    if (hasPermission('manage_employees')) return true; // Admin can edit all
    if (isEmployee) {
      // Employees can only edit limited fields
      return ['phone', 'email', 'address'].includes(field);
    }
    return false;
  };
  const skills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'];
  const projects = [
    { name: 'E-commerce Platform', status: 'Completed', completion: 100 },
    { name: 'Mobile App Redesign', status: 'In Progress', completion: 65 },
    { name: 'API Integration', status: 'In Progress', completion: 45 },
  ];

  const performance = [
    { label: 'Productivity', value: 92, color: '#6366f1' },
    { label: 'Quality', value: 88, color: '#8b5cf6' },
    { label: 'Collaboration', value: 95, color: '#ec4899' },
    { label: 'Innovation', value: 85, color: '#10b981' },
  ];

  return (
    <motion.div 
      className="employee-detail"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button 
        className="back-btn"
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ x: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} />
        Back to Employees
      </motion.button>

      <div className="detail-layout">
        <motion.div 
          className="profile-section glass-effect"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-header">
            <motion.div 
              className="profile-avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.avatar}`} 
                alt={employee.name} 
              />
              <span className={`status-indicator ${employee.status}`}></span>
            </motion.div>
            <motion.div 
              className="profile-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1>{employee.name}</h1>
              <p className="role">{employee.role}</p>
              <span className="department">{employee.department}</span>
              {!editMode && (
                <motion.button
                  className="edit-profile-btn"
                  onClick={() => setEditMode(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit size={16} />
                  Edit Profile
                </motion.button>
              )}
            </motion.div>
          </div>

          <motion.div 
            className="contact-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="contact-row">
              <Mail size={18} />
              {editMode && canEditField('email') ? (
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                  className="edit-input"
                />
              ) : (
                <span>{editMode ? editedData.email : employee.email}</span>
              )}
            </div>
            <div className="contact-row">
              <Phone size={18} />
              {editMode && canEditField('phone') ? (
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                  className="edit-input"
                />
              ) : (
                <span>{editMode ? editedData.phone : employee.phone}</span>
              )}
            </div>
            <div className="contact-row">
              <MapPin size={18} />
              {editMode && canEditField('address') ? (
                <input
                  type="text"
                  value={editedData.address}
                  onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                  className="edit-input"
                />
              ) : (
                <span>{editMode ? editedData.address : employee.location}</span>
              )}
            </div>
            <div className="contact-row">
              <Calendar size={18} />
              <span>Joined: Jan 15, 2020</span>
            </div>
            <div className="contact-row">
              <Briefcase size={18} />
              {editMode && canEditField('position') ? (
                <input
                  type="text"
                  value={editedData.position}
                  onChange={(e) => setEditedData({...editedData, position: e.target.value})}
                  className="edit-input"
                  disabled={!hasPermission('manage_employees')}
                />
              ) : (
                <span>{editMode ? editedData.position : employee.position}</span>
              )}
            </div>
          </motion.div>

          {editMode && (
            <motion.div 
              className="edit-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button className="save-btn" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
            </motion.div>
          )}

          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button 
              className="primary-btn"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} />
              Send Message
            </motion.button>
            <motion.button 
              className="secondary-btn"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={18} />
              Call
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="details-column">
          <motion.div 
            className="skills-section glass-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>
              <Award size={20} />
              Skills
            </h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <motion.span 
                  key={skill}
                  className="skill-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.4 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="projects-section glass-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>
              <Briefcase size={20} />
              Current Projects
            </h2>
            <div className="projects-list">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.name}
                  className="project-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${project.completion}%` }}
                      transition={{ delay: index * 0.1 + 0.7, duration: 0.8 }}
                    />
                  </div>
                  <span className="completion">{project.completion}% Complete</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="performance-section glass-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2>
              <TrendingUp size={20} />
              Performance Metrics
            </h2>
            <div className="metrics-list">
              {performance.map((metric, index) => (
                <motion.div 
                  key={metric.label}
                  className="metric-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                >
                  <div className="metric-header">
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-value">{metric.value}%</span>
                  </div>
                  <div className="metric-bar">
                    <motion.div 
                      className="metric-fill"
                      style={{ background: metric.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ delay: index * 0.1 + 0.8, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetail;
