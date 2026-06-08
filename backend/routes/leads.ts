import express, { Request, Response } from 'express';
import { dbRun, dbGet, dbAll } from '../database';
import { validateLeadInput, validateStatusUpdate, ValidatedLeadRequest } from '../middleware/validation';

const router = express.Router();

// POST /api/leads - Create a new lead
router.post('/', validateLeadInput, async (req: ValidatedLeadRequest, res: Response) => {
  try {
    const { name, phone, email, platform, message } = req.validatedData!;

    // Check for duplicate email
    const existingLead = await dbGet('SELECT id FROM leads WHERE email = ?', [email]);
    if (existingLead) {
      return res.status(400).json({
        error: 'A lead with this email already exists',
      });
    }

    // Insert lead into database
    const result = await dbRun(
      `INSERT INTO leads (name, phone, email, platform, message, status)
       VALUES (?, ?, ?, ?, ?, 'New')`,
      [name, phone, email, platform, message || null]
    );

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead: {
        id: result.lastID,
        name,
        phone,
        email,
        platform,
        message,
        status: 'New',
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      error: 'Failed to create lead',
    });
  }
});

// GET /api/leads - Get all leads with optional platform filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { platform } = req.query;
    let query = 'SELECT * FROM leads ORDER BY created_at DESC';
    const params: any[] = [];

    if (platform) {
      query += ' WHERE platform = ?';
      params.push(platform);
    }

    const leads = await dbAll(query, params);

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      error: 'Failed to fetch leads',
    });
  }
});

// GET /api/leads/:id - Get a specific lead
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
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

// PATCH /api/leads/:id/status - Update lead status
router.patch('/:id/status', validateStatusUpdate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID is a number
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }

    // Check if lead exists
    const lead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);
    if (!lead) {
      return res.status(404).json({
        error: 'Lead not found',
      });
    }

    // Update status
    await dbRun(
      'UPDATE leads SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      lead: {
        ...lead,
        status,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({
      error: 'Failed to update lead status',
    });
  }
});

// DELETE /api/leads/:id - Delete a lead
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }

    // Check if lead exists
    const lead = await dbGet('SELECT * FROM leads WHERE id = ?', [id]);
    if (!lead) {
      return res.status(404).json({
        error: 'Lead not found',
      });
    }

    // Delete lead
    await dbRun('DELETE FROM leads WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({
      error: 'Failed to delete lead',
    });
  }
});

export default router;
