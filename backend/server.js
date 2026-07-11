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
var express_1 = require("express");
var cors_1 = require("cors");
require("dotenv/config");
var database_1 = require("./database");
var leads_1 = require("./routes/leads");
var auth_1 = require("./routes/auth");
var admin_1 = require("./routes/admin");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
// FRONTEND_URL can be a comma-separated list of allowed origins.
// e.g. "https://sellerrocket-venkateswaran.vercel.app,http://localhost:5173"
var allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(function (o) { return o.trim(); })
    .filter(Boolean);
console.log('✓ Allowed CORS origins:', allowedOrigins);
var server;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("CORS: origin " + origin + " not allowed"));
    },
    credentials: true,
}));
// Root endpoint
app.get('/', function (req, res) {
    res.status(200).json({
        message: 'Leads API is running',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            leads: {
                list: 'GET /api/leads',
                create: 'POST /api/leads',
                get: 'GET /api/leads/:id',
                updateStatus: 'PATCH /api/leads/:id/status',
                delete: 'DELETE /api/leads/:id',
            },
        },
    });
});
// Health check endpoint
app.get('/health', function (req, res) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use('/api/leads', leads_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
// 404 handler
app.use(function (req, res) {
    res.status(404).json({
        error: 'Route not found',
    });
});
// Error handling middleware
app.use(function (err, req, res, next) {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
    });
});
// Initialize database and start server
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, database_1.initializeDatabase)()];
            case 1:
                _a.sent();
                console.log('✓ Database initialized');
                server = app.listen(PORT, function () {
                    console.log("\u2713 Server running on http://localhost:".concat(PORT));
                    console.log("\u2713 CORS enabled for ".concat(FRONTEND_URL));
                });
                server.on('error', function (err) {
                    if (err && err.code === 'EADDRINUSE') {
                        console.error("Port ".concat(PORT, " is already in use. Stop the other process or set a different PORT."));
                        process.exit(1);
                    }
                    else {
                        console.error('Unhandled server error:', err);
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Failed to start server:', error_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
// Graceful shutdown
process.on('SIGINT', function () {
    console.log('\n✓ Shutting down gracefully...');
    if (server && typeof server.close === 'function') {
        server.close(function () {
            database_1.default.close();
            process.exit(0);
        });
    }
    else {
        database_1.default.close();
        process.exit(0);
    }
});
process.on('uncaughtException', function (err) {
    console.error('Uncaught exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', function (reason) {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
});
