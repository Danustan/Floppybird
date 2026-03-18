## ⚡ Quick Start Guide - Green Justice

### For Windows Users (Fastest)

```batch
# 1. Double-click install.bat
install.bat

# 2. Edit backend/.env with your database credentials

# 3. Create database (open Command Prompt as Admin):
mysql -u root -p
source backend/database/schema.sql;
exit

# 4. Start backend (open Terminal #1):
cd backend
npm run dev

# 5. Start frontend (open Terminal #2):
cd frontend
npm start

# 6. Open http://localhost:3000 in browser
```

### For Mac/Linux Users

```bash
# 1. Run install script
chmod +x install.sh
./install.sh

# 2. Edit backend/.env with your database credentials

# 3. Create database:
mysql -u root -p < backend/database/schema.sql

# 4. Start backend (Terminal #1):
cd backend
npm run dev

# 5. Start frontend (Terminal #2):
cd frontend
npm start

# 6. Open http://localhost:3000 in browser
```

### For Command Line (All Platforms)

```bash
# Backend setup
cd backend
cp .env.example .env
npm install
npm run dev    # Runs on localhost:5000

# Frontend setup (new terminal)
cd frontend
cp .env.example .env
npm install
npm start      # Runs on localhost:3000
```

---

## 🧪 Testing Immediately

### Access the Application:
- **User Portal**: http://localhost:3000
- **API Server**: http://localhost:5000/api
- **Socket.IO**: ws://localhost:5000

### Test User Flow:
1. Click "Report a Violation"
2. Select any language
3. Fill out form (all fields required)
4. Upload a photo/video
5. Click a location on map
6. Submit
7. Note the complaint ID (to track later)

### Test Authority Flow:
1. Click "Authority Access"
2. Select language
3. Login with test credentials:
   - Username: `authority1`
   - Password: `greenworld123`
4. View dashboard
5. Update complaint statuses
6. View suggested contacts

---

## 📊 What You Get

✅ **Complete User-facing Platform**
- Multi-language support
- Complaint submission with file uploads
- Real-time status tracking
- Interactive map integration

✅ **Complete Authority Platform**
- Secure authentication
- Advanced filtering & sorting
- Real-time dashboard
- Automatic reminder system
- Suggested contact auto-population

✅ **Complete Admin Platform**
- System statistics
- Complaint analytics
- Authority management

✅ **Production-Ready Code**
- Error handling
- Input validation
- Security best practices
- Professional styling

---

## 🚨 Important Notes

1. **Database**: Must be set up before starting backend
2. **Credentials**: Edit .env files with real database credentials
3. **Ports**: Ensure 3000 & 5000 are available
4. **MySQL**: Must be running before starting backend
5. **File Uploads**: Backend creates `uploads/complaints/` directory automatically

---

## 📚 Full Documentation

- **README.md** - Complete project overview
- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - Technical architecture & integration
- **DEVELOPMENT.md** - Development guidelines (coming)

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Database won't connect | Check MySQL is running, verify .env credentials |
| Port already in use | Change ports or kill existing processes |
| File upload fails | Check `backend/uploads/complaints/` directory exists |
| CORS errors | Verify API URL in frontend .env |
| Socket.IO not working | Ensure backend is running on localhost:5000 |

---

## 🎉 You're Ready!

Your complete Green Justice environmental reporting platform is now ready to run. Start with the quick start commands above, and your website will be live in minutes!

**Made with 🌱 for environmental protection**
