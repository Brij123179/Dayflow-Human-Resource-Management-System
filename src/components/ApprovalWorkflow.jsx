import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './ApprovalWorkflow.css';

const ApprovalWorkflow = () => {
  const { currentUser, isHR } = useAuth();
  
  const [pendingApprovals] = useState([
    {
      id: 1,
      type: 'Leave Request',
      employee: 'Emily Rodriguez',
      avatar: '👩‍💼',
      details: 'Vacation Leave: Jan 15-20 (6 days)',
      priority: 'medium',
      submittedOn: '2026-01-03',
      icon: '🏖️'
    },
    {
      id: 2,
      type: 'Time-Off Request',
      employee: 'Michael Chen',
      avatar: '👨‍🎨',
      details: 'Sick Leave: Jan 10-11 (2 days)',
      priority: 'high',
      submittedOn: '2026-01-02',
      icon: '🏥'
    },
    {
      id: 3,
      type: 'Profile Update',
      employee: 'David Kim',
      avatar: '👨‍💼',
      details: 'Address change request',
      priority: 'low',
      submittedOn: '2026-01-01',
      icon: '📝'
    },
    {
      id: 4,
      type: 'Leave Request',
      employee: 'Jessica Taylor',
      avatar: '👩‍🦰',
      details: 'Personal Leave: Jan 8 (1 day)',
      priority: 'medium',
      submittedOn: '2025-12-30',
      icon: '👤'
    }
  ]);

  const [stats] = useState({
    pending: 4,
    approved: 12,
    rejected: 2,
    avgTime: '2.5 hrs'
  });

  if (!isHR) {
    return (
      <div className="approval-workflow-container">
        <div className="access-denied">
          <div className="access-denied-icon">🔒</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to view approval workflows.</p>
          <p>This section is only available to HR Officers and Administrators.</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div 
      className="approval-workflow-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="workflow-header">
        <div className="header-content">
          <h1 className="workflow-title">⚡ Approval Workflow</h1>
          <div className="workflow-subtitle">
            <span>Manage pending approvals and requests</span>
            <div className="role-indicator" style={{
              background: currentUser.role === 'admin' ? '#f59e0b' : '#3b82f6'
            }}>
              {currentUser.role === 'admin' ? '👑 Admin View' : '👨‍💼 HR View'}
            </div>
          </div>
        </div>
      </div>

      <div className="workflow-stats">
        <motion.div 
          className="stat-card pending"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card approved"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approved Today</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card rejected"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejected Today</div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card time"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgTime}</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </motion.div>
      </div>

      <div className="approvals-section">
        <div className="section-header">
          <h2>Pending Approvals</h2>
          <div className="filter-buttons">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Leave</button>
            <button className="filter-btn">Profile</button>
            <button className="filter-btn">Other</button>
          </div>
        </div>

        <div className="approvals-list">
          {pendingApprovals.map((approval, index) => (
            <motion.div
              key={approval.id}
              className="approval-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="approval-header">
                <div className="approval-type">
                  <span className="type-icon">{approval.icon}</span>
                  <div>
                    <h3>{approval.type}</h3>
                    <span className="submitted-date">
                      Submitted on {new Date(approval.submittedOn).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div 
                  className="priority-badge"
                  style={{ 
                    background: getPriorityColor(approval.priority),
                    boxShadow: `0 4px 15px ${getPriorityColor(approval.priority)}40`
                  }}
                >
                  {approval.priority}
                </div>
              </div>

              <div className="approval-body">
                <div className="employee-section">
                  <div className="employee-avatar">{approval.avatar}</div>
                  <div className="employee-details">
                    <span className="employee-name">{approval.employee}</span>
                    <span className="request-details">{approval.details}</span>
                  </div>
                </div>
              </div>

              <div className="approval-actions">
                <button className="action-btn view-btn">
                  👁️ View Details
                </button>
                <button className="action-btn approve-btn">
                  ✓ Approve
                </button>
                <button className="action-btn reject-btn">
                  ✕ Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="workflow-insights">
        <div className="insight-card">
          <h3>📊 Quick Insights</h3>
          <ul>
            <li>
              <span className="insight-label">Most common request:</span>
              <span className="insight-value">Vacation Leave</span>
            </li>
            <li>
              <span className="insight-label">Peak request day:</span>
              <span className="insight-value">Friday</span>
            </li>
            <li>
              <span className="insight-label">Approval rate:</span>
              <span className="insight-value">85.7%</span>
            </li>
          </ul>
        </div>

        <div className="insight-card">
          <h3>⚠️ Action Required</h3>
          <ul>
            <li>
              <span className="insight-label">Requests &gt; 48hrs:</span>
              <span className="insight-value urgent">2 items</span>
            </li>
            <li>
              <span className="insight-label">High priority:</span>
              <span className="insight-value urgent">1 item</span>
            </li>
            <li>
              <span className="insight-label">Pending review:</span>
              <span className="insight-value">4 items</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ApprovalWorkflow;
