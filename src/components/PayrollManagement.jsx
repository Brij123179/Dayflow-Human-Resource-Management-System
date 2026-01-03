import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  User, 
  Calendar, 
  TrendingUp, 
  Download, 
  Edit, 
  Save, 
  X,
  FileText,
  CreditCard,
  PiggyBank
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './PayrollManagement.css';

// Mock payroll data
const mockEmployees = [
  { 
    id: 1, 
    name: 'John Doe', 
    position: 'Senior Developer', 
    department: 'Engineering',
    baseSalary: 85000,
    allowances: 5000,
    deductions: 3000,
    bonus: 2000,
    netSalary: 89000,
    paymentDate: '2024-01-31',
    status: 'Paid'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    position: 'Product Manager', 
    department: 'Product',
    baseSalary: 95000,
    allowances: 6000,
    deductions: 3500,
    bonus: 3000,
    netSalary: 100500,
    paymentDate: '2024-01-31',
    status: 'Paid'
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    position: 'UX Designer', 
    department: 'Design',
    baseSalary: 70000,
    allowances: 4000,
    deductions: 2500,
    bonus: 1500,
    netSalary: 73000,
    paymentDate: '2024-01-31',
    status: 'Pending'
  },
];

const PayrollManagement = () => {
  const { currentUser, hasPermission, isEmployee, isAdmin } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedSalary, setEditedSalary] = useState({});
  const [payrollData, setPayrollData] = useState([]);

  useEffect(() => {
    // Filter payroll data based on user role
    if (isEmployee) {
      const employeeData = mockEmployees.find(emp => emp.name === currentUser.name);
      const dataToShow = employeeData ? [employeeData] : [mockEmployees[0]];
      setPayrollData(dataToShow);
      setSelectedEmployee(dataToShow[0]);
    } else {
      setPayrollData(mockEmployees);
      setSelectedEmployee(mockEmployees[0]);
    }
  }, [isEmployee, currentUser.name]);

  const handleEdit = (employee) => {
    setEditMode(true);
    setEditedSalary({
      baseSalary: employee.baseSalary,
      allowances: employee.allowances,
      deductions: employee.deductions,
      bonus: employee.bonus
    });
  };

  const handleSave = () => {
    if (selectedEmployee) {
      const netSalary = 
        editedSalary.baseSalary + 
        editedSalary.allowances + 
        editedSalary.bonus - 
        editedSalary.deductions;
      
      const updatedData = payrollData.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...editedSalary, netSalary }
          : emp
      );
      setPayrollData(updatedData);
      setSelectedEmployee({ ...selectedEmployee, ...editedSalary, netSalary });
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedSalary({});
  };

  const downloadPayslip = (employee) => {
    alert(`Downloading payslip for ${employee.name}...`);
  };

  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>
            <DollarSign className="header-icon" />
            Payroll Management
          </h1>
          <p>{isEmployee ? 'View your salary details' : 'Manage employee salaries and payroll'}</p>
        </motion.div>
      </div>

      <div className={`payroll-content ${isEmployee ? 'employee-view' : ''}`}>
        {/* Employee List - Only for Admin/HR */}
        {!isEmployee && (
          <motion.div 
            className="employee-list-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Employees</h2>
            <div className="employee-cards">
              {payrollData.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  className={`employee-card ${selectedEmployee?.id === employee.id ? 'active' : ''}`}
                  onClick={() => setSelectedEmployee(employee)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="employee-info">
                    <User className="employee-icon" />
                    <div>
                      <h3>{employee.name}</h3>
                      <p>{employee.position}</p>
                    </div>
                  </div>
                  <div className="employee-salary">
                    <span className="salary-label">Net Salary</span>
                    <span className="salary-amount">${employee.netSalary.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Salary Details */}
        {selectedEmployee && (
          <motion.div 
            className="salary-details-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="details-header">
              <div>
                <h2>{selectedEmployee.name}</h2>
                <p>{selectedEmployee.position} - {selectedEmployee.department}</p>
              </div>
              <div className="header-actions">
                {!isEmployee && !editMode && (
                  <motion.button
                    className="edit-btn"
                    onClick={() => handleEdit(selectedEmployee)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={18} />
                    Edit Salary
                  </motion.button>
                )}
                <motion.button
                  className="download-btn"
                  onClick={() => downloadPayslip(selectedEmployee)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={18} />
                  Download Payslip
                </motion.button>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="salary-breakdown">
              <motion.div 
                className="breakdown-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="card-icon earnings">
                  <TrendingUp />
                </div>
                <div className="card-content">
                  <span className="card-label">Base Salary</span>
                  {editMode ? (
                    <input
                      type="number"
                      className="salary-input"
                      value={editedSalary.baseSalary}
                      onChange={(e) => setEditedSalary({...editedSalary, baseSalary: Number(e.target.value)})}
                    />
                  ) : (
                    <span className="card-value">${selectedEmployee.baseSalary.toLocaleString()}</span>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="breakdown-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card-icon earnings">
                  <PiggyBank />
                </div>
                <div className="card-content">
                  <span className="card-label">Allowances</span>
                  {editMode ? (
                    <input
                      type="number"
                      className="salary-input"
                      value={editedSalary.allowances}
                      onChange={(e) => setEditedSalary({...editedSalary, allowances: Number(e.target.value)})}
                    />
                  ) : (
                    <span className="card-value earnings-text">${selectedEmployee.allowances.toLocaleString()}</span>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="breakdown-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="card-icon deductions">
                  <CreditCard />
                </div>
                <div className="card-content">
                  <span className="card-label">Deductions</span>
                  {editMode ? (
                    <input
                      type="number"
                      className="salary-input"
                      value={editedSalary.deductions}
                      onChange={(e) => setEditedSalary({...editedSalary, deductions: Number(e.target.value)})}
                    />
                  ) : (
                    <span className="card-value deductions-text">${selectedEmployee.deductions.toLocaleString()}</span>
                  )}
                </div>
              </motion.div>

              <motion.div 
                className="breakdown-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="card-icon earnings">
                  <FileText />
                </div>
                <div className="card-content">
                  <span className="card-label">Bonus</span>
                  {editMode ? (
                    <input
                      type="number"
                      className="salary-input"
                      value={editedSalary.bonus}
                      onChange={(e) => setEditedSalary({...editedSalary, bonus: Number(e.target.value)})}
                    />
                  ) : (
                    <span className="card-value earnings-text">${selectedEmployee.bonus.toLocaleString()}</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Net Salary */}
            <motion.div 
              className="net-salary-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="net-salary-content">
                <div className="net-salary-icon">
                  <DollarSign />
                </div>
                <div>
                  <span className="net-salary-label">Net Salary</span>
                  <span className="net-salary-amount">
                    ${editMode 
                      ? (editedSalary.baseSalary + editedSalary.allowances + editedSalary.bonus - editedSalary.deductions).toLocaleString()
                      : selectedEmployee.netSalary.toLocaleString()
                    }
                  </span>
                </div>
              </div>
              <div className="payment-info">
                <Calendar size={16} />
                <span>Payment Date: {selectedEmployee.paymentDate}</span>
                <span className={`payment-status ${selectedEmployee.status.toLowerCase()}`}>
                  {selectedEmployee.status}
                </span>
              </div>
            </motion.div>

            {/* Edit Actions */}
            {editMode && (
              <motion.div 
                className="edit-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button className="save-btn" onClick={handleSave}>
                  <Save size={18} />
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  <X size={18} />
                  Cancel
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PayrollManagement;
