import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbGet, dbRun } from '../database';
import { generateToken } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login endpoint for admin users
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required',
      });
    }

    // Find admin by username
    const admin = await dbGet('SELECT * FROM admins WHERE username = ? AND is_active = 1', [
      username,
    ]);

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid username or password',
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid username or password',
      });
    }

    // Generate token
    const token = generateToken(admin.id, admin.username, admin.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      error: 'Login failed',
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change admin password (requires authentication)
 */
router.post('/change-password', async (req: any, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: 'Old password and new password are required',
      });
    }

    // Get admin
    const admin = await dbGet('SELECT * FROM admins WHERE id = ?', [adminId]);

    if (!admin) {
      return res.status(404).json({
        error: 'Admin not found',
      });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password_hash);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        error: 'Old password is incorrect',
      });
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await dbRun('UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      hashedNewPassword,
      adminId,
    ]);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      error: 'Failed to change password',
    });
  }
});

export default router;
