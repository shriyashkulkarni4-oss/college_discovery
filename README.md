# CollegeDiscover

A production-grade College Discovery & Decision-Making Platform for India.

**Tech Stack**: React + TypeScript + Vite (Frontend) | Node.js + Express + Prisma (Backend) | PostgreSQL (Database)

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup
```bash
cd backend
cp .env.example .env       # fill in your values
npm install
npx prisma generate
npx prisma migrate dev
npm run seed               # 168 colleges, 667 courses, 1120+ reviews
npm run dev                # http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

**Demo credentials**
- Admin: `admin@collegediscovery.com` / `Admin@123`
- User: `aarav.sharma0@gmail.com` / `Password@123`

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step production deployment guide.

| Service | Provider | Free Tier |
|---------|----------|-----------|
| Database | [Neon](https://neon.tech) | ✅ Yes |
| Backend | [Render](https://render.com) | ✅ Yes |
| Frontend | [Vercel](https://vercel.com) | ✅ Yes |
