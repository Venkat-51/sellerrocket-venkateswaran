"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.dbRun = dbRun;
exports.dbGet = dbGet;
exports.dbAll = dbAll;
exports.initializeDatabase = initializeDatabase;
var sqlite3_1 = require("sqlite3");
var path_1 = require("path");
var fs_1 = require("fs");
var dbPath = process.env.DB_PATH || './data/leads.db';
var dbDir = path_1.default.dirname(dbPath);
// Ensure data directory exists
if (!fs_1.default.existsSync(dbDir)) {
    fs_1.default.mkdirSync(dbDir, { recursive: true });
}
// Create database connection
var db = new sqlite3_1.default.Database(dbPath, function (err) {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    }
});
exports.db = db;
// Enable foreign keys and journal mode
db.configure('busyTimeout', 5000);
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA journal_mode = WAL');
// Helper function to promisify db.run
function dbRun(sql, params) {
    if (params === void 0) { params = []; }
    return new Promise(function (resolve, reject) {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes,
                });
            }
        });
    });
}
// Helper function to promisify db.get
function dbGet(sql, params) {
    if (params === void 0) { params = []; }
    return new Promise(function (resolve, reject) {
        db.get(sql, params, function (err, row) {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}
// Helper function to promisify db.all
function dbAll(sql, params) {
    if (params === void 0) { params = []; }
    return new Promise(function (resolve, reject) {
        db.all(sql, params, function (err, rows) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows || []);
            }
        });
    });
}
// Initialize schema
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var adminExists, bcrypt, hashedPassword, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    return [4 /*yield*/, dbRun("\n      CREATE TABLE IF NOT EXISTS leads (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT NOT NULL,\n        phone TEXT NOT NULL,\n        email TEXT NOT NULL,\n        platform TEXT NOT NULL,\n        message TEXT,\n        status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Converted', 'Rejected')),\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dbRun('CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dbRun('CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone)')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dbRun('CREATE INDEX IF NOT EXISTS idx_leads_platform ON leads(platform)')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dbRun('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)')];
                case 5:
                    _a.sent();
                    // Create admins table for authentication
                    return [4 /*yield*/, dbRun("\n      CREATE TABLE IF NOT EXISTS admins (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        username TEXT NOT NULL UNIQUE,\n        email TEXT NOT NULL UNIQUE,\n        password_hash TEXT NOT NULL,\n        is_active INTEGER DEFAULT 1,\n        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP\n      )\n    ")];
                case 6:
                    // Create admins table for authentication
                    _a.sent();
                    return [4 /*yield*/, dbGet('SELECT id FROM admins LIMIT 1')];
                case 7:
                    adminExists = _a.sent();
                    if (!!adminExists) return [3 /*break*/, 10];
                    bcrypt = require('bcryptjs');
                    return [4 /*yield*/, bcrypt.hash('admin123', 10)];
                case 8:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, dbRun("INSERT INTO admins (username, email, password_hash)\n         VALUES (?, ?, ?)", ['admin', 'admin@example.com', hashedPassword])];
                case 9:
                    _a.sent();
                    console.log('✓ Default admin created (username: admin, password: admin123)');
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_1 = _a.sent();
                    console.error('Error initializing database:', error_1);
                    throw error_1;
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.default = db;
