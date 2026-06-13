"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatusUpdate = exports.validateLeadInput = exports.validatePhone = exports.validateEmail = void 0;
// Email validation regex
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone validation - accepts common formats
var PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
var validateEmail = function (email) {
    return EMAIL_REGEX.test(email);
};
exports.validateEmail = validateEmail;
var validatePhone = function (phone) {
    // Remove common formatting characters
    var cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    return PHONE_REGEX.test(phone) && cleanPhone.length >= 10;
};
exports.validatePhone = validatePhone;
var validateLeadInput = function (req, res, next) {
    try {
        var _a = req.body, name_1 = _a.name, phone = _a.phone, email = _a.email, platform = _a.platform, message = _a.message;
        // Check required fields
        if (!name_1 || !phone || !email || !platform) {
            return res.status(400).json({
                error: 'Missing required fields: name, phone, email, platform',
            });
        }
        // Validate data types and lengths
        if (typeof name_1 !== 'string' || name_1.trim().length === 0) {
            return res.status(400).json({ error: 'Name must be a non-empty string' });
        }
        if (typeof phone !== 'string' || phone.trim().length === 0) {
            return res.status(400).json({ error: 'Phone must be a non-empty string' });
        }
        if (typeof email !== 'string' || email.trim().length === 0) {
            return res.status(400).json({ error: 'Email must be a non-empty string' });
        }
        if (typeof platform !== 'string' || platform.trim().length === 0) {
            return res.status(400).json({ error: 'Platform must be a non-empty string' });
        }
        // Validate email format
        if (!(0, exports.validateEmail)(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Validate phone format
        if (!(0, exports.validatePhone)(phone)) {
            return res.status(400).json({ error: 'Invalid phone format' });
        }
        // Validate name length
        if (name_1.length > 255) {
            return res.status(400).json({ error: 'Name must be less than 255 characters' });
        }
        // Validate platform
        var validPlatforms = ['Shopify', 'WooCommerce', 'BigCommerce', 'Custom', 'Other'];
        if (!validPlatforms.includes(platform)) {
            return res.status(400).json({
                error: "Platform must be one of: ".concat(validPlatforms.join(', ')),
            });
        }
        // Validate message if provided
        if (message && typeof message !== 'string') {
            return res.status(400).json({ error: 'Message must be a string' });
        }
        if (message && message.length > 5000) {
            return res.status(400).json({ error: 'Message must be less than 5000 characters' });
        }
        // Attach validated data to request
        req.validatedData = {
            name: name_1.trim(),
            phone: phone.trim(),
            email: email.toLowerCase().trim(),
            platform: platform.trim(),
            message: message ? message.trim() : undefined,
        };
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Validation error' });
    }
};
exports.validateLeadInput = validateLeadInput;
var validateStatusUpdate = function (req, res, next) {
    try {
        var status_1 = req.body.status;
        if (!status_1) {
            return res.status(400).json({ error: 'Status field is required' });
        }
        var validStatuses = ['New', 'Contacted', 'Converted', 'Rejected'];
        if (!validStatuses.includes(status_1)) {
            return res.status(400).json({
                error: "Status must be one of: ".concat(validStatuses.join(', ')),
            });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Validation error' });
    }
};
exports.validateStatusUpdate = validateStatusUpdate;
