import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import './Auth.css';
import { apiRequest } from '../api/client';

const SignUp = ({ onSwitchToSignIn, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    fullName: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Password validation rules
  const passwordRules = {
    minLength: /.{8,}/,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
  };

  const validatePassword = (password) => {
    return {
      minLength: passwordRules.minLength.test(password),
      hasUpperCase: passwordRules.hasUpperCase.test(password),
      hasLowerCase: passwordRules.hasLowerCase.test(password),
      hasNumber: passwordRules.hasNumber.test(password),
      hasSpecial: passwordRules.hasSpecial.test(password)
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(val => val);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet security requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
      apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: formData.employeeId,
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department,
          avatar: formData.fullName
        })
      })
        .then(() => {
          setLoading(false);
          alert('Account created successfully! You can sign in now.');
          onSignUpSuccess();
        })
        .catch((err) => {
          setErrors({ email: err.message || 'An error occurred. Please try again.' });
          setLoading(false);
        });
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <motion.div 
            className="auth-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Briefcase size={40} />
          </motion.div>
          <h1>Create Account</h1>
          <p>Register to access DayFlow HRMS</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Employee ID *</label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  name="employeeId"
                  placeholder="EMP001"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={errors.employeeId ? 'error' : ''}
                />
              </div>
              {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                />
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-wrapper">
              <Mail size={20} />
              <input
                type="email"
                name="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <div className="input-wrapper">
                <Briefcase size={20} />
                <input
                  type="text"
                  name="department"
                  placeholder="Engineering"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? 'error' : ''}
                />
              </div>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label>Role *</label>
              <div className="input-wrapper">
                <Briefcase size={20} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR Officer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <div className="requirements-list">
                <div className={`requirement ${passwordValidation.minLength ? 'valid' : ''}`}>
                  {passwordValidation.minLength ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>At least 8 characters</span>
                </div>
                <div className={`requirement ${passwordValidation.hasUpperCase ? 'valid' : ''}`}>
                  {passwordValidation.hasUpperCase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>One uppercase letter</span>
                </div>
                <div className={`requirement ${passwordValidation.hasLowerCase ? 'valid' : ''}`}>
                  {passwordValidation.hasLowerCase ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>One lowercase letter</span>
                </div>
                <div className={`requirement ${passwordValidation.hasNumber ? 'valid' : ''}`}>
                  {passwordValidation.hasNumber ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>One number</span>
                </div>
                <div className={`requirement ${passwordValidation.hasSpecial ? 'valid' : ''}`}>
                  {passwordValidation.hasSpecial ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>One special character</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Confirm Password *</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <motion.button
            type="submit"
            className="auth-button"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <button type="button" onClick={onSwitchToSignIn} className="link-button">
              Sign In
            </button>
          </div>
        </form>
      </motion.div>

      {/* SQL Database Schema Note */}
      <div className="db-schema-note">
        <p>
          <strong>SQL Database Schema:</strong> In production, user data should be stored in a SQL database.
          See schema in database/schema.sql
        </p>
      </div>
    </div>
  );
};

export default SignUp;
