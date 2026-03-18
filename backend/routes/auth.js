const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Authority Login
router.post('/authority/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, password } = req.body;
    const connection = await pool.getConnection();

    // Find authority
    const [authorities] = await connection.query(
      'SELECT * FROM authorities WHERE username = ?',
      [username]
    );

    if (!authorities.length) {
      connection.release();
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    const authority = authorities[0];

    // Check if account is active
    if (!authority.is_active) {
      connection.release();
      return res.status(401).json({ status: false, message: 'Account is inactive' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, authority.password);
    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ status: false, message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: authority.id, role: authority.role, email: authority.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    connection.release();

    res.status(200).json({
      status: true,
      message: 'Login successful',
      token,
      authority: {
        id: authority.id,
        name: authority.name,
        email: authority.email,
        role: authority.role,
        department_id: authority.department_id
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: false, message: 'Login failed', error: error.message });
  }
});

// Forgot Password
router.post('/authority/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    // In production, send reset email
    res.status(200).json({
      status: true,
      message: 'Password reset link sent to email'
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error processing request', error: error.message });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ status: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ status: true, user: decoded });

  } catch (error) {
    res.status(401).json({ status: false, message: 'Invalid token' });
  }
});

module.exports = router;
