const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Get admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Overall stats
    const [stats] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM complaints) as total_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'resolved') as resolved_complaints,
        (SELECT COUNT(*) FROM complaints WHERE status = 'in_progress') as in_progress,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM authorities) as total_authorities,
        (SELECT COUNT(*) FROM departments) as total_departments
    `);

    // Recent complaints
    const [recentComplaints] = await connection.query(`
      SELECT c.*, v.name as violation_type, u.name as user_name
      FROM complaints c
      JOIN violation_types v ON c.violation_type_id = v.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 10
    `);

    connection.release();

    res.status(200).json({
      status: true,
      stats: stats[0],
      recentComplaints
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching admin dashboard', error: error.message });
  }
});

// Create new authority
router.post('/authorities/create', [
  body('username').notEmpty(),
  body('password').isLength({ min: 6 }),
  body('email').isEmail(),
  body('name').notEmpty(),
  body('department_id').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, password, email, name, phone, department_id } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();

    const [result] = await connection.query(
      'INSERT INTO authorities (username, password, email, name, phone, department_id) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, email, name, phone || null, department_id]
    );

    connection.release();

    res.status(201).json({
      status: true,
      message: 'Authority created successfully',
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error creating authority', error: error.message });
  }
});

// Get all violations for review
router.get('/violations/report', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [violations] = await connection.query(`
      SELECT 
        v.id,
        v.name,
        COUNT(c.id) as complaint_count,
        v.severity
      FROM violation_types v
      LEFT JOIN complaints c ON v.id = c.violation_type_id
      GROUP BY v.id, v.name, v.severity
      ORDER BY complaint_count DESC
    `);

    connection.release();

    res.status(200).json({
      status: true,
      violations
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching violations report', error: error.message });
  }
});

module.exports = router;
