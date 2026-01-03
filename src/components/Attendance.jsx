import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, Users, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Attendance.css';

const Attendance = () => {
  const { hasPermission, isEmployee, currentUser } = useAuth();
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, leave: 0 });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    alert(`Checked in at ${now.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now);
    setIsCheckedIn(false);
    alert(`Checked out at ${now.toLocaleTimeString()}`);
  };

  // Generate mock attendance data
  useEffect(() => {
    generateAttendanceData();
  }, [selectedDate, viewMode]);

  const generateAttendanceData = () => {
    const employees = [
      { id: 1, name: 'Sarah Johnson', department: 'Engineering', avatar: '👩‍💻' },
      { id: 2, name: 'Michael Chen', department: 'Design', avatar: '👨‍🎨' },
      { id: 3, name: 'Emily Rodriguez', department: 'Marketing', avatar: '👩‍💼' },
      { id: 4, name: 'David Kim', department: 'Sales', avatar: '👨‍💼' },
      { id: 5, name: 'Jessica Taylor', department: 'HR', avatar: '👩‍🦰' },
      { id: 6, name: 'James Wilson', department: 'Engineering', avatar: '👨‍💻' },
      { id: 7, name: 'Linda Martinez', department: 'Finance', avatar: '👩‍💼' },
      { id: 8, name: 'Robert Brown', department: 'Operations', avatar: '👨‍🔧' },
      { id: 9, name: 'Maria Garcia', department: 'Design', avatar: '👩‍🎨' },
      { id: 10, name: 'Christopher Lee', department: 'Engineering', avatar: '👨‍💻' },
    ];

    // If employee, show only their own attendance
    const displayEmployees = isEmployee 
      ? [{ 
          id: currentUser.id, 
          name: currentUser.name, 
          department: currentUser.department, 
          avatar: currentUser.avatar 
        }]
      : employees;

    if (viewMode === 'daily') {
      const data = displayEmployees.map(emp => {
        const statusOptions = ['present', 'absent', 'late', 'leave', 'half-day'];
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const checkIn = status === 'present' ? '09:00 AM' : status === 'late' ? '10:30 AM' : status === 'half-day' ? '09:00 AM' : '-';
        const checkOut = status === 'present' || status === 'late' ? '06:00 PM' : status === 'half-day' ? '01:00 PM' : '-';
        const workHours = status === 'present' ? '9h 00m' : status === 'late' ? '7h 30m' : status === 'half-day' ? '4h 00m' : '-';

        return {
          ...emp,
          status,
          checkIn,
          checkOut,
          workHours,
        };
      });

      setAttendanceData(data);

      // Calculate stats
      const statsData = {
        present: data.filter(e => e.status === 'present').length,
        absent: data.filter(e => e.status === 'absent').length,
        late: data.filter(e => e.status === 'late').length,
        leave: data.filter(e => e.status === 'leave').length,
      };
      setStats(statsData);
    } else {
      // Weekly view - show attendance for each day
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const data = displayEmployees.map(emp => {
        const weekData = {};
        weekDays.forEach(day => {
          weekData[day] = ['P', 'A', 'L', 'X'][Math.floor(Math.random() * 4)];
        });
        return {
          ...emp,
          ...weekData,
          attendance: Object.values(weekData).filter(v => v === 'P' || v === 'L').length,
        };
      });

      setAttendanceData(data);

      // Calculate weekly stats
      const totalDays = weekDays.length * displayEmployees.length;
      let presentCount = 0, absentCount = 0, lateCount = 0, leaveCount = 0;
      
      data.forEach(emp => {
        weekDays.forEach(day => {
          if (emp[day] === 'P') presentCount++;
          else if (emp[day] === 'A') absentCount++;
          else if (emp[day] === 'L') lateCount++;
          else if (emp[day] === 'X') leaveCount++;
        });
      });

      setStats({
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        leave: leaveCount,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
      case 'P':
        return '#10b981';
      case 'absent':
      case 'A':
        return '#ef4444';
      case 'late':
      case 'L':
        return '#f59e0b';
      case 'leave':
      case 'X':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="header-top">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Attendance Management
            </motion.h1>
            <p>Track and manage employee attendance</p>
          </div>
          {isEmployee && (
            <motion.div 
              className="check-in-out-section"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {!isCheckedIn && !checkOutTime && (
                <motion.button
                  className="check-in-btn"
                  onClick={handleCheckIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Clock className="btn-icon" />
                  Check In
                </motion.button>
              )}
              {isCheckedIn && !checkOutTime && (
                <>
                  <div className="check-status">
                    <CheckCircle className="status-icon" />
                    <div>
                      <span className="status-label">Checked In</span>
                      <span className="status-time">{checkInTime?.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <motion.button
                    className="check-out-btn"
                    onClick={handleCheckOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="btn-icon" />
                    Check Out
                  </motion.button>
                </>
              )}
              {checkOutTime && (
                <div className="check-complete">
                  <CheckCircle className="complete-icon" />
                  <div className="complete-info">
                    <span className="complete-label">Day Complete</span>
                    <span className="complete-time">
                      {checkInTime?.toLocaleTimeString()} - {checkOutTime?.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="date-navigation">
          <button onClick={() => changeDate(-1)} className="nav-btn">
            ← Previous
          </button>
          <div className="current-date">
            {formatDate(selectedDate)}
          </div>
          <button onClick={() => changeDate(1)} className="nav-btn">
            Next →
          </button>
          <button onClick={goToToday} className="today-btn">
            Today
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            Daily View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </button>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card present-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.present}</div>
            <div className="stat-label">Present</div>
          </div>
          <div className="stat-trend">↑ 5%</div>
        </div>

        <div className="stat-card absent-card">
          <div className="stat-icon">✗</div>
          <div className="stat-content">
            <div className="stat-value">{stats.absent}</div>
            <div className="stat-label">Absent</div>
          </div>
          <div className="stat-trend">↓ 2%</div>
        </div>

        <div className="stat-card late-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.late}</div>
            <div className="stat-label">Late</div>
          </div>
          <div className="stat-trend">→ 0%</div>
        </div>

        <div className="stat-card leave-card">
          <div className="stat-icon">🏖️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.leave}</div>
            <div className="stat-label">On Leave</div>
          </div>
          <div className="stat-trend">↑ 1%</div>
        </div>
      </div>

      <div className="attendance-content">
        {viewMode === 'daily' ? (
          <div className="daily-view">
            <div className="table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Hours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((emp, index) => (
                    <tr key={emp.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="employee-cell">
                          <span className="employee-avatar">{emp.avatar}</span>
                          <span className="employee-name">{emp.name}</span>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>
                        <span className={`status-badge ${emp.status}`} style={{ backgroundColor: getStatusColor(emp.status) }}>
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                        </span>
                      </td>
                      <td className="time-cell">{emp.checkIn}</td>
                      <td className="time-cell">{emp.checkOut}</td>
                      <td className="hours-cell">{emp.workHours}</td>
                      <td>
                        <button className="action-btn" title="View Details">👁️</button>
                        <button className="action-btn" title="Edit">✏️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="weekly-view">
            <div className="table-container">
              <table className="attendance-table weekly-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((emp, index) => (
                    <tr key={emp.id} style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="employee-cell">
                          <span className="employee-avatar">{emp.avatar}</span>
                          <span className="employee-name">{emp.name}</span>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>
                        <span className="day-status" style={{ backgroundColor: getStatusColor(emp.Mon) }}>
                          {emp.Mon}
                        </span>
                      </td>
                      <td>
                        <span className="day-status" style={{ backgroundColor: getStatusColor(emp.Tue) }}>
                          {emp.Tue}
                        </span>
                      </td>
                      <td>
                        <span className="day-status" style={{ backgroundColor: getStatusColor(emp.Wed) }}>
                          {emp.Wed}
                        </span>
                      </td>
                      <td>
                        <span className="day-status" style={{ backgroundColor: getStatusColor(emp.Thu) }}>
                          {emp.Thu}
                        </span>
                      </td>
                      <td>
                        <span className="day-status" style={{ backgroundColor: getStatusColor(emp.Fri) }}>
                          {emp.Fri}
                        </span>
                      </td>
                      <td>
                        <div className="attendance-progress">
                          <span className="attendance-count">{emp.attendance}/5</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${(emp.attendance / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="attendance-legend">
        <h3>Legend:</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
            <span>Present (P)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
            <span>Absent (A)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
            <span>Late (L)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>
            <span>Leave (X)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
