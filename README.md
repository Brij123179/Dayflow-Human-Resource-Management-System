# DayFlow - Human Resource Management System

A modern, feature-rich HRMS built with React and Vite, featuring a dark theme, smooth animations, and comprehensive authentication.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Sign Up System**
  - Employee ID registration
  - Email and password validation
  - Role selection (Employee/HR/Admin)
  - Password security rules:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
  - Real-time password validation with visual feedback
  - Department assignment

- **Sign In System**
  - Email and password authentication
  - Show/hide password toggle
  - Remember me functionality
  - Session management (localStorage/sessionStorage)
  - Error handling for invalid credentials
  - User-created accounts (no preloaded users)

- **Session Management**
  - Automatic session restoration on page reload
  - 30-day session for "Remember me"
  - 24-hour session for regular login
  - Secure logout with session cleanup

### 👥 Employee Management
- Comprehensive employee profiles with editable fields
- Role-based access control (Admin/HR/Employee)
- Employee list with search and filter capabilities
- Document management (planned)

### 📅 Attendance Tracking
- Daily and weekly attendance views
- Check-in/check-out functionality
- Multiple status types: Present, Absent, Half-day, Leave
- Attendance history and reports
- Role-based filtering (Admin/HR see all, Employees see own)

### 🏖️ Leave Management
- Multiple leave types:
  - Vacation Leave
  - Sick Leave
  - Personal Leave
  - Unpaid Leave
- Leave request submission with reason
- Leave balance tracking
- Leave history view
- Approval workflow with comments

### ✅ Approval Workflows
- Dedicated approval dashboard for HR/Admin
- Approve/Reject leave requests
- Add comments to approval decisions
- View request history and details
- Pending requests counter

### 💰 Payroll Management
- View salary structure and breakdown
- Admin can edit employee salaries
- Employees can view own payroll (read-only)
- Download payslips
- Salary components:
  - Basic Salary
  - House Rent Allowance
  - Transport Allowance
  - Medical Allowance
  - Special Allowance
  - Provident Fund
  - Professional Tax
  - Income Tax

### 🔔 Email & Notification Alerts
- Real-time notification center
- Filter notifications by type (All/Unread/Alerts/Emails)
- Mark as read/unread functionality
- Delete notifications
- Email settings modal with toggles:
  - Leave request notifications
  - Leave approval notifications
  - Attendance reminders
  - Payroll generated alerts
  - Birthday wishes
  - System updates

### 📊 Analytics & Reports Dashboard
- Three report types:
  1. **Salary Reports**: Employee payroll summaries with filters
  2. **Attendance Reports**: Monthly attendance statistics
  3. **Payslip Archive**: Historical payslips with download
- Summary cards with key metrics
- Download, Print, and Email functionality
- Color-coded status indicators
- Date range filters

### 🎨 UI/UX Features
- Dark theme with gradient accents (#667eea to #764ba2)
- Smooth animations using Framer Motion
- Pre-loader animation on app start
- Glass-morphism design elements
- Responsive layout
- Interactive hover states and transitions

### 🔐 Role-Based Access Control
- **Admin**: Full system access
  - Manage all employees
  - Approve/reject leave requests
  - View and edit all attendance records
  - Manage payroll for all employees
  - Access to analytics and reports
  
- **HR Officer**: Employee management and approval privileges
  - Manage employee profiles
  - Approve/reject leave requests
  - View and edit attendance records
  - View payroll information
  - Access to reports
  
- **Employee**: Limited to personal data
  - View and edit own profile (limited fields)
  - View own attendance
  - Apply for leave
  - View leave history and balance
  - View own salary information

### 🎛️ Permission System
Granular permissions include:
- `manage_employees`, `view_all_employees`, `edit_all_employees`
- `approve_leave`, `reject_leave`
- `view_all_attendance`, `edit_attendance`, `manage_attendance`
- `view_payroll`, `manage_payroll`
- `view_own_profile`, `edit_own_profile`
- `apply_leave`, `view_leave_history`
- And more...

## 🗄️ Database Architecture

The application includes a complete SQL database schema for production use (see `database/schema.sql`). Current demo uses localStorage.

### Database Tables
- **Users & Authentication**: users, sessions, password_resets
- **Employee Management**: employees, documents
- **Attendance**: attendance, holidays
- **Leave Management**: leave_types, leave_balances, leave_requests
- **Payroll**: salary_structures, payroll, payslips
- **Notifications**: notifications, email_logs, notification_preferences
- **Reports**: report_templates, generated_reports
- **Audit**: audit_logs
- **System**: system_settings

## 🚀 Technology Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Animations**: Framer Motion 11.15.0
- **Icons**: Lucide React 0.469.0
- **Styling**: CSS3 with custom properties
- **State Management**: React Context API
- **Database**: SQL (MySQL/PostgreSQL recommended)
- **Authentication**: Session-based (localStorage for demo)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DayFlow
```

2. Install dependencies:
```bash
npm install
```

3. Start the API server (Node + SQLite sessions):
```bash
npm run dev:server
```

4. In a separate terminal start the Vite dev server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

6. Create your first account using the Sign Up page (or use the default admin below)

### Default Admin Account
- Email: 7brijpatel@gmail.com
- Password: Admin@123

## 📁 Project Structure

```
DayFlow/
├── database/
│   └── schema.sql               # Complete SQL database schema
├── src/
│   ├── components/
│   │   ├── SignUp.jsx          # User registration
│   │   ├── SignIn.jsx          # User login
│   │   ├── Auth.css            # Authentication styling
│   │   ├── Preloader.jsx       # Loading animation
│   │   ├── Dashboard.jsx       # Main dashboard with quick access
│   │   ├── EmployeeList.jsx    # Employee listing
│   │   ├── EmployeeDetail.jsx  # Employee profile details
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Attendance.jsx      # Attendance tracking
│   │   ├── LeaveManagement.jsx # Leave system
│   │   ├── ApprovalWorkflow.jsx # Approval dashboard
│   │   ├── PayrollManagement.jsx # Payroll system
│   │   ├── Notifications.jsx   # Notification center
│   │   ├── Analytics.jsx       # Reports dashboard
│   │   └── RoleSwitcher.jsx    # Role switching UI
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── App.jsx                 # Main application with routing
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security Notes

### Current Implementation (Demo)
- Uses localStorage for user storage (NOT SECURE for production)
- Passwords stored in plain text (NEVER do this in production)
- Client-side only validation
- No rate limiting or CSRF protection

### Production Recommendations
1. **Backend Implementation**
   - Use Node.js/Express or similar for API
   - Implement proper authentication endpoints
   - Use bcrypt/argon2 for password hashing
   - Implement JWT or session-based authentication
   - Add rate limiting for login attempts

2. **Database**
   - Use the provided SQL schema (schema.sql)
   - Set up proper database indexes
   - Implement row-level security
   - Regular backups and disaster recovery

3. **Security Measures**
   - Enable HTTPS/TLS
   - Implement CSRF protection
   - Add input sanitization
   - Set up security headers (CSP, HSTS, etc.)
   - Implement proper logging and monitoring
   - Add two-factor authentication (2FA)
   - Regular security audits

## 🎯 Features in Development

- [ ] Backend API integration
- [ ] Real database connection (MySQL/PostgreSQL)
- [ ] Two-factor authentication (2FA)
- [ ] Password reset functionality
- [ ] Document management for employee profiles
- [ ] Advanced reporting and analytics
- [ ] Performance review system
- [ ] Training and development tracking
- [ ] Organization chart
- [ ] Multi-language support
- [ ] Mobile app version

## 🧪 Testing

To test the authentication system:

1. **Sign Up Flow**
   - Click "Sign Up" on the landing page
   - Fill in all required fields
   - Use a strong password that meets all requirements
   - Select a role and department
   - Submit the form
   - You'll be redirected to Sign In

2. **Sign In Flow**
  - Use the account you created during sign-up
  - Check "Remember me" to persist session
  - Click "Sign In"
  - You'll be redirected to the dashboard

3. **Session Management**
   - Close and reopen the browser
   - If "Remember me" was checked, you'll stay logged in
   - Click logout to clear session

4. **Role Switching (Optional demo helper)**
  - Use the role switcher in the sidebar (bottom)
  - Switch between Admin/HR/Employee roles
  - Observe different permissions and UI elements

## 📝 API Documentation (Planned)

When the backend is implemented, the following endpoints will be available:

```
POST   /api/auth/signup           - Register new user
POST   /api/auth/signin           - Login user
POST   /api/auth/logout           - Logout user
POST   /api/auth/verify-email     - Verify email address
POST   /api/auth/forgot-password  - Request password reset
POST   /api/auth/reset-password   - Reset password with token
GET    /api/auth/me               - Get current user
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow the existing code style
2. Write meaningful commit messages
3. Update documentation for new features
4. Test thoroughly before submitting PR
5. Ensure no console errors

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Note**: This is a demo application. For production use, implement proper backend authentication, database connections, and security measures as outlined in the Security Notes section.
