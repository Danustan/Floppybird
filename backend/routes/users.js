const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get user's complaints
router.get('/:userId/complaints', async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      `SELECT c.*, v.name as violation_type, a.name as authority_name
       FROM complaints c
       JOIN violation_types v ON c.violation_type_id = v.id
       LEFT JOIN authorities a ON c.assigned_to = a.id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    connection.release();

    res.status(200).json({
      status: true,
      complaints
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching complaints', error: error.message });
  }
});

// Get all violation types (for report submission)
router.get('/violation-types/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [violationTypes] = await connection.query(
      `SELECT vt.*, d.name as department_name, d.phone, d.email, d.address
       FROM violation_types vt
       LEFT JOIN departments d ON vt.department_id = d.id
       ORDER BY vt.name ASC`
    );

    connection.release();

    res.status(200).json({
      status: true,
      violationTypes
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching violation types', error: error.message });
  }
});

module.exports = router;
