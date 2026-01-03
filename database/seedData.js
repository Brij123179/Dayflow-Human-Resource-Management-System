// DayFlow HRMS - Seed Data Script
// This script creates demo users in localStorage for testing the authentication system
// Run this once in the browser console to set up demo accounts

(function() {
  const demoUsers = [
    {
      id: 1,
      employeeId: 'ADMIN001',
      name: 'Sarah Johnson',
      email: 'admin@dayflow.com',
      password: 'Admin@123', // In production, this would be hashed
      role: 'admin',
      department: 'Human Resources',
      avatar: '👩‍💻',
      emailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      employeeId: 'HR001',
      name: 'Michael Chen',
      email: 'hr@dayflow.com',
      password: 'Hr@12345',
      role: 'hr',
      department: 'Human Resources',
      avatar: '👨‍💼',
      emailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      employeeId: 'EMP001',
      name: 'Emily Rodriguez',
      email: 'employee@dayflow.com',
      password: 'Emp@1234',
      role: 'employee',
      department: 'Marketing',
      avatar: '👩‍💼',
      emailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      employeeId: 'EMP002',
      name: 'John Smith',
      email: 'john.smith@dayflow.com',
      password: 'John@123',
      role: 'employee',
      department: 'Engineering',
      avatar: '👨‍💻',
      emailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      employeeId: 'EMP003',
      name: 'Lisa Wang',
      email: 'lisa.wang@dayflow.com',
      password: 'Lisa@123',
      role: 'employee',
      department: 'Sales',
      avatar: '👩‍💼',
      emailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  // Store in localStorage
  localStorage.setItem('dayflowUsers', JSON.stringify(demoUsers));
  
  console.log('✅ Demo users created successfully!');
  console.log('📧 Demo Accounts:');
  console.log('');
  console.log('🔑 Admin Account:');
  console.log('   Email: admin@dayflow.com');
  console.log('   Password: Admin@123');
  console.log('');
  console.log('🔑 HR Account:');
  console.log('   Email: hr@dayflow.com');
  console.log('   Password: Hr@12345');
  console.log('');
  console.log('🔑 Employee Account:');
  console.log('   Email: employee@dayflow.com');
  console.log('   Password: Emp@1234');
  console.log('');
  console.log('💡 You can now sign in with any of these accounts!');
  console.log('💡 Or create a new account using the Sign Up page.');
})();
