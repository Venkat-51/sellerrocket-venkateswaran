import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// ─── Resolve a writable database path ───────────────────────────────────────
// Priority:
//   1. DB_PATH env var (e.g. /data/leads.db on Render with persistent disk)
//   2. ./data/leads.db  (local development)
//   3. /tmp/leads.db    (Render free tier / any env where ./data is not writable)
//
// The fallback to /tmp is ephemeral (data lost on restart) but keeps the
// service running until a persistent disk or proper DB_PATH is configured.

function resolveDbPath(): string {
  const candidates = [
    process.env.DB_PATH,
    path.resolve('./data/leads.db'),
    '/tmp/leads.db',
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const dir = path.dirname(candidate);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Verify the directory is actually writable
      const testFile = path.join(dir, '.write_test');
      fs.writeFileSync(testFile, '');
      fs.unlinkSync(testFile);
      console.log(`✓ Database path resolved: ${candidate}`);
      return candidate;
    } catch {
      console.warn(`  Skipping ${candidate} (not writable), trying next...`);
    }
  }

  // Should never reach here since /tmp is always writable
  throw new Error('No writable path found for SQLite database');
}

const resolvedDbPath = resolveDbPath();

// Create database connection
const db = new sqlite3.Database(resolvedDbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// Enable foreign keys and journal mode
db.configure('busyTimeout', 5000);
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');

// Helper function to promisify db.run
export function dbRun(
  sql: string,
  params: any[] = []
): Promise<{ lastID?: number; changes?: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
      }
    });
  });
}

// Helper function to promisify db.get
export function dbGet(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to promisify db.all
export function dbAll(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// Initialize schema
export async function initializeDatabase() {
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        platform TEXT NOT NULL,
        message TEXT,
        status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Converted', 'Rejected')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(
      'CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)'
    );
    await dbRun(
      'CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone)'
    );
    await dbRun(
      'CREATE INDEX IF NOT EXISTS idx_leads_platform ON leads(platform)'
    );
    await dbRun(
      'CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)'
    );

    // Create admins table for authentication
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create default admin if it doesn't exist
    const adminExists = await dbGet('SELECT id FROM admins LIMIT 1');
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await dbRun(
        `INSERT INTO admins (username, email, password_hash)
         VALUES (?, ?, ?)`,
        ['admin', 'admin@example.com', hashedPassword]
      );
      console.log('✓ Default admin created (username: admin, password: admin123)');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export { db };
export default db;
