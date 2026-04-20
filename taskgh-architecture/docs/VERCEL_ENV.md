# Vercel Environment Configuration

This guide covers all environment variables for TaskGH using Vercel services (no AWS).

---

## Environment Variables

### .env.local (Local Development)

```bash
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Backend Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Connection (for direct access if needed)
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskgh_dev

# Cache (Local Redis via Docker Compose)
REDIS_URL=redis://:password@localhost:6379/0
REDIS_TTL=3600

# JWT Authentication
JWT_SECRET_KEY=your_dev_jwt_secret_key_min_32_chars_local_only
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d

# Payment Gateway (Hubtel Sandbox)
NEXT_PUBLIC_HUBTEL_MERCHANT_ID=YOUR_DEV_MERCHANT_ID
HUBTEL_API_KEY=your_dev_hubtel_api_key
HUBTEL_API_URL=https://api-sandbox.hubtel.com

# SMS Gateway (FlashSMS)
FLASHSMS_API_KEY=your_dev_flashsms_api_key
FLASHSMS_SENDER_ID=TASKGH-DEV

# Email Service (SendGrid)
SENDGRID_API_KEY=your_dev_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@taskgh.local

# File Storage (Supabase Storage)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media
SUPABASE_STORAGE_ACCESS_KEY=your_storage_access_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_dev_google_maps_key

# Sentry (Error Tracking)
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456

# Feature Flags
NEXT_PUBLIC_FEATURE_CORPORATE_ACCOUNTS=false
NEXT_PUBLIC_FEATURE_ADVANCED_SEARCH=true
NEXT_PUBLIC_FEATURE_SUBSCRIPTION_TIERS=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGINS=http://localhost:3001,http://localhost:3002
CSRF_PROTECTION_ENABLED=true

# Timezone
TZ=Africa/Accra

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json
```

---

### Environment Variables for Production (via Vercel Dashboard)

In Vercel dashboard → Settings → Environment Variables, add:

#### Production Environment

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://taskgh.com

# Supabase (Backend Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY_PROD}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY_PROD}

# Database Connection (for direct Postgres access if needed)
DATABASE_URL=${DATABASE_URL_PROD}

# Cache (Upstash Redis - optional)
REDIS_URL=${REDIS_URL_PROD}
REDIS_TTL=7200

# JWT Authentication
JWT_SECRET_KEY=${JWT_SECRET_KEY_PROD}
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d

# Payment Gateway (Hubtel Live)
NEXT_PUBLIC_HUBTEL_MERCHANT_ID=YOUR_PROD_MERCHANT_ID
HUBTEL_API_KEY=${HUBTEL_PROD_API_KEY}
HUBTEL_API_URL=https://api.hubtel.com

# SMS Gateway (FlashSMS)
FLASHSMS_API_KEY=${FLASHSMS_PROD_API_KEY}
FLASHSMS_SENDER_ID=TASKGH

# Email Service (SendGrid)
SENDGRID_API_KEY=${SENDGRID_PROD_API_KEY}
SENDGRID_FROM_EMAIL=noreply@taskgh.com

# File Storage (Supabase Storage)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media-prod
SUPABASE_STORAGE_ACCESS_KEY=${SUPABASE_STORAGE_ACCESS_KEY_PROD}

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_PROD_GOOGLE_MAPS_KEY

# Sentry (Error Tracking)
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=production

# Feature Flags
NEXT_PUBLIC_FEATURE_CORPORATE_ACCOUNTS=true
NEXT_PUBLIC_FEATURE_ADVANCED_SEARCH=true
NEXT_PUBLIC_FEATURE_SUBSCRIPTION_TIERS=true

# Rate Limiting (stricter)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGINS=https://taskgh.com
CSRF_PROTECTION_ENABLED=true
HSTS_MAX_AGE=31536000
SSL_MIN_VERSION=TLSv1.3

# Monitoring
SENTRY_SAMPLE_RATE=0.1

# Timezone
TZ=Africa/Accra

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_RETENTION_DAYS=30
```

#### Staging Environment

```
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.taskgh.com

# Supabase (Staging Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY_STAGING}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY_STAGING}

# Database Connection
DATABASE_URL=${DATABASE_URL_STAGING}

# Cache (optional)
REDIS_URL=${REDIS_URL_STAGING}

# JWT
JWT_SECRET_KEY=${JWT_SECRET_KEY_STAGING}

# Payment (Hubtel Sandbox)
NEXT_PUBLIC_HUBTEL_MERCHANT_ID=YOUR_STAGING_MERCHANT_ID
HUBTEL_API_KEY=${HUBTEL_STAGING_API_KEY}
HUBTEL_API_URL=https://api-sandbox.hubtel.com

# SMS
FLASHSMS_API_KEY=${FLASHSMS_STAGING_API_KEY}
FLASHSMS_SENDER_ID=TASKGH-STAGING

# Email
SENDGRID_API_KEY=${SENDGRID_STAGING_API_KEY}
SENDGRID_FROM_EMAIL=noreply-staging@taskgh.com

# Storage (Supabase Storage staging)
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media-staging
SUPABASE_STORAGE_ACCESS_KEY=${SUPABASE_STORAGE_ACCESS_KEY_STAGING}

# Sentry
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=staging

# Feature Flags (test new features)
NEXT_PUBLIC_FEATURE_CORPORATE_ACCOUNTS=true
NEXT_PUBLIC_FEATURE_ADVANCED_SEARCH=true
NEXT_PUBLIC_FEATURE_SUBSCRIPTION_TIERS=false

# URLs
CORS_ORIGINS=https://staging.taskgh.com
```

---

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)

1. Go to Vercel.com → Select your project
2. Click **Settings** → **Environment Variables**
3. Add variable:
   - Key: `DATABASE_URL`
   - Value: (paste your Vercel Postgres connection string)
   - Select environments: `Production`, `Preview`, `Development`
4. Click **Save**

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variable
vercel env add DATABASE_URL
# Paste value interactively

# Link local project to Vercel
cd /Users/mac/Documents/GitHub/myworkpadi
vercel link
```

---

## Secrets Management

### Store in Vercel Dashboard (NOT in code):

```
POSTGRES_PASSWORD
KV_PASSWORD
JWT_SECRET_KEY_PROD
HUBTEL_PROD_API_KEY
FLASHSMS_PROD_API_KEY
SENDGRID_PROD_API_KEY
BLOB_READ_WRITE_TOKEN
```

### Reference in code:

```typescript
// Next.js automatically injects environment variables
const dbUrl = process.env.DATABASE_URL
const kvUrl = process.env.KV_URL
const jwtSecret = process.env.JWT_SECRET_KEY
```

---

## Getting Supabase Service Credentials

### Supabase Connection Details

1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API keys → Copy:
   - Project URL: `https://your-project.supabase.co`
   - Anon key: `eyJhbGci...` (public, safe for frontend)
   - Service role key: `eyJhbGci...` (secret, for server only)

```bash
# Add to environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Supabase Storage Access

1. Go to Storage in Supabase dashboard
2. Create bucket (e.g., "media")
3. Copy bucket name and add to env:

```bash
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media
```

### Connect Supabase via Vercel

```bash
# Vercel CLI
vercel link

# Add Supabase env vars
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

---

## Environment Variable Reference

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | string | `https://xyz.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | `eyJhbGci...` | Public key for frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | string | `eyJhbGci...` | Secret key for backend |
| `DATABASE_URL` | string | `postgresql://...` | Direct Postgres connection (optional) |
| `REDIS_URL` | string | `redis://...` | Upstash Redis (optional) |
| `JWT_SECRET_KEY` | string | 32+ chars | Min 32 chars for RS256 |
| `HUBTEL_API_KEY` | string | api_key_xxx | Rotate every 6 months |
| `FLASHSMS_API_KEY` | string | fs_xxxx | Ghana SMS provider |
| `SENDGRID_API_KEY` | string | SG.xxxx | Email service |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | string | media | Storage bucket name |
| `NEXT_PUBLIC_APP_URL` | string | https://taskgh.com | Public app URL |
| `SENTRY_DSN` | string | https://xxx@sentry.io | Error tracking |

---

## Local Development with Docker Compose

To test with Vercel services locally:

```bash
# 1. Start local services
docker-compose up -d

# 2. Copy .env.example to .env.local
cp .env.example .env.local

# 3. Run migrations
npm run db:migrate

# 4. Start dev server
npm run dev

# 5. Open http://localhost:3000
```

---

## Vercel Production Deployment with Supabase

```bash
# 1. Create Supabase project at https://supabase.com

# 2. Copy credentials to Vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# 3. Run database migrations
supabase db push
# or manually execute database/schema.sql

# 4. Push to GitHub main branch
git add .
git commit -m "feat: production ready with Supabase"
git push origin main

# 5. Vercel automatically deploys
# Watch in dashboard: https://vercel.com/dashboard

# 6. Verify deployment
curl https://taskgh.vercel.app/api/health
```

---

## Troubleshooting

### "Database connection refused"
```bash
# Check DATABASE_URL is set in Vercel dashboard
# Verify it's in correct format: postgresql://user:pass@host/db
vercel env list
```

### "ENV variable not found"
```bash
# Vercel environment variables are cached
# Redeploy to pick up new variables:
vercel redeploy
```

### "Cold start taking too long"
```bash
# This is normal (first deployment ~45s)
# Subsequent deployments faster due to caching
# Edge functions help reduce latency
```

---

**Generated**: April 2026 | **Status**: Vercel-Ready | **Version**: 1.0.0

