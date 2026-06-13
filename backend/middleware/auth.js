"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.generateToken = generateToken;
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
/**
 * Middleware to verify JWT token from Authorization header
 */
function verifyToken(req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Missing or invalid authorization header',
        });
    }
    var token = authHeader.substring(7);
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.admin = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        return res.status(403).json({
            error: 'Invalid or expired token',
        });
    }
}
/**
 * Generate JWT token for admin
 */
function generateToken(adminId, username, email) {
    return jsonwebtoken_1.default.sign({ id: adminId, username: username, email: email }, JWT_SECRET, { expiresIn: '7d' });
}
