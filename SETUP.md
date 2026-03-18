# Setup Instructions for Green Justice

## 1. Database Setup

### Create the database and tables:

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema file
source backend/database/schema.sql;

# Verify tables created
SHOW TABLES;
```

### Insert sample data (optional):

```sql
-- Insert departments
INSERT INTO departments (name, description, address, phone, email, contact_person, violation_types, location_lat, location_lng) VALUES
('Environmental Protection Agency', 'Main environmental agency', '123 Green Street', '+1-800-555-0001', 'contact@epa.gov', 'John Smith', 'Air pollution, Water pollution', 40.7128, -74.0060),
('Water Quality Department', 'Water pollution control', '456 Water Lane', '+1-800-555-0002', 'water@example.gov', 'Jane Doe', 'Water pollution', 40.7130, -74.0065),
('Air Quality Division', 'Air pollution management', '789 Air Avenue', '+1-800-555-0003', 'air@example.gov', 'Bob Wilson', 'Air pollution', 40.7125, -74.0055);

-- Insert violation types
INSERT INTO violation_types (name, description, severity, department_id) VALUES
('Air Pollution', 'Illegal emission of harmful gases', 'critical', 3),
('Water Pollution', 'Contamination of water bodies', 'critical', 2),
('Illegal Dumping', 'Unauthorized waste disposal', 'high', 1),
('Deforestation', 'Unauthorized tree removal', 'high', 1),
('Noise Pollution', 'Excessive noise levels', 'medium', 1);

-- Map violations to departments
INSERT INTO violation_department_mapping (violation_type_id, department_id, priority) VALUES
(1, 3, 1),  -- Air pollution -> Air Quality Division
(2, 2, 1),  -- Water pollution -> Water Quality Department
(3, 1, 2),  -- Illegal dumping -> EPA
(4, 1, 1),  -- Deforestation -> EPA
(5, 1, 3);  -- Noise pollution -> EPA

-- Create test authority (password: greenworld123)
INSERT INTO authorities (username, password, email, name, phone, department_id, role) VALUES
('authority1', '$2a$10$YourHashedPasswordHere', 'authority1@example.gov', 'Officer Smith', '+1-800-555-0100', 1, 'authority'),
('admin1', '$2a$10$YourHashedPasswordHere', 'admin@example.gov', 'Administrator', '+1-800-555-0101', 1, 'admin');
```

## 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=green_justice
# JWT_SECRET=your_secret_key_here
# PORT=5000

# Start backend (development mode with auto-reload)
npm run dev

# OR production mode
npm start
```

## 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start frontend
npm start

# This will open http://localhost:3000 in your browser
```

## 4. Testing the Application

### User Flow (Citizen):
1. Go to `http://localhost:3000`
2. Click "Report a Violation"
3. Select language
4. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Violation Type: Choose any
   - Title: Test violation
   - Description: This is a test violation report to check the system functionality and database connectivity.
   - Location: Any location
   - Upload optional media
5. Submit and note the complaint ID

### Authority Flow:
1. Go to `http://localhost:3000`
2. Click "Authority Access"
3. Select language
4. Login with:
   - Username: `authority1`
   - Password: `greenworld123` (if you hash this: `bcrypt.hash('greenworld123', 10)`)
5. View dashboard
6. Update complaint status
7. View suggested contacts

### Admin Flow:
1. Access `http://localhost:3000/admin/dashboard`
2. View system statistics
3. Monitor complaints

## 5. Generate Hashed Passwords

To create hashed passwords for authority accounts:

```javascript
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

hashPassword('greenworld123');
```

Use the hash in the `INSERT INTO authorities` statement.

## 6. File Structure Quick Reference

```
Backend:
- server.js - Main server entry point
- routes/auth.js - Authentication endpoints
- routes/complaints.js - Complaint CRUD operations
- config/database.js - Database connection
- database/schema.sql - Database schema

Frontend:
- index.js - React entry point
- App.js - Main app component
- pages/ - All page components
- styles/ - CSS files
- utils/ - Helper functions and API client
```

## 7. Port Configuration

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MySQL**: localhost:3306

## 8. Environment Variables

### Backend (.env):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=green_justice
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
MAIL_HOST=smtp.gmail.com
MAX_FILE_SIZE=50
```

### Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 9. Troubleshooting

### Issue: Database connection failed
**Solution**: 
- Ensure MySQL is running: `mysql.server start` (Mac) or check Services (Windows)
- Verify credentials in .env
- Make sure database `green_justice` exists

### Issue: Port 3000 already in use
**Solution**:
- Change in frontend package.json: `"start": "PORT=3001 react-scripts start"`

### Issue: CORS errors
**Solution**:
- Ensure backend CORS is configured correctly in server.js
- Check that APIs in frontend point to correct backend URL

### Issue: File uploads not working
**Solution**:
- Create uploads directory: `mkdir -p backend/uploads/complaints`
- Verify directory permissions
- Check file size limits in .env

## 10. Running in Production

### Build frontend:
```bash
cd frontend
npm run build
```

### Run backend with PM2:
```bash
npm install -g pm2
pm2 start server.js --name "green-justice"
pm2 save
pm2 startup
```

## 11. Cron Job Setup (Reminders)

Add this to your production cron:

```bash
# Run every day at 9 AM
0 9 * * * curl http://localhost:5000/api/notifications/send-reminders
```

---

**Now your Green Justice system is ready to use! 🌱**
