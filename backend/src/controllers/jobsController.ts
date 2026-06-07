import { Request, Response } from 'express';
import pool from '../db/connection';

// GET /api/jobs — всі заявки
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/jobs/:id — одна заявка
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/jobs — додати заявку
export const createJob = async (req: Request, res: Response) => {
  try {
    const { company, position, status, applied_date, notes, job_url } = req.body;
    const result = await pool.query(
      `INSERT INTO jobs (company, position, status, applied_date, notes, job_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company, position, status || 'sent', applied_date, notes, job_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/jobs/:id — оновити заявку
export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company, position, status, applied_date, notes, job_url } = req.body;
    const result = await pool.query(
      `UPDATE jobs SET
        company = $1, position = $2, status = $3,
        applied_date = $4, notes = $5, job_url = $6,
        updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [company, position, status, applied_date, notes, job_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/jobs/:id — видалити заявку
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING *', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ message: 'Job deleted', job: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};