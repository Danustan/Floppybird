# 🌱 Green Justice - Environmental Law Violation Management System

A comprehensive user-friendly website designed to reduce environmental law violations through efficient reporting and tracking.

## 📋 Project Overview

**Vision:** Reduction of environmental law violations through a user-friendly website.

### Main Features

#### User Side (Citizens)
- 🌐 Welcome page with 5-language selection (English, Spanish, French, German, Portuguese)
- 📝 Multi-step violation report form
- 📸 Photo/video upload with evidence documentation
- 🗺️ Integrated map for location marking
- ✅ Thank you page with report confirmation
- 📊 Real-time status tracking of submitted complaints

#### Authority Side (Government Officials)
- 🔐 Secure login page (mandatory authentication to prevent fake authorities)
- 📋 Dashboard with newly updated complaint list
- 🔍 Advanced sorting functionality:
  - Highly reported violations
  - Size/severity of problems
  - Recent updates
- ⏰ Automatic reminder system (if not addressed within 7 days)
- 🔄 Real-time status updates (In Progress, Resolved, Not Viewed)
- 🗑️ Ability to delete/flag fake allegations
- 💬 Add internal notes and updates to complaints
- 🏢 View suggested relevant office contacts automatically

#### Admin Dashboard
- 📊 Overall system statistics
- 📈 Complaint analytics and reports
- 👥 Authority and user management
- 🏢 Department/Council management
- ⚙️ System configuration

## 🏗️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Node.js + Express | 18.x / 4.18.x |
| Frontend | React | 18.2.0 |
| Database | MySQL | 8.0+ |
| Real-time | Socket.IO | 4.5.4 |
| Maps | Leaflet & React-Leaflet | 1.9.3 |
| File Upload | Multer | 1.4.5 |
| Authentication | JWT | 9.0.0 |

## 📁 Project Structure

```
green-justice/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   └── schema.sql
│   ├── routes/
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   ├── departments.js
│   │   ├── authorities.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── notifications.js
│   ├── uploads/
│   │   └── complaints/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LanguageSelection.js
│   │   │   ├── ReportViolation.js
│   │   │   ├── ThankYou.js
│   │   │   ├── ComplaintStatus.js
│   │   │   ├── AuthorityLogin.js
│   │   │   ├── AuthorityDashboard.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials and settings.

4. **Set up MySQL database:**
   ```bash
   mysql -u root -p
   mysql> source database/schema.sql;
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   The frontend will open on `http://localhost:3000`

## 📊 Database Schema

### Tables
- **users** - Citizens submitting complaints
- **authorities** - Government officials handling complaints
- **departments** - Council/committee/department information
- **violation_types** - Types of environmental violations
- **complaints** - Main complaint records
- **complaint_evidence** - Photos/videos attached to complaints
- **complaint_updates** - Status updates and comments
- **reminders** - Automatic reminder notifications
- **violation_department_mapping** - Violation to department mapping

## 🔄 Workflow

### User Reporting Flow
1. Select language
2. Fill contact information
3. Choose violation type
4. Describe the violation
5. Upload evidence (photos/videos)
6. Mark location on map
7. Submit complaint
8. Receive confirmation with report ID
9. Track status in real-time

### Authority Processing Flow
1. Login with verified credentials
2. View dashboard with new complaints
3. Sort and filter complaints
4. Review complaint details and evidence
5. Update status (In Progress/Resolved/Not Viewed)
6. Add internal notes
7. View auto-suggested department contacts
8. Receive reminders for unresolved complaints (7+ days)
9. Mark fake reports if needed

## 🔐 Security Features

- JWT-based authentication for authorities
- Password hashing with bcryptjs
- Input validation with express-validator
- File type validation for uploads
- Maximum file size limits
- Protected API routes
- Mandatory verification for authority accounts

## 📱 Real-time Features

- Socket.IO integration for live status updates
- Users notified immediately when complaint status changes
- Real-time dashboard updates for authorities
- Live notification system

## 🗺️ Features Detail

### Automatic Department Suggestions
When an authority views a complaint, the system automatically suggests relevant office contact information:
- Office name and address
- Phone number
- Email
- Contact person
- Based on violation type

### Reminder System
- Automatic reminders sent for complaints unaddressed for 7+ days
- Authority receives notifications
- Database tracks reminder status
- Configurable reminder types

### Complaint Status Tracking
Users can check complaint status anytime using report ID:
- Not Yet Reviewed
- Being Investigated
- Resolved
- Fake Report flagged

## 📝 API Endpoints

### Authentication
- `POST /api/auth/authority/login` - Authority login
- `GET /api/auth/verify` - Verify JWT token

### Complaints
- `POST /api/complaints/submit` - Submit new complaint
- `GET /api/complaints` - Get all complaints (with filters)
- `GET /api/complaints/:complaintId/status` - Get complaint status
- `PATCH /api/complaints/:complaintId/status` - Update complaint status
- `DELETE /api/complaints/:complaintId` - Delete/flag complaint

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:departmentId` - Get department details
- `GET /api/departments/:departmentId/violation-types` - Get violation types

### Users
- `GET /api/users/:userId/complaints` - Get user's complaints
- `GET /api/users/violation-types/all` - Get all violation types

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/violations/report` - Get violations report
- `POST /api/admin/authorities/create` - Create new authority

## 🎨 UI/UX Highlights

- **Responsive Design** - Works on desktop, tablet, mobile
- **Intuitive Navigation** - Easy-to-follow complaint process
- **Multi-language Support** - 5 language options
- **Real-time Feedback** - Toast notifications for user actions
- **Interactive Maps** - Leaflet integration for location marking
- **Color-coded Status** - Visual status indicators
- **User-friendly Forms** - Form validation and error messages
- **Progress Indicators** - Step-by-step guidance

## 🔧 Maintenance & Monitoring

### Regular Tasks
- Monitor database performance
- Review system logs
- Check complaint resolution times
- Verify fake report flagging accuracy
- Update department contact information

### Scheduled Tasks
- Cron job for sending 7-day reminders
- Database backups
- Log rotation

## 📧 Email Configuration

Configure email for reminder notifications in `.env`:
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env`
   - Ensure database is created

2. **File Upload Issues**
   - Check `uploads/complaints/` directory exists
   - Verify file permissions
   - Check file type and size limits

3. **Socket.IO Connection Issues**
   - Verify backend is running
   - Check CORS configuration
   - Verify firewall settings

## 📞 Support

For issues or questions, please refer to the project documentation or contact the development team.

## ✅ Future Enhancements

- [ ] SMS notifications for authorities
- [ ] Push notifications for mobile app
- [ ] Advanced analytics dashboard
- [ ] ML-based fake report detection
- [ ] Integration with official environmental agencies
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language admin panel
- [ ] Environmental impact visualization
- [ ] Community rewards system
- [ ] Government integration APIs

---

**Made with 🌍 for environmental protection**
