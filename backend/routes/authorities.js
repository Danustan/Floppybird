const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get authority dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const authorityId = req.body.authority_id; // From JWT in production

    const connection = await pool.getConnection();

    // Total complaints
    const [totalComplaints] = await connection.query(
      'SELECT COUNT(*) as count FROM complaints'
    );

    // By status
    const [byStatus] = await connection.query(
      `SELECT status, COUNT(*) as count FROM complaints GROUP BY status`
    );

    // Unresolved for more than 7 days
    const [unresolvedOld] = await connection.query(
      `SELECT COUNT(*) as count FROM complaints 
       WHERE status IN ('not_viewed', 'in_progress') 
       AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)`
    );

    // High priority complaints
    const [highPriority] = await connection.query(
      `SELECT COUNT(*) as count FROM complaints WHERE priority = 'critical'`
    );

    connection.release();

    res.status(200).json({
      status: true,
      stats: {
        totalComplaints: totalComplaints[0].count,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {}),
        unresolvedOld: unresolvedOld[0].count,
        highPriority: highPriority[0].count
      }
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Get suggested contacts for a complaint
router.get('/complaint/:complaintId/suggested-contacts', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const connection = await pool.getConnection();

    // Get complaint violation type
    const [complaints] = await connection.query(
      'SELECT violation_type_id FROM complaints WHERE id = ?',
      [complaintId]
    );

    if (!complaints.length) {
      connection.release();
      return res.status(404).json({ status: false, message: 'Complaint not found' });
    }

    // Get related departments
    const [departments] = await connection.query(
      `SELECT DISTINCT d.* FROM departments d
       JOIN violation_department_mapping vdm ON d.id = vdm.department_id
       WHERE vdm.violation_type_id = ?
       ORDER BY vdm.priority ASC`,
      [complaints[0].violation_type_id]
    );

    connection.release();

    res.status(200).json({
      status: true,
      suggestedContacts: departments
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error fetching contacts', error: error.message });
  }
});

module.exports = router;
