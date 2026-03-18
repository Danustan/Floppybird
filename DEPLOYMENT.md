# Deployment Guide - Railway

## Quick Start to Deploy on Railway

### Step 1: Set Up Git & Push to GitHub

Since Git isn't installed yet, you have two options:

**Option A: Install Git (Recommended)**
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Restart this terminal/editor

Then run:
```powershell
cd "d:\floppy bird2\green-justice"
git init
git add .
git commit -m "Initial commit: Green Justice platform"
git remote add origin https://github.com/YOUR_USERNAME/green-justice.git
git push -u origin main
```

**Option B: Use GitHub Desktop**
1. Download from: https://desktop.github.com
2. Install and sign in with your GitHub account
3. Create new repository → select `d:\floppy bird2\green-justice` folder
4. Publish to GitHub
5. Choose "These are my own files"

**Option C: Manual Upload (No Git)**
1. Go to https://github.com/new
2. Create new repository "green-justice"
3. Go to your repo → "Add file" → "Upload files"
4. Drag & drop the project folder

### Step 2: Deploy Backend on Railway

1. Go to https://railway.app and sign up
2. Click "Create New Project"
3. Select "Deploy from GitHub"
4. Choose your `green-justice` repository
5. Select "Backend" directory as root:
   - Project Name: `green-justice-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

6. Go to Variables tab, add:
   ```
   DB_HOST=your_mysql_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=green_justice
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your_secret_key_change_this
   FRONTEND_URL=https://your-frontend-railway-domain.railway.app
   ```

7. Click "Deploy"

### Step 3: Deploy Frontend on Railway

1. Create another new project on Railway
2. Select your GitHub repo again
3. Select "Frontend" directory:
   - Project Name: `green-justice-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. Go to Variables tab and set:
   ```
   REACT_APP_API_URL=https://your-backend-railway-domain.railway.app
   ```

5. Click "Deploy"

### Step 4: Connect Backend Database

**Option A: Use Railway MySQL (Recommended)**
1. In your backend project on Railway
2. Click "Create New" → "Database" → "MySQL"
3. Railway will auto-populate DB_HOST, DB_USER, DB_PASSWORD
4. Run setup scripts:
   - Upload `backend/database/schema.sql` to Railway
   - Run `npm run seed-db` command

**Option B: Use External MySQL Provider**
- Set DB_HOST to your external database URL
- Ensure credentials are correct in Variables

### Step 5: Verify Deployment

1. Check Railway deployment logs for errors
2. Visit your frontend URL
3. Test the reporting form
4. Login with:
   - Username: `authority1`
   - Password: `greenworld123`

### MongoDB Alternative Setup

If you prefer MongoDB instead of MySQL, update:
- Backend package.json to use mongoose
- Deployment environment variables
- Contact support for guidance

### Troubleshooting

**Build fails?**
- Check build logs in Railway dashboard
- Ensure `package.json` has correct scripts
- Verify Node version is 14+

**Can't connect to database?**
- Verify DATABASE_URL environment variable
- Check MySQL is running
- Test connection string locally first

**Frontend shows blank page?**
- Check browser console for errors
- Verify REACT_APP_API_URL is set correctly
- Check CORS settings in backend

### Support

For Railway deployment help:
- https://docs.railway.app
- https://railway.app/support

---

**Need help?** Create an issue on GitHub or check the main README.md
