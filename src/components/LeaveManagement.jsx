import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const { currentUser, isHR } = useAuth();
  const [activeTab, setActiveTab] = useState(isHR ? 'requests' : 'balance'); // 'requests', 'history', 'balance'
  const [showNewLeaveModal, setShowNewLeaveModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('');  
  const [comment, setComment] = useState('');
  const [newLeave, setNewLeave] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false
  });

  useEffect(() => {
    generateLeaveData();
  }, []);

  const generateLeaveData = () => {
    // Mock leave requests
    const requests = [
      {
        id: 1,
        employee: 'Sarah Johnson',
        avatar: '👩‍💻',
        type: 'Vacation',
        startDate: '2026-01-15',
        endDate: '2026-01-20',
        days: 6,
        reason: 'Family vacation',
        status: 'pending',
        appliedOn: '2026-01-03'
      },
      {
        id: 2,
        employee: 'Michael Chen',
        avatar: '👨‍🎨',
        type: 'Sick Leave',
        startDate: '2026-01-10',
        endDate: '2026-01-11',
        days: 2,
        reason: 'Medical checkup',
        status: 'pending',
        appliedOn: '2026-01-02'
      },
      {
        id: 3,
        employee: 'Emily Rodriguez',
        avatar: '👩‍💼',
        type: 'Personal',
        startDate: '2026-01-08',
        endDate: '2026-01-08',
        days: 1,
        reason: 'Personal matters',
        status: 'pending',
        appliedOn: '2026-01-01'
      }
    ];

    // Mock leave history
    const history = [
      {
        id: 1,
        employee: 'David Kim',
        avatar: '👨‍💼',
        type: 'Vacation',
        startDate: '2025-12-20',
        endDate: '2025-12-31',
        days: 12,
        status: 'approved',
        approvedBy: 'HR Manager',
        appliedOn: '2025-12-01'
      },
      {
        id: 2,
        employee: 'Jessica Taylor',
        avatar: '👩‍🦰',
        type: 'Sick Leave',
        startDate: '2025-12-15',
        endDate: '2025-12-16',
        days: 2,
        status: 'approved',
        approvedBy: 'HR Manager',
        appliedOn: '2025-12-14'
      },
      {
        id: 3,
        employee: 'James Wilson',
        avatar: '👨‍💻',
        type: 'Personal',
        startDate: '2025-12-10',
        endDate: '2025-12-10',
        days: 1,
        status: 'rejected',
        rejectedBy: 'HR Manager',
        rejectionReason: 'Insufficient leave balance',
        appliedOn: '2025-12-05'
      }
    ];

    // Mock leave balance
    const balance = {
      vacation: { total: 20, used: 5, available: 15 },
      sick: { total: 10, used: 2, available: 8 },
      personal: { total: 5, used: 1, available: 4 },
      unpaid: { total: 0, used: 0, available: 0 }
    };

    setLeaveRequests(requests);
    setLeaveHistory(history);
    setLeaveBalance(balance);
  };

  const handleApprove = (id) => {
    console.log('Approve clicked, isHR:', isHR, 'currentUser:', currentUser);
    if (!isHR) {
      alert('You do not have permission to approve leave requests');
      return;
    }
    const request = leaveRequests.find(req => req.id === id);
    console.log('Found request:', request);
    setSelectedRequest(request);
    setActionType('approve');
    setShowCommentModal(true);
  };

  const handleReject = (id) => {
    console.log('Reject clicked, isHR:', isHR, 'currentUser:', currentUser);
    if (!isHR) {
      alert('You do not have permission to reject leave requests');
      return;
    }
    const request = leaveRequests.find(req => req.id === id);
    console.log('Found request:', request);
    setSelectedRequest(request);
    setActionType('reject');
    setShowCommentModal(true);
  };

  const submitAction = () => {
    console.log('submitAction called with:', { selectedRequest, actionType, comment });
    if (!selectedRequest) {
      console.error('No selected request!');
      return;
    }
    
    const status = actionType === 'approve' ? 'approved' : 'rejected';
    console.log('Processing action:', status);
    
    if (selectedRequest) {
      // Move to history with comment
      const historyItem = {
        ...selectedRequest,
        status: status,
        comment: comment || 'No comment provided',
        reviewedBy: currentUser.name,
        reviewedDate: new Date().toISOString().split('T')[0]
      };
      
      console.log('Adding to history:', historyItem);
      setLeaveHistory(prev => [historyItem, ...prev]);
      
      // Remove from requests
      console.log('Removing from requests, id:', selectedRequest.id);
      setLeaveRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    }
    
    setComment('');
    setShowCommentModal(false);
    setSelectedRequest(null);
    alert(`Leave ${status}!`);
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    
    // Calculate days between start and end date
    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Create new request
    const newRequest = {
      id: Date.now(),
      employee: currentUser.name,
      avatar: currentUser.avatar,
      type: newLeave.type.charAt(0).toUpperCase() + newLeave.type.slice(1),
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days: newLeave.halfDay ? 0.5 : days,
      reason: newLeave.reason,
      status: 'pending',
      appliedOn: new Date().toISOString()
    };
    
    setLeaveRequests(prev => [newRequest, ...prev]);
    setShowNewLeaveModal(false);
    setNewLeave({
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      halfDay: false
    });
    
    // Show success message
    alert('Leave request submitted successfully!');
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'Vacation': '#3b82f6',
      'Sick Leave': '#ef4444',
      'Personal': '#8b5cf6',
      'Unpaid': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'approved': '#10b981',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="leave-management-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="leave-header">
        <div className="header-top">
          <div className="title-section">
            <h1 className="leave-title">Leave & Time-Off Management</h1>
            <div className="role-badge" style={{
              background: currentUser.role === 'admin' ? '#f59e0b' : 
                         currentUser.role === 'hr' ? '#3b82f6' : '#10b981'
            }}>
              {currentUser.role === 'admin' ? '👑 Admin' : 
               currentUser.role === 'hr' ? '👨‍💼 HR Officer' : '👤 Employee'}
            </div>
          </div>
          <button 
            className="new-leave-btn"
            onClick={() => setShowNewLeaveModal(true)}
          >
            <span className="btn-icon">+</span>
            Request Leave
          </button>
        </div>

        <div className="tab-navigation">
          {isHR && (
            <button
              className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              <span className="tab-icon">📋</span>
              Pending Requests
              {leaveRequests.length > 0 && (
                <span className="badge">{leaveRequests.length}</span>
              )}
            </button>
          )}
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">📜</span>
            History
          </button>
          <button
            className={`tab-btn ${activeTab === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveTab('balance')}
          >
            <span className="tab-icon">💼</span>
            Leave Balance
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="leave-content"
          >
            {leaveRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No Pending Requests</h3>
                <p>All leave requests have been processed</p>
              </div>
            ) : (
              <div className="requests-grid">
                {leaveRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    className="request-card"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="request-header">
                      <div className="employee-info">
                        <div className="avatar">{request.avatar}</div>
                        <div>
                          <h3 className="employee-name">{request.employee}</h3>
                          <span className="applied-date">Applied on {new Date(request.appliedOn).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div 
                        className="leave-type-badge"
                        style={{ background: getLeaveTypeColor(request.type) }}
                      >
                        {request.type}
                      </div>
                    </div>

                    <div className="request-details">
                      <div className="detail-row">
                        <span className="detail-label">📅 Duration</span>
                        <span className="detail-value">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">⏱️ Days</span>
                        <span className="detail-value">{request.days} {request.days === 1 ? 'day' : 'days'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📝 Reason</span>
                        <span className="detail-value">{request.reason}</span>
                      </div>
                    </div>

                    {isHR && (
                      <div className="request-actions">
                        <button 
                          className="approve-btn"
                          onClick={() => handleApprove(request.id)}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleReject(request.id)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="leave-content"
          >
            <div className="history-list">
              {leaveHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="history-card"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="history-header">
                    <div className="employee-info">
                      <div className="avatar">{item.avatar}</div>
                      <div>
                        <h3 className="employee-name">{item.employee}</h3>
                        <span className="applied-date">Applied on {new Date(item.appliedOn).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="history-badges">
                      <div 
                        className="leave-type-badge"
                        style={{ background: getLeaveTypeColor(item.type) }}
                      >
                        {item.type}
                      </div>
                      <div 
                        className="status-badge"
                        style={{ background: getStatusColor(item.status) }}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>

                  <div className="history-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Duration</span>
                      <span className="detail-value">
                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">⏱️ Days</span>
                      <span className="detail-value">{item.days} {item.days === 1 ? 'day' : 'days'}</span>
                    </div>
                    {item.status === 'approved' && (
                      <div className="detail-row">
                        <span className="detail-label">✓ Approved by</span>
                        <span className="detail-value">{item.approvedBy}</span>
                      </div>
                    )}
                    {item.status === 'rejected' && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">✕ Rejected by</span>
                          <span className="detail-value">{item.rejectedBy}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Reason</span>
                          <span className="detail-value rejection-reason">{item.rejectionReason}</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'balance' && (
          <motion.div
            key="balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="leave-content"
          >
            <div className="balance-grid">
              {Object.entries(leaveBalance).map(([type, data], index) => (
                <motion.div
                  key={type}
                  className="balance-card"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="balance-header">
                    <h3 className="balance-type">{type.charAt(0).toUpperCase() + type.slice(1)} Leave</h3>
                    <div className="balance-icon">
                      {type === 'vacation' && '🏖️'}
                      {type === 'sick' && '🏥'}
                      {type === 'personal' && '👤'}
                      {type === 'unpaid' && '💰'}
                    </div>
                  </div>

                  <div className="balance-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total</span>
                      <span className="stat-number total">{data.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Used</span>
                      <span className="stat-number used">{data.used}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Available</span>
                      <span className="stat-number available">{data.available}</span>
                    </div>
                  </div>

                  <div className="balance-progress">
                    <div 
                      className="progress-bar"
                      style={{ 
                        width: `${(data.used / data.total) * 100}%`,
                        background: data.used / data.total > 0.7 ? '#ef4444' : '#3b82f6'
                      }}
                    />
                  </div>

                  <div className="balance-footer">
                    <span className="percentage-text">
                      {data.total > 0 ? Math.round((data.used / data.total) * 100) : 0}% Used
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Leave Request Modal */}
      <AnimatePresence>
        {showNewLeaveModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewLeaveModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Request Leave</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowNewLeaveModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitLeave} className="leave-form">
                <div className="form-group">
                  <label>Leave Type <span className="required">*</span></label>
                  <select 
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                    required
                  >
                    <option value="vacation">🏖️ Vacation / Paid Time Off</option>
                    <option value="sick">🏥 Sick Leave</option>
                    <option value="personal">👤 Personal Leave</option>
                    <option value="unpaid">💰 Unpaid Leave</option>
                  </select>
                  <span className="help-text">Select the type of leave you're requesting</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={newLeave.halfDay}
                      onChange={(e) => setNewLeave({...newLeave, halfDay: e.target.checked})}
                    />
                    <span>Half Day</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <textarea 
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                    rows="4"
                    placeholder="Please provide a reason for your leave request..."
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowNewLeaveModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal for Approve/Reject */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request</h2>
              <p className="modal-description">
                {selectedRequest && `${selectedRequest.employee} - ${selectedRequest.type} (${selectedRequest.startDate} to ${selectedRequest.endDate})`}
              </p>
              <div className="form-group">
                <label>Comment (Optional)</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  placeholder="Add a comment about this decision..."
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowCommentModal(false);
                    setComment('');
                    setSelectedRequest(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={actionType === 'approve' ? 'approve-btn' : 'reject-btn'}
                  onClick={submitAction}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LeaveManagement;
