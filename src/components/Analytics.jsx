import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Filter,
  Printer,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Analytics.css';

const Analytics = () => {
  const { currentUser, isEmployee, isHR, isAdmin } = useAuth();
  const [selectedReport, setSelectedReport] = useState('salary');
  const [dateRange, setDateRange] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState('January 2026');

  const reports = {
    salary: {
      title: 'Salary Report',
      icon: DollarSign,
      color: '#22c55e',
      data: [
        { employee: 'John Doe', position: 'Senior Developer', gross: 85000, deductions: 3000, net: 82000, status: 'Paid' },
        { employee: 'Jane Smith', position: 'Product Manager', gross: 95000, deductions: 3500, net: 91500, status: 'Paid' },
        { employee: 'Mike Johnson', position: 'UX Designer', gross: 70000, deductions: 2500, net: 67500, status: 'Pending' },
        { employee: 'Sarah Wilson', position: 'HR Manager', gross: 80000, deductions: 3000, net: 77000, status: 'Paid' },
      ],
      summary: {
        totalGross: 330000,
        totalDeductions: 12000,
        totalNet: 318000,
        avgSalary: 82500
      }
    },
    attendance: {
      title: 'Attendance Report',
      icon: Calendar,
      color: '#667eea',
      data: [
        { employee: 'John Doe', present: 20, absent: 1, late: 2, leaves: 1, percentage: 83.3 },
        { employee: 'Jane Smith', present: 22, absent: 0, late: 1, leaves: 1, percentage: 91.7 },
        { employee: 'Mike Johnson', present: 19, absent: 2, late: 3, leaves: 0, percentage: 79.2 },
        { employee: 'Sarah Wilson', present: 23, absent: 0, late: 0, leaves: 1, percentage: 95.8 },
      ],
      summary: {
        avgAttendance: 87.5,
        totalPresent: 84,
        totalAbsent: 3,
        totalLate: 6
      }
    },
    payslips: {
      title: 'Payslip Archive',
      icon: FileText,
      color: '#8b5cf6',
      data: [
        { month: 'January 2026', gross: 85000, deductions: 3000, net: 82000, date: '2026-01-31' },
        { month: 'December 2025', gross: 85000, deductions: 3000, net: 82000, date: '2025-12-31' },
        { month: 'November 2025', gross: 82000, deductions: 2800, net: 79200, date: '2025-11-30' },
        { month: 'October 2025', gross: 82000, deductions: 2800, net: 79200, date: '2025-10-31' },
      ]
    }
  };

  const downloadReport = (format) => {
    const report = reports[selectedReport];
    alert(`Downloading ${report.title} as ${format.toUpperCase()}...`);
    // In a real app, this would generate and download the actual file
  };

  const emailReport = () => {
    const report = reports[selectedReport];
    alert(`Sending ${report.title} to ${currentUser.email}...`);
  };

  const printReport = () => {
    window.print();
  };

  const currentReport = reports[selectedReport];
  const ReportIcon = currentReport.icon;

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>
            <BarChart3 className="header-icon" />
            Analytics & Reports
          </h1>
          <p>Generate and download detailed reports</p>
        </motion.div>

        <div className="header-actions">
          <motion.button
            className="action-btn primary"
            onClick={() => downloadReport('pdf')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={18} />
            Download PDF
          </motion.button>
          <motion.button
            className="action-btn secondary"
            onClick={printReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Printer size={18} />
            Print
          </motion.button>
          <motion.button
            className="action-btn secondary"
            onClick={emailReport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail size={18} />
            Email
          </motion.button>
        </div>
      </div>

      {/* Report Type Selection */}
      <motion.div 
        className="report-types"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {Object.keys(reports).map((key) => {
          const report = reports[key];
          const Icon = report.icon;
          return (
            <motion.div
              key={key}
              className={`report-type-card ${selectedReport === key ? 'active' : ''}`}
              onClick={() => setSelectedReport(key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="report-icon"
                style={{ backgroundColor: `${report.color}20` }}
              >
                <Icon size={24} style={{ color: report.color }} />
              </div>
              <h3>{report.title}</h3>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="report-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="filter-group">
          <Filter size={18} />
          <label>Period:</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div className="filter-group">
          <Calendar size={18} />
          <label>Month:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select"
          >
            <option>January 2026</option>
            <option>December 2025</option>
            <option>November 2025</option>
            <option>October 2025</option>
          </select>
        </div>
      </motion.div>

      {/* Report Content */}
      <motion.div 
        className="report-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="report-header-section">
          <div 
            className="report-title-icon"
            style={{ backgroundColor: `${currentReport.color}20` }}
          >
            <ReportIcon size={32} style={{ color: currentReport.color }} />
          </div>
          <div>
            <h2>{currentReport.title}</h2>
            <p>Period: {selectedMonth}</p>
          </div>
        </div>

        {/* Summary Cards */}
        {currentReport.summary && (
          <div className="summary-cards">
            {selectedReport === 'salary' && (
              <>
                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <DollarSign size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Total Gross</span>
                    <span className="summary-value">${currentReport.summary.totalGross.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Total Deductions</span>
                    <span className="summary-value">${currentReport.summary.totalDeductions.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <DollarSign size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Total Net</span>
                    <span className="summary-value">${currentReport.summary.totalNet.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                    <Users size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Avg Salary</span>
                    <span className="summary-value">${currentReport.summary.avgSalary.toLocaleString()}</span>
                  </div>
                </motion.div>
              </>
            )}

            {selectedReport === 'attendance' && (
              <>
                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Avg Attendance</span>
                    <span className="summary-value">{currentReport.summary.avgAttendance}%</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <Users size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Total Present</span>
                    <span className="summary-value">{currentReport.summary.totalPresent}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                    <Users size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Total Absent</span>
                    <span className="summary-value">{currentReport.summary.totalAbsent}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="summary-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="summary-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <Users size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-label">Total Late</span>
                    <span className="summary-value">{currentReport.summary.totalLate}</span>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        )}

        {/* Data Table */}
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                {selectedReport === 'salary' && (
                  <>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Gross Salary</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </>
                )}
                {selectedReport === 'attendance' && (
                  <>
                    <th>Employee</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Leaves</th>
                    <th>Percentage</th>
                    <th>Actions</th>
                  </>
                )}
                {selectedReport === 'payslips' && (
                  <>
                    <th>Month</th>
                    <th>Gross Salary</th>
                    <th>Deductions</th>
                    <th>Net Salary</th>
                    <th>Payment Date</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {currentReport.data.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {selectedReport === 'salary' && (
                    <>
                      <td>{row.employee}</td>
                      <td>{row.position}</td>
                      <td className="amount">${row.gross.toLocaleString()}</td>
                      <td className="amount deduction">${row.deductions.toLocaleString()}</td>
                      <td className="amount net">${row.net.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="table-action-btn"
                          onClick={() => alert(`Downloading payslip for ${row.employee}...`)}
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </>
                  )}
                  {selectedReport === 'attendance' && (
                    <>
                      <td>{row.employee}</td>
                      <td className="stat-present">{row.present}</td>
                      <td className="stat-absent">{row.absent}</td>
                      <td className="stat-late">{row.late}</td>
                      <td>{row.leaves}</td>
                      <td>
                        <div className="percentage-cell">
                          <span className={row.percentage >= 90 ? 'excellent' : row.percentage >= 75 ? 'good' : 'poor'}>
                            {row.percentage}%
                          </span>
                          <div className="percentage-bar">
                            <div 
                              className="percentage-fill"
                              style={{ 
                                width: `${row.percentage}%`,
                                background: row.percentage >= 90 ? '#22c55e' : row.percentage >= 75 ? '#f59e0b' : '#ef4444'
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="table-action-btn"
                          onClick={() => alert(`Viewing details for ${row.employee}...`)}
                        >
                          <FileText size={16} />
                        </button>
                      </td>
                    </>
                  )}
                  {selectedReport === 'payslips' && (
                    <>
                      <td>{row.month}</td>
                      <td className="amount">${row.gross.toLocaleString()}</td>
                      <td className="amount deduction">${row.deductions.toLocaleString()}</td>
                      <td className="amount net">${row.net.toLocaleString()}</td>
                      <td>{row.date}</td>
                      <td>
                        <button 
                          className="table-action-btn"
                          onClick={() => alert(`Downloading payslip for ${row.month}...`)}
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
