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
var bcryptjs_1 = require("bcryptjs");
var database_1 = require("../database");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
/**
 * POST /api/auth/login
 * Login endpoint for admin users
 */
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, admin, isPasswordValid, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Username and password are required',
                        })];
                }
                return [4 /*yield*/, (0, database_1.dbGet)('SELECT * FROM admins WHERE username = ? AND is_active = 1', [
                        username,
                    ])];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'Invalid username or password',
                        })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.password_hash)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'Invalid username or password',
                        })];
                }
                token = (0, auth_1.generateToken)(admin.id, admin.username, admin.email);
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    token: token,
                    admin: {
                        id: admin.id,
                        username: admin.username,
                        email: admin.email,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Error during login:', error_1);
                res.status(500).json({
                    error: 'Login failed',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * POST /api/auth/change-password
 * Change admin password (requires authentication)
 */
router.post('/change-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, oldPassword, newPassword, adminId, admin, isOldPasswordValid, hashedNewPassword, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                adminId = (_b = req.admin) === null || _b === void 0 ? void 0 : _b.id;
                if (!adminId) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'Unauthorized',
                        })];
                }
                if (!oldPassword || !newPassword) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Old password and new password are required',
                        })];
                }
                return [4 /*yield*/, (0, database_1.dbGet)('SELECT * FROM admins WHERE id = ?', [adminId])];
            case 1:
                admin = _c.sent();
                if (!admin) {
                    return [2 /*return*/, res.status(404).json({
                            error: 'Admin not found',
                        })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(oldPassword, admin.password_hash)];
            case 2:
                isOldPasswordValid = _c.sent();
                if (!isOldPasswordValid) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'Old password is incorrect',
                        })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 10)];
            case 3:
                hashedNewPassword = _c.sent();
                return [4 /*yield*/, (0, database_1.dbRun)('UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
                        hashedNewPassword,
                        adminId,
                    ])];
            case 4:
                _c.sent();
                res.status(200).json({
                    success: true,
                    message: 'Password changed successfully',
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _c.sent();
                console.error('Error changing password:', error_2);
                res.status(500).json({
                    error: 'Failed to change password',
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
