# Vercel Deployment Guide

Quick start guide for deploying TaskGH to Vercel.

---

## 📋 Pre-Deployment Checklist (Day -1)

### GitHub Setup
- [ ] Repository created and connected to Vercel
- [ ] Repository has `main` branch as default
- [ ] All code committed and pushed

### Vercel Account
- [ ] Vercel account created (https://vercel.com)
- [ ] Project created in Vercel dashboard
- [ ] GitHub integrated with Vercel

### Database
- [ ] Vercel Postgres database created
- [ ] Connection string copied: `postgresql://...`
- [ ] Backups verified in Vercel dashboard

### Cache
- [ ] Vercel KV created
- [ ] Connection string copied: `redis://...`

### Storage
- [ ] Vercel Blob created
- [ ] Token copied: `vercel_blob_read_write_...`

### API Keys
- [ ] Hubtel API key (sandbox + production)
- [ ] FlashSMS API key
- [ ] SendGrid API key
- [ ] Google Maps API key
- [ ] Sentry DSN

---

## 🚀 Launch Day

### Step 1: Set Environment Variables (5 minutes)

```bash
# 1. Go to Vercel dashboard
# 2. Select your project
# 3. Settings → Environment Variables
# 4. Add each variable:

# Database
DATABASE_URL = postgresql://default:PASSWORD@ep-xyz.vercel-postgres.com/verceldb

# Cache
KV_URL = redis://default:PASSWORD@data.vercel.com:xxxxx

# JWT
JWT_SECRET_KEY = (32+ character random string)

# Hubtel
NEXT_PUBLIC_HUBTEL_MERCHANT_ID = YOUR_MERCHANT_ID
HUBTEL_API_KEY = YOUR_API_KEY
HUBTEL_API_URL = https://api-sandbox.hubtel.com  (or https://api.hubtel.com)

# FlashSMS
FLASHSMS_API_KEY = YOUR_API_KEY
FLASHSMS_SENDER_ID = TASKGH

# SendGrid
SENDGRID_API_KEY = YOUR_API_KEY
SENDGRID_FROM_EMAIL = noreply@taskgh.com

# File Storage
BLOB_READ_WRITE_TOKEN = YOUR_TOKEN
NEXT_PUBLIC_BLOB_URL = https://taskgh.vercel-storage.com

# Other
NEXT_PUBLIC_APP_URL = https://taskgh.vercel.app
SENTRY_DSN = YOUR_SENTRY_DSN
TZ = Africa/Accra
```

### Step 2: Configure Vercel.json (5 minutes)

Create `vercel.json` in your project root:

```json
{
  "env": {
    "DATABASE_URL": "@database_url",
    "KV_URL": "@kv_url",
    "JWT_SECRET_KEY": "@jwt_secret_key"
  },
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci"
}
```

### Step 3: Database Migration (10 minutes)

```bash
# 1. SSH into Vercel (or use Vercel Postgres shell)
vercel postgres shell

# 2. Run schema migration
psql postgresql://default:PASSWORD@ep-xyz.vercel-postgres.com/verceldb < database/schema.sql

# 3. Verify tables created
\dt
```

Or use a deployment hook:

```typescript
// pages/api/migrate.ts
import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  await sql`
    -- Your migration query
  `

  res.status(200).json({ success: true })
}
```

### Step 4: Deploy (< 1 minute)

```bash
# Simply push to main branch
git add .
git commit -m "chore: deploy to Vercel"
git push origin main

# Vercel auto-deploys within 60 seconds
# Watch deployment: https://vercel.com/dashboard
```

### Step 5: Verify Deployment (5 minutes)

```bash
# 1. Check deployment status
https://vercel.com/dashboard → Select project → Check status

# 2. Test API
curl https://taskgh.vercel.app/api/health

# 3. Check logs
vercel logs

# 4. Monitor Sentry
https://sentry.io/ → Check errors
```

---

## 📊 Monitoring Deployment

### Real-time Dashboard
- URL: https://vercel.com/dashboard
- Shows: Build status, deployment history, metrics
- Refresh: Every 10 seconds

### Logs
```bash
# View deployment logs
vercel logs --limit 100

# Tail logs in real-time
vercel logs --tail
```

### Health Checks
```bash
# API endpoint
curl https://taskgh.vercel.app/api/health
# Expected: { "status": "ok" }

# Database connectivity
curl https://taskgh.vercel.app/api/db-check
# Expected: { "database": "connected" }

# Cache connectivity
curl https://taskgh.vercel.app/api/cache-check
# Expected: { "cache": "connected" }
```

### Sentry Errors
- URL: https://sentry.io/organizations/YOUR_ORG/issues/
- Watch for: Errors in first hour of deployment
- Action: Fix critical errors immediately

---

## 🔄 Rollback Procedure

If deployment has critical issues:

```bash
# Option 1: Revert git commit and push
git revert HEAD
git push origin main
# Vercel auto-redeploys previous version

# Option 2: Use Vercel dashboard
# Vercel dashboard → Deployments → Previous version → Click "Promote to Production"
```

---

## ✅ Launch Checklist (Post-Deployment)

### Hour 1
- [ ] API responding (< 300ms latency)
- [ ] No errors in Sentry
- [ ] Database queries working
- [ ] File uploads working (Vercel Blob)
- [ ] Emails sending (SendGrid)
- [ ] SMS sending (FlashSMS)

### Day 1
- [ ] 100+ beta users active
- [ ] <0.1% error rate
- [ ] <1% failed bookings
- [ ] Payment processing working
- [ ] All notifications sending

### Week 1
- [ ] 500+ active users
- [ ] 50+ bookings/day
- [ ] 99% uptime maintained
- [ ] Monitoring dashboards active
- [ ] Backup tested

---

## 🆘 Troubleshooting

### Deployment keeps failing

```bash
# Check build logs
vercel logs --follow

# Common issues:
# - Missing env variable: add to Vercel dashboard
# - Type errors: run npm run type-check locally
# - Missing dependency: npm install and commit
# - Wrong Node.js version: check vercel.json
```

### Database connection errors

```bash
# Verify DATABASE_URL
vercel env list | grep DATABASE_URL

# Test connection
vercel postgres shell
# If it works, issue is in app config

# Check connection string format:
# postgresql://user:password@host/database
```

### Slow performance

```bash
# Check function duration
vercel analytics

# Common causes:
# - Cold start (first deployment, normal)
# - N+1 queries (optimize database queries)
# - Large payload (compress responses)
# - Missing indexes (check database schema)
```

### Vercel Blob not working

```bash
# Verify BLOB_READ_WRITE_TOKEN
vercel env list | grep BLOB

# Test connection
curl https://blob.vercel-storage.com/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Post-Launch Operations

### Daily
- [ ] Monitor Sentry for new errors
- [ ] Check Vercel analytics for performance
- [ ] Review database size

### Weekly
- [ ] Review error reports
- [ ] Check API performance trends
- [ ] Backup verification
- [ ] Cost tracking

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Scaling assessment

---

## 🔑 Useful Commands

```bash
# View environment variables
vercel env list

# Add new environment variable
vercel env add MY_VAR

# Connect to PostgreSQL
vercel postgres shell

# View live logs
vercel logs --tail

# List deployments
vercel list

# Get project info
vercel projects list

# Pull environment variables to local
vercel env pull

# Rebuild current deployment
vercel rebuild
```

---

## 📞 Support & Escalation

| Issue | Action |
|-------|--------|
| Deployment fails | Check build logs, Vercel docs |
| Database full | Upgrade Vercel Postgres plan |
| Slow performance | Check function duration, optimize queries |
| High costs | Review analytics, optimize resource usage |
| Data loss | Restore from Vercel Postgres backup |

---

**Deployment Time**: ~15 minutes total  
**Next Steps**: Monitor deployment, collect beta feedback, iterate  
**Success Criteria**: 99% uptime, <300ms latency, 0 critical errors

