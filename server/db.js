const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'dayflow.db');
const db = new sqlite3.Database(dbPath);

const DEFAULT_ADMIN = {
  employeeId: 'ADMIN001',
  name: 'Admin User',
  email: '7brijpatel@gmail.com',
  password: 'Admin@123',
  role: 'admin',
  department: 'Human Resources',
  avatar: '👩‍💻',
  status: 'active'
};

function init() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeId TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL,
        department TEXT,
        avatar TEXT,
        phone TEXT,
        position TEXT,
        bio TEXT,
        status TEXT DEFAULT 'active',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER UNIQUE NOT NULL,
        emailNotifications INTEGER DEFAULT 1,
        pushNotifications INTEGER DEFAULT 1,
        leaveUpdates INTEGER DEFAULT 1,
        payrollAlerts INTEGER DEFAULT 1,
        announcementAlerts INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'dark',
        language TEXT DEFAULT 'en',
        timeFormat TEXT DEFAULT '12h',
        dateFormat TEXT DEFAULT 'MM/DD/YYYY',
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    // Seed default admin if missing
    db.get('SELECT id FROM users WHERE email = ?', [DEFAULT_ADMIN.email], (err, row) => {
      if (err) {
        console.error('Error checking default admin:', err);
        return;
      }

      if (!row) {
        const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN.password, 10);
        db.run(
          `INSERT INTO users (employeeId, name, email, passwordHash, role, department, avatar, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            DEFAULT_ADMIN.employeeId,
            DEFAULT_ADMIN.name,
            DEFAULT_ADMIN.email,
            passwordHash,
            DEFAULT_ADMIN.role,
            DEFAULT_ADMIN.department,
            DEFAULT_ADMIN.avatar,
            DEFAULT_ADMIN.status
          ],
          (insertErr) => {
            if (insertErr) {
              console.error('Error seeding default admin:', insertErr);
            } else {
              console.log('Default admin seeded');
            }
          }
        );
      }
    });
  });
}

function toSafeUser(row) {
  if (!row) return null;
  const { passwordHash, ...safe } = row;
  return safe;
}

module.exports = { db, init, toSafeUser };
