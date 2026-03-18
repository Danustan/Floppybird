const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [departments] = await connection.query(
      'SELECT * FROM departments ORDER BY name ASC'
    );

    connection.release();

    res.status(200).json({
      status: true,
      departments
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching departments', error: error.message });
  }
});

// Get department by ID with contact info
router.get('/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const connection = await pool.getConnection();

    const [departments] = await connection.query(
      'SELECT * FROM departments WHERE id = ?',
      [departmentId]
    );

    if (!departments.length) {
      connection.release();
      return res.status(404).json({ status: false, message: 'Department not found' });
    }

    connection.release();

    res.status(200).json({
      status: true,
      department: departments[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching department', error: error.message });
  }
});

// Get violation types for a department
router.get('/:departmentId/violation-types', async (req, res) => {
  try {
    const { departmentId } = req.params;
    const connection = await pool.getConnection();

    const [violationTypes] = await connection.query(
      'SELECT * FROM violation_types WHERE department_id = ?',
      [departmentId]
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
