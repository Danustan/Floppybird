const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/complaints'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const uploadLimits = {
  fileSize: 50 * 1024 * 1024 // 50MB
};

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
    'image/tiff',
    'image/x-icon',
    // Videos
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm',
    'video/x-flv',
    'video/x-ms-wmv',
    'video/3gpp',
    'video/3gpp2',
    'video/x-m4v',
    'video/mpeg',
    'video/ogg'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPG, PNG, GIF, WebP, BMP, MP4, WebM, AVI, MOV, MKV, and more'), false);
  }
};

const upload = multer({ storage, limits: uploadLimits, fileFilter });

// Multer error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ status: false, message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
  next();
};

// Submit a new complaint (User side)
router.post('/submit', (req, res, next) => {
  upload.array('proofs', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }
    next();
  });
}, [
  body('user_name').notEmpty().withMessage('Name is required'),
  body('user_email').isEmail().withMessage('Valid email is required'),
  body('violation_type_id').isInt().withMessage('Violation type is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location_address').notEmpty().withMessage('Location address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { user_name, user_email, user_phone, violation_type_id, title, description, location_address, location_lat, location_lng } = req.body;

    // Validate required fields
    if (!user_name || !user_email || !violation_type_id || !title || !description || !location_address) {
      return res.status(400).json({ status: false, message: 'All required fields must be filled' });
    }

    const connection = await pool.getConnection();

    // Create or get user
    let [users] = await connection.query('SELECT id FROM users WHERE email = ?', [user_email]);
    let userId;

    if (users.length > 0) {
      userId = users[0].id;
    } else {
      const [result] = await connection.query(
        'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
        [user_name, user_email, user_phone || null]
      );
      userId = result.insertId;
    }

    // Insert complaint
    const [complaintResult] = await connection.query(
      `INSERT INTO complaints (user_id, violation_type_id, title, description, location_address, location_lat, location_lng, severity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, violation_type_id, title, description, location_address, location_lat, location_lng, 5]
    );

    const complaintId = complaintResult.insertId;

    // Upload proofs (if any)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.startsWith('image') ? 'image' : 'video';
        // Convert absolute path to relative URL path
        const relativePath = '/uploads/complaints/' + path.basename(file.path);
        await connection.query(
          'INSERT INTO complaint_evidence (complaint_id, file_path, file_type, mime_type, file_size) VALUES (?, ?, ?, ?, ?)',
          [complaintId, relativePath, fileType, file.mimetype, file.size]
        );
      }

      await connection.query(
        'UPDATE complaints SET proof_count = ? WHERE id = ?',
        [req.files.length, complaintId]
      );
    }

    // Get suggested departments based on violation type
    const [mappings] = await connection.query(
      `SELECT d.* FROM departments d
       JOIN violation_department_mapping vdm ON d.id = vdm.department_id
       WHERE vdm.violation_type_id = ?
       ORDER BY vdm.priority ASC
       LIMIT 3`,
      [violation_type_id]
    );

    connection.release();

    res.status(201).json({
      status: true,
      message: 'Complaint submitted successfully',
      complaintId,
      suggestedDepartments: mappings
    });

  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ status: false, message: 'Error submitting complaint', error: error.message });
  }
});

// Get complaint status (User side)
router.get('/:complaintId/status', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const connection = await pool.getConnection();

    const [complaints] = await connection.query(
      `SELECT c.*, v.name as violation_type, u.email as user_email, u.name as user_name, u.phone as user_phone, a.name as authority_name
       FROM complaints c
       JOIN violation_types v ON c.violation_type_id = v.id
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN authorities a ON c.assigned_to = a.id
       WHERE c.id = ?`,
      [complaintId]
    );

    if (!complaints.length) {
      connection.release();
      return res.status(404).json({ status: false, message: 'Complaint not found' });
    }

    const complaint = complaints[0];

    // Get updates
    const [updates] = await connection.query(
      `SELECT cu.*, a.name as authority_name
       FROM complaint_updates cu
       LEFT JOIN authorities a ON cu.authority_id = a.id
       WHERE cu.complaint_id = ?
       ORDER BY cu.created_at DESC`,
      [complaintId]
    );

    // Get evidence
    const [evidence] = await connection.query(
      `SELECT id, complaint_id, file_path, file_type, mime_type, file_size, 
              SUBSTRING_INDEX(file_path, '/', -1) as file_name, uploaded_at
       FROM complaint_evidence
       WHERE complaint_id = ?
       ORDER BY uploaded_at DESC`,
      [complaintId]
    );

    connection.release();

    res.status(200).json({
      status: true,
      complaint,
      evidence,
      updates
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching complaint status', error: error.message });
  }
});

// Get all complaints (Authority side with filters)
router.get('/', async (req, res) => {
  try {
    const { status, sort = 'created_at', order = 'DESC', page = 1, limit = 20, department_id } = req.query;

    const connection = await pool.getConnection();
    let query = `SELECT c.*, v.name as violation_type, u.name as user_name, u.email as user_email, a.name as authority_name
                 FROM complaints c
                 JOIN violation_types v ON c.violation_type_id = v.id
                 LEFT JOIN users u ON c.user_id = u.id
                 LEFT JOIN authorities a ON c.assigned_to = a.id
                 WHERE 1=1`;

    const params = [];

    if (status) {
      query += ' AND c.status = ?';
      params.push(status);
    }

    if (department_id) {
      query += ' AND v.department_id = ?';
      params.push(department_id);
    }

    // Sorting options
    const validSortColumns = ['created_at', 'severity', 'proof_count', 'priority'];
    const sortColumn = validSortColumns.includes(sort) ? sort : 'created_at';
    query += ` ORDER BY c.${sortColumn} ${order.toUpperCase()}`;

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [complaints] = await connection.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM complaints c
                     JOIN violation_types v ON c.violation_type_id = v.id
                     WHERE 1=1`;

    if (status) {
      countQuery += ' AND c.status = ?';
    }
    if (department_id) {
      countQuery += ' AND v.department_id = ?';
    }

    const countParams = [];
    if (status) countParams.push(status);
    if (department_id) countParams.push(department_id);

    const [countResult] = await connection.query(countQuery, countParams);

    connection.release();

    res.status(200).json({
      status: true,
      complaints,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching complaints', error: error.message });
  }
});

// Update complaint status (Authority side)
router.patch('/:complaintId/status', [
  body('status').isIn(['not_viewed', 'in_progress', 'resolved', 'fake_report']),
  body('message').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { complaintId } = req.params;
    const { status, message } = req.body;
    const authorityId = req.body.authority_id; // Should come from JWT token in production

    const connection = await pool.getConnection();

    try {
      // Update complaint status
      let updateQuery = 'UPDATE complaints SET status = ?';
      const updateParams = [status];
      
      if (status === 'resolved') {
        updateQuery += ', resolved_at = NOW()';
      }
      
      updateQuery += ' WHERE id = ?';
      updateParams.push(complaintId);

      await connection.query(updateQuery, updateParams);

      // Always create an update record to log the status change
      await connection.query(
        'INSERT INTO complaint_updates (complaint_id, authority_id, status, message) VALUES (?, ?, ?, ?)',
        [complaintId, authorityId || null, status, message || null]
      );

      // Get updated complaint info
      const [complaints] = await connection.query('SELECT user_id FROM complaints WHERE id = ?', [complaintId]);
      
      // Notify user via socket
      if (complaints && complaints.length > 0) {
        const io = require('../server').io;
        io.to(`user_${complaints[0].user_id}`).emit('status-updated', {
          complaintId,
          status,
          message: message || ''
        });
      }

      connection.release();

      res.status(200).json({
        status: true,
        message: 'Complaint status updated successfully'
      });
    } catch (dbError) {
      connection.release();
      console.error('Database error in status update:', dbError);
      res.status(500).json({ 
        status: false, 
        message: 'Failed to update complaint status',
        error: dbError.message 
      });
    }

  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ status: false, message: 'Error updating complaint', error: error.message });
  }
});

// Delete complaint (Mark as fake report - Authority side)
router.delete('/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;

    const connection = await pool.getConnection();

    // Soft delete by marking as fake_report
    await connection.query(
      'UPDATE complaints SET status = ? WHERE id = ?',
      ['fake_report', complaintId]
    );

    connection.release();

    res.status(200).json({
      status: true,
      message: 'Complaint marked as fake report'
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error deleting complaint', error: error.message });
  }
});

module.exports = router;
