# Quick Setup Guide - DayFlow HRMS

## Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Dev Server
```bash
npm run dev
```

Open the app at `http://localhost:5173`.

### Step 3: Create Your Account
1. Click "Sign Up" on the sign-in page
2. Fill in all fields:
   - Role (Employee/HR/Admin)
   - Password (must meet security requirements)
3. Click "Create Account"
4. You'll be redirected to Sign In
5. Use your new credentials to log in

## Features to Explore

### As Admin
- View all employees
- Edit any employee profile
- Approve/reject leave requests
- Manage payroll for all employees
- View analytics and reports
- Access all system features

### As HR Officer
- View all employees
- Edit employee profiles
- Approve/reject leave requests
- View attendance records
- View payroll information
- Generate reports

### As Employee
- View and edit own profile (limited fields)
- Check in/Check out for attendance
- Apply for leave
- View leave history and balance
- View own salary information
- View notifications

## Testing Different Roles

Use the **Role Switcher** at the bottom of the sidebar to test different roles without signing out:

1. Look for the dropdown at the bottom of the sidebar
2. Select Admin, HR, or Employee
3. UI and permissions will update instantly

## Key Features

### Authentication
- Sign Up
- Sign In with remember me
- Password security validation
- Session management

### Attendance
- Daily/Weekly views
- Check-in/Check-out functionality
- Status tracking (Present/Absent/Half-day/Leave)
- Attendance statistics

### Leave Management
- Submit leave requests with reason
- Multiple leave types (Vacation, Sick, Personal, Unpaid)
- View leave balance and history
- Approval workflow with comments

### Payroll
- View salary breakdown
- Admin can edit salaries
- Download payslips
- Monthly payroll summary

### Notifications
- Real-time notification center
- Filter by type (All/Unread/Alerts/Emails)
- Email settings for preferences
- Mark as read/delete

### Analytics
- Salary reports
- Attendance reports
- Payslip archive
- Download/Print/Email functionality

## Common Tasks

### Apply for Leave (Employee)
1. Go to "Leave Management"
2. Click "Request Leave"
3. Fill in the form (type, dates, reason)
4. Submit
5. Wait for HR/Admin approval

### Approve Leave (HR/Admin)
1. Go to "Approvals"
2. View pending requests
3. Click approve or reject
4. Optionally add a comment
5. Submit

### Check Attendance
1. Go to "Attendance"
2. Switch between Daily/Weekly view
3. Employees: Check in/out using buttons
4. Admin/HR: View all employee attendance

### View Payslip
1. Go to "Payroll"
2. View salary breakdown
3. Click "Download Payslip" to save PDF

### Generate Reports (Admin/HR)
1. Go to "Analytics & Reports"
2. Select report type (Salary/Attendance/Payslip)
3. Apply filters if needed
4. Download, Print, or Email

## Troubleshooting

### Can't Sign In
- Create a new account using Sign Up

### "Email not verified" Error
- This is a simulation - the app automatically verifies on sign-in
- If you see this, try refreshing and signing in again

### Session Expired
- Simply sign in again
- Check "Remember me" for longer sessions (30 days)

### Role Switcher Not Working
- Role switcher is for demo/testing only
- In production, roles are assigned during sign-up and managed by admin

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Production Checklist

Before deploying to production, you MUST:

1. **Set up a backend API**
   - Use Node.js/Express, Django, or similar
   - Implement authentication endpoints

2. **Set up a database**
   - Use the provided SQL schema (`database/schema.sql`)
   - MySQL, PostgreSQL, or similar recommended

3. **Implement security measures**
   - Hash passwords with bcrypt/argon2
   - Use JWT or session-based auth
   - Enable HTTPS/TLS
   - Add CSRF protection
   - Implement rate limiting

4. **Configure email service (optional)**
   - SendGrid, AWS SES, or similar

5. **Update environment variables**
   - API endpoints
   - Database credentials
   - Email service credentials
   - Session secrets

## Tech Stack

- **React 18.3.1** - UI library
- **Vite 6.0.5** - Build tool
- **Framer Motion 11.15.0** - Animations
- **Lucide React 0.469.0** - Icons
- **SQL** - Database (production)

## Project Structure

```
DayFlow/
├── database/
│   └── schema.sql       # Production SQL schema
├── src/
│   ├── components/      # All React components
│   │   ├── SignUp.jsx
│   │   ├── SignIn.jsx
│   │   ├── Auth.css
│   │   └── ... (other components)
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
└── README.md
```

## Need Help?

1. Check the full README.md for detailed documentation
2. Review the SQL schema in `database/schema.sql`
3. Look at component source code for implementation details
4. Open an issue on GitHub for bugs or questions

## Development Tips

- Use the role switcher to test different permissions
- Check browser console for any errors
- Use React DevTools for component inspection
- Test all features before building for production
- Always run `npm run build` to check for errors before deploying

---

**Happy Developing! 🚀**

For production deployment, remember to implement proper backend authentication and use the provided SQL schema.
