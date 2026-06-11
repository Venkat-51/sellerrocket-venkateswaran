import express, { Response } from 'express';
import { dbRun, dbGet, dbAll } from '../database';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { validateStatusUpdate } from '../middleware/validation';

const router = express.Router();

/**
 * GET /api/admin/leads
 * Get all leads with filtering, sorting, and search (admin only)
 */
router.get('/leads', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { platform, status, search, sortBy = 'created_at', sortOrder = 'DESC', limit = '50', offset = '0' } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];

    // Apply filters
    if (platform) {
      query += ' AND platform = ?';
      params.push(platform);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Add sorting
    const allowedSortFields = ['id', 'created_at', 'updated_at', 'name', 'status'];
    const sortField = allowedSortFields.includes(String(sortBy)) ? sortBy : 'created_at';
    const sortDir = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortDir}`;

    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM leads WHERE 1=1';
    const countParams: any[] = [];

    if (platform) {
      countQuery += ' AND platform = ?';
      countParams.push(platform);
    }
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }
    if (search) {
      countQuery += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await dbGet(countQuery, countParams);
    const total = countResult?.count || 0;

    // Apply pagination
    const pageLimit = Math.min(Number(limit) || 50, 500);
    const pageOffset = Number(offset) || 0;
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageLimit, pageOffset);

    const leads = await dbAll(query, params);

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          limit: pageLimit,
          offset: pageOffset,
          pages: Math.ceil(total / pageLimit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      error: 'Failed to fetch leads',
    });
  }
});

/**
 * GET /api/admin/leads/:id
 * Get a specific lead (admin only)
 */
router.get('/leads/:id', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }

    const lead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);

    if (!lead) {
      return res.status(404).json({
        error: 'Lead not found',
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({
      error: 'Failed to fetch lead',
    });
  }
});

/**
 * PATCH /api/admin/leads/:id
 * Update a lead (admin only)
 */
router.patch('/leads/:id', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, name, email, phone, platform, message } = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }

    const lead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);

    if (!lead) {
      return res.status(404).json({
        error: 'Lead not found',
      });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (status) updates.push('status = ?'), values.push(status);
    if (name) updates.push('name = ?'), values.push(name);
    if (email) updates.push('email = ?'), values.push(email);
    if (phone) updates.push('phone = ?'), values.push(phone);
    if (platform) updates.push('platform = ?'), values.push(platform);
    if (message !== undefined) updates.push('message = ?'), values.push(message);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await dbRun(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedLead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({
      error: 'Failed to update lead',
    });
  }
});

/**
 * DELETE /api/admin/leads/:id
 * Delete a lead (admin only)
 */
router.delete('/leads/:id', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }

    const lead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);

    if (!lead) {
      return res.status(404).json({
        error: 'Lead not found',
      });
    }

    await dbRun('DELETE FROM leads WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      deletedLead: lead,
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      error: 'Failed to delete lead',
    });
  }
});

/**
 * GET /api/admin/analytics
 * Get analytics data for dashboard (admin only)
 */
router.get('/analytics', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Total leads
    const totalLeads = await dbGet('SELECT COUNT(*) as count FROM leads');

    // Leads by status
    const leadsByStatus = await dbAll(
      `SELECT status, COUNT(*) as count FROM leads GROUP BY status`
    );

    // Leads by platform
    const leadsByPlatform = await dbAll(
      `SELECT platform, COUNT(*) as count FROM leads GROUP BY platform`
    );

    // Recent leads (last 7 days)
    const recentLeads = await dbGet(
      `SELECT COUNT(*) as count FROM leads WHERE created_at >= datetime('now', '-7 days')`
    );

    // Conversion rate (Converted vs Total)
    const convertedLeads = await dbGet(
      `SELECT COUNT(*) as count FROM leads WHERE status = 'Converted'`
    );

    const conversionRate =
      totalLeads.count > 0
        ? Math.round((convertedLeads.count / totalLeads.count) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLeads: totalLeads.count,
        recentLeads: recentLeads.count,
        convertedLeads: convertedLeads.count,
        conversionRate: `${conversionRate}%`,
        leadsByStatus,
        leadsByPlatform,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
    });
  }
});

export default router;
