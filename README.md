# Punjab Jobs Hub v2 🏛️
### Production-Ready MERN Stack — Hosted on Render + Vercel

---

## 📁 Project Structure

```
punjab-jobs-hub-v2/
├── backend/
│   ├── config/         db.js
│   ├── controllers/    jobController.js · authController.js · adminController.js · subscriberController.js
│   ├── middleware/     auth.js · validation.js
│   ├── models/         Job.js · Admin.js · Subscriber.js
│   ├── routes/         jobRoutes.js · authRoutes.js · adminRoutes.js · subscriberRoutes.js
│   ├── utils/          email.js · cronJobs.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/ Navbar · JobCard · FilterSidebar · SharedComponents
│   │   ├── context/    AuthContext.jsx
│   │   ├── hooks/      useJobs.js
│   │   ├── pages/      Home · ApplyNow · JobDetail · AdminLogin · AdminDashboard · AdminJobForm · Unsubscribe
│   │   ├── utils/      api.js · helpers.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.production
│   ├── vercel.json
│   └── package.json
│
├── render.yaml
├── .gitignore
└── README.md
```

---

## 🚀 STEP 1 — Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other values
npm run dev          # → http://localhost:5000
npm run seed         # → Inserts 6 sample jobs + admin user
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # → http://localhost:3000
```

**Admin Panel:** http://localhost:3000/admin/login
- Email: `admin@punjabjobshub.in`
- Password: `Admin@123456`

---

## 🌐 STEP 2 — MongoDB Atlas (Free Cloud Database)

1. Go to https://cloud.mongodb.com → Create free account
2. Click **"Build a Database"** → Choose **Free (M0)** → Region: **Mumbai (ap-south-1)**
3. Create username + password (save these!)
4. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all)
5. Click **Connect** → **Drivers** → Copy the URI:
   ```
   mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/punjab-jobs-hub?retryWrites=true&w=majority
   ```

---

## 🖥️ STEP 3 — Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to https://render.com → Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Region:** Singapore
6. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *(your Atlas URI from Step 2)* |
| `JWT_SECRET` | *(any long random string, 64+ chars)* |
| `JWT_EXPIRES_IN` | `7d` |
| `ADMIN_EMAIL` | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | `YourStrongPassword123!` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `yourgmail@gmail.com` |
| `EMAIL_PASS` | *(Gmail App Password — see below)* |
| `EMAIL_FROM` | `Punjab Jobs Hub <yourgmail@gmail.com>` |
| `FRONTEND_URL` | *(fill in after Step 4)* |

7. Click **"Create Web Service"** → Wait ~3 minutes for deploy
8. Copy your Render URL: `https://punjab-jobs-hub-api.onrender.com`
9. Run seed data via Render Shell:
   ```bash
   npm run seed
   ```

### 📧 Gmail App Password (for email alerts):
1. Go to Google Account → Security → 2-Step Verification (enable it)
2. Search "App passwords" → Select app: Mail → Generate
3. Copy the 16-character password → paste as `EMAIL_PASS`

---

## ▲ STEP 4 — Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://punjab-jobs-hub-api.onrender.com/api` |

6. Click **Deploy** → Wait ~2 minutes
7. Copy your Vercel URL: `https://punjab-jobs-hub.vercel.app`

---

## 🔗 STEP 5 — Connect Frontend ↔ Backend

1. Go back to **Render Dashboard** → Your backend service → **Environment**
2. Update `FRONTEND_URL` = `https://punjab-jobs-hub.vercel.app`
3. Click **"Save Changes"** → Render auto-redeploys in ~1 minute

---

## ✅ STEP 6 — Verify Everything Works

| Check | URL |
|-------|-----|
| Backend health | `https://your-api.onrender.com/api/health` |
| Frontend home | `https://your-app.vercel.app` |
| Admin panel | `https://your-app.vercel.app/admin/login` |
| Apply Now | `https://your-app.vercel.app/apply-now` |

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Server health check |
| GET | `/api/jobs` | No | All jobs (filter + search + pagination) |
| GET | `/api/jobs/:id` | No | Single job detail |
| GET | `/api/jobs/filter` | No | Dedicated filter endpoint |
| POST | `/api/jobs` | ✅ JWT | Create new job |
| PUT | `/api/jobs/:id` | ✅ JWT | Update job |
| DELETE | `/api/jobs/:id` | ✅ JWT | Delete job |
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | ✅ JWT | Get current admin |
| POST | `/api/auth/setup` | No | Create first admin (one-time) |
| GET | `/api/admin/stats` | ✅ JWT | Dashboard stats |
| POST | `/api/subscribers` | No | Subscribe to alerts |
| GET | `/api/subscribers/unsubscribe?token=` | No | Unsubscribe |

### Filter Query Params (GET /api/jobs)
| Param | Example | Description |
|-------|---------|-------------|
| `search` | `police constable` | Full-text search |
| `category` | `Police` | Filter by category |
| `gender` | `Female` | Filter by gender |
| `qualification` | `12th` | Min qualification |
| `minAge` | `18` | Min age eligibility |
| `maxAge` | `30` | Max age eligibility |
| `activeOnly` | `true` | Only non-expired jobs |
| `page` | `2` | Pagination page |
| `limit` | `12` | Jobs per page |

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔍 Full-text Search | MongoDB text index on title, department, overview |
| 🎛️ Real-time Filters | Gender, qualification, category, age range |
| ⚡ Urgency Indicators | Red pulse when ≤5 days, amber when ≤15 days |
| 📧 Email Alerts | New job notifications + deadline reminders via cron |
| 🔐 Admin Panel | JWT auth, create/edit/delete jobs, dashboard stats |
| 📊 Analytics | View counts per job, category breakdown, top viewed |
| 🔒 Security | Helmet, CORS, rate limiting, input validation |
| 📱 Mobile-first | Fully responsive with collapsible filters |
| 🔎 SEO | Meta tags, OG tags, canonical URLs via react-helmet-async |
| 📄 Pagination | 12 jobs per page with page controls |
| 🗃️ Subscribe/Unsubscribe | Email subscription with token-based unsubscribe |

---

## 🛠️ Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · React Router v6 · Axios · react-helmet-async

**Backend:** Node.js · Express 4 · Mongoose 8 · JWT · bcryptjs · Nodemailer · node-cron · helmet · express-rate-limit · express-validator

**Database:** MongoDB Atlas (free M0 cluster)

**Hosting:** Render (backend, free tier) · Vercel (frontend, free tier)
