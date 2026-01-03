import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Clock, Award, Calendar, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = ({ onViewChange }) => {
  const { currentUser, isHR, isEmployee, hasPermission } = useAuth();
  const [recentActivity, setRecentActivity] = React.useState([
    { id: 1, type: 'leave', message: 'Leave request approved', time: '2 hours ago', icon: '✅' },
    { id: 2, type: 'attendance', message: 'Checked in at 9:00 AM', time: '5 hours ago', icon: '⏰' },
    { id: 3, type: 'update', message: 'Profile updated successfully', time: '1 day ago', icon: '📝' }
  ]);

  // Stats based on user role
  const adminStats = [
    { icon: Users, label: 'Total Employees', value: '248', change: '+12%', color: '#6366f1', onClick: () => onViewChange('employees') },
    { icon: TrendingUp, label: 'Active Projects', value: '42', change: '+8%', color: '#8b5cf6' },
    { icon: Clock, label: 'Pending Approvals', value: '18', change: '-5%', color: '#ec4899', onClick: () => onViewChange('approvals') },
    { icon: Award, label: 'Achievements', value: '156', change: '+23%', color: '#10b981' },
  ];

  const employeeStats = [
    { icon: Calendar, label: 'Attendance This Month', value: '20/22', change: '91%', color: '#6366f1', onClick: () => onViewChange('attendance') },
    { icon: Clock, label: 'Leave Balance', value: '15 Days', change: 'Available', color: '#8b5cf6', onClick: () => onViewChange('leave') },
    { icon: FileText, label: 'Pending Requests', value: '2', change: 'In Review', color: '#ec4899', onClick: () => onViewChange('leave') },
    { icon: CheckCircle, label: 'Tasks Completed', value: '34', change: '+8%', color: '#10b981' },
  ];

  const stats = isEmployee ? employeeStats : adminStats;

  const recentEmployees = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Developer', avatar: 'Sarah', status: 'active' },
    { id: 2, name: 'Michael Chen', role: 'UI/UX Designer', avatar: 'Michael', status: 'active' },
    { id: 3, name: 'Emily Davis', role: 'Project Manager', avatar: 'Emily', status: 'away' },
    { id: 4, name: 'James Wilson', role: 'DevOps Engineer', avatar: 'James', status: 'active' },
  ];

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {isEmployee 
              ? `Welcome back, ${currentUser.name}! Here's your overview.`
              : "Welcome back! Here's what's happening today."}
          </p>
          <div className="role-info-badge" style={{
            background: currentUser.role === 'admin' ? 'rgba(245, 158, 11, 0.2)' : 
                       currentUser.role === 'hr' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            border: `1px solid ${currentUser.role === 'admin' ? '#f59e0b' : 
                    currentUser.role === 'hr' ? '#3b82f6' : '#10b981'}`,
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            display: 'inline-block',
            marginTop: '0.5rem',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {currentUser.role === 'admin' && '👑 Administrator - Full System Access'}
            {currentUser.role === 'hr' && '👨‍💼 HR Officer - Employee Management & Approvals'}
            {currentUser.role === 'employee' && '👤 Employee - Personal Profile & Leave Management'}
          </div>
        </motion.div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="stat-card glass-effect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={stat.onClick}
              style={{ cursor: stat.onClick ? 'pointer' : 'default' }}
            >
              <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)` }}>
                <Icon size={24} color={stat.color} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h2 className="stat-value">{stat.value}</h2>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change} from last month
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isEmployee && (
        <motion.div 
          className="quick-access-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="section-title">Quick Access</h2>
          <div className="quick-access-grid">
            <motion.div 
              className="quick-card glass-effect"
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => onViewChange('employees')}
            >
              <div className="quick-icon">👤</div>
              <h3>My Profile</h3>
              <p>View & edit profile</p>
            </motion.div>
            <motion.div 
              className="quick-card glass-effect"
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => onViewChange('attendance')}
            >
              <div className="quick-icon">📅</div>
              <h3>Attendance</h3>
              <p>Check-in / Check-out</p>
            </motion.div>
            <motion.div 
              className="quick-card glass-effect"
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => onViewChange('leave')}
            >
              <div className="quick-icon">🏖️</div>
              <h3>Leave Requests</h3>
              <p>Apply & manage leave</p>
            </motion.div>
            <motion.div 
              className="quick-card glass-effect"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="quick-icon">💰</div>
              <h3>Payroll</h3>
              <p>View salary details</p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {isEmployee && (
        <motion.div 
          className="recent-activity glass-effect"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2>Recent Activity & Alerts</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id}
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.9 }}
                whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
              >
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="dashboard-content">
        {hasPermission('view_all_employees') && (
          <motion.div 
            className="recent-employees glass-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="section-header">
              <h2>Recent Employees</h2>
              <motion.button
                className="view-all-btn"
                onClick={() => onViewChange('employees')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>
            <div className="employees-list">
              {recentEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  className="employee-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  whileHover={{ x: 10, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                >
                  <div className="employee-avatar">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.avatar}`} 
                      alt={employee.name} 
                    />
                    <span className={`status-indicator ${employee.status}`}></span>
                  </div>
                  <div className="employee-info">
                    <h3>{employee.name}</h3>
                    <p>{employee.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div 
          className="quick-actions glass-effect"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {hasPermission('manage_employees') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('employees')}
              >
                <Users size={24} />
                <span>Manage Employees</span>
              </motion.button>
            )}
            {hasPermission('approve_leave') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('approvals')}
              >
                <CheckCircle size={24} />
                <span>Approve Leave</span>
              </motion.button>
            )}
            {hasPermission('view_all_attendance') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('attendance')}
              >
                <Calendar size={24} />
                <span>View Attendance</span>
              </motion.button>
            )}
            {hasPermission('apply_leave') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('leave')}
              >
                <Clock size={24} />
                <span>Apply for Leave</span>
              </motion.button>
            )}
            {hasPermission('view_own_attendance') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('attendance')}
              >
                <Calendar size={24} />
                <span>My Attendance</span>
              </motion.button>
            )}
            {hasPermission('view_own_salary') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <DollarSign size={24} />
                <span>View Salary</span>
              </motion.button>
            )}
            {hasPermission('view_reports') && (
              <motion.button 
                className="action-btn"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp size={24} />
                <span>View Reports</span>
              </motion.button>
            )}
            <motion.button 
              className="action-btn"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText size={24} />
              <span>View Profile</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
