import { Request, Response, NextFunction } from 'express';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - accepts common formats
const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export interface ValidatedLeadRequest extends Request {
  validatedData?: {
    name: string;
    phone: string;
    email: string;
    platform: string;
    message?: string;
  };
}

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
  return PHONE_REGEX.test(phone) && cleanPhone.length >= 10;
};

export const validateLeadInput = (req: ValidatedLeadRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, platform, message } = req.body;

    // Check required fields
    if (!name || !phone || !email || !platform) {
      return res.status(400).json({
        error: 'Missing required fields: name, phone, email, platform',
      });
    }

    // Validate data types and lengths
    if (typeof name !== 'string' || name.trim().length === 0) {
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
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone format
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    // Validate name length
    if (name.length > 255) {
      return res.status(400).json({ error: 'Name must be less than 255 characters' });
    }

    // Validate platform
    const validPlatforms = ['Shopify', 'WooCommerce', 'BigCommerce', 'Custom', 'Other'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        error: `Platform must be one of: ${validPlatforms.join(', ')}`,
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
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      platform: platform.trim(),
      message: message ? message.trim() : undefined,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Validation error' });
  }
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status field is required' });
    }

    const validStatuses = ['New', 'Contacted', 'Converted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Validation error' });
  }
};
