const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db, init, toSafeUser } = require('./db');

const PORT = process.env.PORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dayflow-session-secret';

init();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: 'dayflow.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({
    dir: path.join(__dirname, '..', 'database'),
    db: 'sessions.db'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    secure: false
  }
}));

// Helpers
const requireFields = (body, fields) => fields.every(f => body[f] !== undefined && body[f] !== '');

// Routes
app.post('/api/auth/signup', (req, res) => {
  const { employeeId, name, email, password, role, department } = req.body;

  if (!requireFields(req.body, ['employeeId', 'name', 'email', 'password', 'role'])) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  db.get('SELECT id FROM users WHERE email = ? OR employeeId = ?', [email, employeeId], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (row) return res.status(409).json({ message: 'User with this email or employee ID already exists' });

    const passwordHash = bcrypt.hashSync(password, 10);
    db.run(
      `INSERT INTO users (employeeId, name, email, passwordHash, role, department, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [employeeId, name, email, passwordHash, role, department],
      function(insertErr) {
        if (insertErr) return res.status(500).json({ message: 'Failed to create user' });

        db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (getErr, created) => {
          if (getErr) return res.status(500).json({ message: 'Failed to load user' });
          res.status(201).json(toSafeUser(created));
        });
      }
    );
  });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  if (!requireFields(req.body, ['email', 'password'])) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const safeUser = toSafeUser(user);
    req.session.user = safeUser;
    res.json(safeUser);
  });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json(req.session.user);
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Failed to logout' });
    res.clearCookie('dayflow.sid');
    res.json({ success: true });
  });
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  
  const userId = req.session.user.id;
  
  db.get('SELECT * FROM user_settings WHERE userId = ?', [userId], (err, settings) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    if (!settings) {
      // Create default settings
      db.run(
        `INSERT INTO user_settings (userId) VALUES (?)`,
        [userId],
        function(insertErr) {
          if (insertErr) return res.status(500).json({ message: 'Failed to create settings' });
          
          db.get('SELECT * FROM user_settings WHERE id = ?', [this.lastID], (getErr, newSettings) => {
            if (getErr) return res.status(500).json({ message: 'Failed to load settings' });
            res.json(newSettings);
          });
        }
      );
    } else {
      res.json(settings);
    }
  });
});

app.put('/api/settings', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  
  const userId = req.session.user.id;
  const {
    emailNotifications,
    pushNotifications,
    leaveUpdates,
    payrollAlerts,
    announcementAlerts,
    theme,
    language,
    timeFormat,
    dateFormat
  } = req.body;
  
  db.run(
    `UPDATE user_settings SET 
      emailNotifications = ?,
      pushNotifications = ?,
      leaveUpdates = ?,
      payrollAlerts = ?,
      announcementAlerts = ?,
      theme = ?,
      language = ?,
      timeFormat = ?,
      dateFormat = ?,
      updatedAt = CURRENT_TIMESTAMP
    WHERE userId = ?`,
    [
      emailNotifications ? 1 : 0,
      pushNotifications ? 1 : 0,
      leaveUpdates ? 1 : 0,
      payrollAlerts ? 1 : 0,
      announcementAlerts ? 1 : 0,
      theme,
      language,
      timeFormat,
      dateFormat,
      userId
    ],
    function(err) {
      if (err) return res.status(500).json({ message: 'Failed to update settings' });
      
      db.get('SELECT * FROM user_settings WHERE userId = ?', [userId], (getErr, settings) => {
        if (getErr) return res.status(500).json({ message: 'Failed to load settings' });
        res.json(settings);
      });
    }
  );
});

app.put('/api/user/profile', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  
  const userId = req.session.user.id;
  const { name, phone, department, position, bio } = req.body;
  
  db.run(
    `UPDATE users SET name = ?, phone = ?, department = ?, position = ?, bio = ? WHERE id = ?`,
    [name, phone, department, position, bio, userId],
    function(err) {
      if (err) return res.status(500).json({ message: 'Failed to update profile' });
      
      db.get('SELECT * FROM users WHERE id = ?', [userId], (getErr, user) => {
        if (getErr) return res.status(500).json({ message: 'Failed to load user' });
        const safeUser = toSafeUser(user);
        req.session.user = safeUser;
        res.json(safeUser);
      });
    }
  );
});

app.post('/api/user/change-password', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  
  const userId = req.session.user.id;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required' });
  }
  
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const valid = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });
    
    const newPasswordHash = bcrypt.hashSync(newPassword, 10);
    db.run(
      'UPDATE users SET passwordHash = ? WHERE id = ?',
      [newPasswordHash, userId],
      function(updateErr) {
        if (updateErr) return res.status(500).json({ message: 'Failed to update password' });
        res.json({ success: true, message: 'Password updated successfully' });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
