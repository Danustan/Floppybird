const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Check and send reminders for unresolved complaints (Cron job)
router.post('/send-reminders', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Find unresolved complaints older than 7 days
    const [unresolvedComplaints] = await connection.query(`
      SELECT c.* FROM complaints c
      WHERE c.status IN ('not_viewed', 'in_progress')
      AND c.created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
      AND NOT EXISTS (
        SELECT 1 FROM reminders r 
        WHERE r.complaint_id = c.id 
        AND r.reminder_type = 'unresolved_week'
        AND r.sent = TRUE
      )
    `);

    for (const complaint of unresolvedComplaints) {
      // Create reminder record
      const [result] = await connection.query(
        `INSERT INTO reminders (complaint_id, authority_id, reminder_type, sent, sent_at)
         VALUES (?, NULL, 'unresolved_week', TRUE, NOW())`,
        [complaint.id]
      );

      // In production, send email notification here
      console.log(`Reminder sent for complaint ${complaint.id}`);
    }

    connection.release();

    res.status(200).json({
      status: true,
      message: `${unresolvedComplaints.length} reminders sent`
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'Error sending reminders', error: error.message });
  }
});

module.exports = router;
