# 🚀 Deployment Guide — College Discovery Platform

> **Stack**: Neon (DB) + Render (Backend) + Vercel (Frontend) — all free tiers

---

## Step 1 — Push to GitHub

1. Go to [github.com/new](https://github.com/new) and create a **new empty repo** (no README, no .gitignore)
2. Copy the remote URL (e.g. `https://github.com/YOUR_USERNAME/college-discovery.git`)
3. Run in your terminal:
```bash
cd d:\college_discovery
git remote add origin https://github.com/YOUR_USERNAME/college-discovery.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Set up Neon Database (Cloud PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → **Sign up** (free, no credit card)
2. Click **Create Project** → name it `college-discovery` → region: **Singapore** (closest to India)
3. Once created, click **Connection Details** → choose **Prisma** from the dropdown
4. Copy the connection string — it looks like:
   ```
   postgresql://college_discovery_owner:XXXX@ep-XXXX.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Keep this tab open — you'll need it in the next steps

> [!IMPORTANT]
> This is your production `DATABASE_URL`. Keep it secret.

---

## Step 3 — Deploy Backend to Render

### 3a. Create the Render Web Service

1. Go to [render.com](https://render.com) → **Sign up** (free)
2. Click **New** → **Web Service**
3. Connect your GitHub account → select the `college-discovery` repo
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `college-discovery-api` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Region** | Singapore |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npx prisma migrate deploy && node dist/index.js` |

### 3b. Set Environment Variables

In Render → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | *(paste your Neon connection string)* |
| `JWT_ACCESS_SECRET` | *(click "Generate" — long random string)* |
| `JWT_REFRESH_SECRET` | *(click "Generate" — different long random string)* |
| `JWT_ACCESS_EXPIRY` | `15m` |
| `JWT_REFRESH_EXPIRY` | `7d` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` *(fill in after Step 4)* |

5. Click **Deploy** and wait ~3 minutes for the first build

6. Once deployed, note your backend URL:
   ```
   https://college-discovery-api.onrender.com
   ```

7. Verify it works: open `https://college-discovery-api.onrender.com/health` — you should see:
   ```json
   {"success": true, "message": "College Discovery API is running"}
   ```

### 3c. Seed the Production Database (one-time)

After the backend is deployed and running, open the **Render Shell** tab and run:
```bash
npm run seed
```
This seeds 168 colleges, 667 courses, 1120+ reviews into Neon.

> [!NOTE]
> You only need to run this once. Future deploys via `git push` will not re-seed.

---

## Step 4 — Deploy Frontend to Vercel

### 4a. Import Project

1. Go to [vercel.com](https://vercel.com) → **Sign up** with GitHub
2. Click **Add New → Project**
3. Import your `college-discovery` repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 4b. Set Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://college-discovery-api.onrender.com` |

5. Click **Deploy** — Vercel builds and deploys in ~1 minute

6. Your frontend URL will be something like:
   ```
   https://college-discovery-xyz.vercel.app
   ```

---

## Step 5 — Wire up CORS

Now that you have the Vercel URL, go back to **Render → Environment** and update:

| Key | Value |
|-----|-------|
| `CORS_ORIGIN` | `https://college-discovery-xyz.vercel.app` |

Render will auto-redeploy with the updated value.

---

## Step 6 — Verify Everything Works

Open your Vercel URL and check:

- [ ] Home page loads with colleges
- [ ] Sign up / Login works
- [ ] College detail page loads (tabs: Overview, Courses, Placements, Reviews)
- [ ] Write a review (requires login)
- [ ] Save a college (requires login)
- [ ] Compare up to 3 colleges
- [ ] Admin panel at `/admin` works with `admin@collegediscovery.com` / `Admin@123`

---

## Future Deploys

Every time you push to GitHub `main`:
- **Render** auto-rebuilds and deploys the backend
- **Vercel** auto-rebuilds and deploys the frontend

```bash
git add -A
git commit -m "feat: your change"
git push
```

---

## Architecture Diagram

```
Browser
  │
  ├─── Static files ──────► Vercel (frontend)
  │                              │
  │                              │ VITE_API_URL (HTTPS)
  │                              ▼
  └─── API calls ────────► Render (backend API)
                                 │
                                 │ DATABASE_URL (TLS)
                                 ▼
                          Neon PostgreSQL (cloud DB)
```

---

## Free Tier Limits

| Service | Free Limit | Notes |
|---------|-----------|-------|
| Neon | 512 MB storage, 191 compute hrs/mo | More than enough |
| Render | 750 hrs/mo (1 service), **sleeps after 15min idle** | First request after sleep takes ~30s to wake |
| Vercel | 100 GB bandwidth, unlimited deployments | No sleep |

> [!TIP]
> To prevent Render from sleeping, use [UptimeRobot](https://uptimerobot.com) (free) to ping `https://college-discovery-api.onrender.com/health` every 14 minutes.
