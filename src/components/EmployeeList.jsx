import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './EmployeeList.css';

const EmployeeList = ({ onEmployeeSelect }) => {
  const { hasPermission, isEmployee, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Check if user has permission to view all employees
  if (!hasPermission('view_all_employees')) {
    return (
      <motion.div 
        className="employee-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="access-denied-section">
          <div className="access-denied-icon">🔒</div>
          <h2>Access Restricted</h2>
          <p>You don't have permission to view all employee profiles.</p>
          <p className="access-info">
            {isEmployee && 'As an employee, you can only view your personal profile and information.'}
          </p>
          <button className="back-btn" onClick={() => window.history.back()}>
            ← Go Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const employees = [
    { id: 1, name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', email: 'sarah.j@dayflow.com', phone: '+1 234-567-8901', avatar: 'Sarah', status: 'active', experience: '5 years' },
    { id: 2, name: 'Michael Chen', role: 'UI/UX Designer', department: 'Design', email: 'michael.c@dayflow.com', phone: '+1 234-567-8902', avatar: 'Michael', status: 'active', experience: '3 years' },
    { id: 3, name: 'Emily Davis', role: 'Project Manager', department: 'Management', email: 'emily.d@dayflow.com', phone: '+1 234-567-8903', avatar: 'Emily', status: 'away', experience: '7 years' },
    { id: 4, name: 'James Wilson', role: 'DevOps Engineer', department: 'Engineering', email: 'james.w@dayflow.com', phone: '+1 234-567-8904', avatar: 'James', status: 'active', experience: '4 years' },
    { id: 5, name: 'Lisa Anderson', role: 'HR Manager', department: 'Human Resources', email: 'lisa.a@dayflow.com', phone: '+1 234-567-8905', avatar: 'Lisa', status: 'active', experience: '6 years' },
    { id: 6, name: 'David Martinez', role: 'Marketing Lead', department: 'Marketing', email: 'david.m@dayflow.com', phone: '+1 234-567-8906', avatar: 'David', status: 'active', experience: '4 years' },
    { id: 7, name: 'Jennifer Lee', role: 'Full Stack Developer', department: 'Engineering', email: 'jennifer.l@dayflow.com', phone: '+1 234-567-8907', avatar: 'Jennifer', status: 'active', experience: '3 years' },
    { id: 8, name: 'Robert Taylor', role: 'Product Designer', department: 'Design', email: 'robert.t@dayflow.com', phone: '+1 234-567-8908', avatar: 'Robert', status: 'away', experience: '5 years' },
  ];

  const departments = ['all', 'Engineering', 'Design', 'Management', 'Human Resources', 'Marketing'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <motion.div 
      className="employee-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="list-header">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your team members</p>
        </motion.div>
        
        <motion.button 
          className="add-employee-btn"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add Employee
        </motion.button>
      </div>

      <motion.div 
        className="filters glass-effect"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="employees-grid">
        {filteredEmployees.map((employee, index) => (
          <motion.div
            key={employee.id}
            className="employee-card glass-effect"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.4 }}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => onEmployeeSelect(employee)}
          >
            <div className="card-header">
              <motion.div 
                className="employee-avatar-large"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.avatar}`} 
                  alt={employee.name} 
                />
                <span className={`status-badge ${employee.status}`}></span>
              </motion.div>
            </div>

            <div className="card-content">
              <h3 className="employee-name">{employee.name}</h3>
              <p className="employee-role">{employee.role}</p>
              <span className="department-badge">{employee.department}</span>

              <div className="contact-info">
                <div className="contact-item">
                  <Mail size={14} />
                  <span>{employee.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={14} />
                  <span>{employee.phone}</span>
                </div>
              </div>

              <div className="card-footer">
                <span className="experience-badge">{employee.experience}</span>
                <motion.button 
                  className="view-profile-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEmployeeSelect(employee);
                  }}
                >
                  View Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <motion.div 
          className="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No employees found matching your criteria</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmployeeList;
