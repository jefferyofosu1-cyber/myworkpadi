# Supabase Setup Guide for TaskGH

Complete guide for setting up and using Supabase as the backend database for TaskGH.

---

## 🎯 Overview

Supabase provides everything TaskGH needs:
- ✅ PostgreSQL database (managed)
- ✅ Authentication (JWT + OAuth)
- ✅ File storage (with CDN)
- ✅ Real-time subscriptions
- ✅ Row-level security (RLS)
- ✅ Full-text search

---

## 🚀 Getting Started (5 minutes)

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Sign up with GitHub or email
3. Create organization

### Step 2: Create Project

1. Click "New Project"
2. Fill in details:
   - **Name**: `taskgh-dev` (or `taskgh-prod`)
   - **Database Password**: Generate strong password (20+ chars)
   - **Region**: Choose closest to Ghana (Frankfurt or London recommended)
   - **Billing Plan**: Free tier for development

3. Click "Create new project"
4. Wait 2-3 minutes for database initialization

### Step 3: Get Connection Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxx.supabase.co` → Add to `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon key**: `eyJhbGci...` → Add to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key**: `eyJhbGci...` → Add to `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Run Database Schema

```bash
# 1. Connect to Supabase SQL editor
# Dashboard → SQL Editor → click +

# 2. Paste schema from database/schema.sql
# Copy entire content from database/schema.sql file

# 3. Click "Run"
# All 32 tables created in ~5 seconds
```

---

## 🔐 Authentication Setup

### Configure JWT

1. Go to **Settings** → **Auth** → **Providers**
2. Configure JWT expiry:
   - JWT Expiry: `3600` (1 hour for access token)
   - Refresh Token Expiry: `604800` (7 days)

### Enable OAuth Providers (Optional)

For production, enable:
- **Google OAuth**: Great for both customers and taskers
- **Facebook OAuth**: Additional option
- **GitHub OAuth**: For admin/developer signups

#### Google OAuth Example:

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. In Supabase: Settings → Auth → Google (paste credentials)

---

## 💾 Database Management

### Access Database Directly

```bash
# Via Supabase CLI
supabase db connect

# Via psql
PGPASSWORD=your_password psql -h db.supabase.co -U postgres

# Via Supabase Studio (Web UI)
# Dashboard → SQL Editor
```

### Run Migrations

```bash
# 1. Create migration
supabase migration new add_custom_fields

# 2. Edit migration file
vim supabase/migrations/xxxxx_add_custom_fields.sql

# 3. Apply migration
supabase db push
```

### Backup & Recovery

**Automatic Backups:**
- Free tier: Daily backups (7 days retention)
- Pro tier: Daily backups (30 days retention)

**Manual Backup:**
```bash
# Export database
pg_dump postgres://user:pass@db.supabase.co:5432/postgres > backup.sql

# Restore
psql postgres://user:pass@db.supabase.co:5432/postgres < backup.sql
```

---

## 🛡️ Row-Level Security (RLS)

Enable RLS for sensitive tables:

```sql
-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all user data
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 🔄 Real-Time Subscriptions

### Listen for Booking Updates

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Listen to bookings in real-time
supabase
  .channel('bookings_channel')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'bookings',
      filter: `customer_id=eq.${userId}`
    },
    (payload) => {
      console.log('Booking changed:', payload)
      // Update UI instantly
    }
  )
  .subscribe()
```

### Presence Tracking

```typescript
// Show tasker is online
supabase.channel('presence').on('presence', { event: 'sync' }, () => {
  const presenceState = supabase.channel('presence').presenceState()
  console.log('Active taskers:', presenceState)
}).subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await supabase.channel('presence').track({
      user: userId,
      status: 'available'
    })
  }
})
```

---

## 📦 File Storage

### Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **Create new bucket**
3. Name it (e.g., `media`, `avatars`, `documents`)
4. Configure:
   - **Public**: Turn on for images/avatars
   - **Max file size**: 50MB for photos, 500MB for documents

### Upload Files

```typescript
// Upload profile picture
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/profile.jpg`, file, {
    cacheControl: '3600',
    upsert: false
  })

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/profile.jpg`)

console.log(data.publicUrl)
```

### Generate Signed URL (Private Files)

```typescript
// For documents (keep private, generate temporary access)
const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrl(`${userId}/invoice.pdf`, 3600) // Expires in 1 hour

console.log(data.signedUrl) // Send to user
```

---

## 🚀 Deployment to Vercel

### 1. Connect Supabase to Vercel

```bash
# Via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### 2. Pre-Production Checklist

- [ ] Database schema migrated
- [ ] RLS policies configured
- [ ] Storage buckets created
- [ ] Auth providers configured
- [ ] Environment variables set
- [ ] Backups tested
- [ ] SSL certificate verified

### 3. Deploy

```bash
git push origin main
# Vercel auto-deploys in 60 seconds
```

---

## 📊 Monitoring & Logs

### Check Database Health

```bash
# Via CLI
supabase inspect db

# Via dashboard
# Settings → Database
```

### View Logs

```bash
# Query logs
supabase db logs

# Real-time logs
supabase functions logs

# Via dashboard
# Logs tab
```

### Performance Monitoring

1. Go to **Settings** → **Database** → **Performance Insights**
2. Check slow queries
3. Identify missing indexes

---

## 🆘 Troubleshooting

### Cannot Connect to Database

```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Common issues:
# - Wrong password
# - IP not whitelisted
# - Database region mismatch
```

### Authentication Not Working

```bash
# Verify keys are correct
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Check JWT expiry
# Settings → Auth → Policies

# Test with curl
curl -X POST https://your-project.supabase.co/auth/v1/signup \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"email":"test@taskgh.com","password":"password"}'
```

### Storage Upload Failing

```bash
# Check bucket permissions
# Storage → Bucket name → Policy

# Verify file size < limit
# Default: 50MB

# Check CORS settings
# Settings → API → CORS
```

### Real-time Not Working

```bash
# Enable realtime on table
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

# Restart realtime
# Dashboard → Realtime → Restart
```

---

## 📚 useful Commands

```bash
# Start local Supabase development
supabase start

# Stop local development
supabase stop

# Reset database
supabase db reset

# Create migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Pull schema changes
supabase db pull

# Link to project
supabase link

# Deploy functions
supabase functions deploy
```

---

## 🔗 Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Client**: https://supabase.com/docs/reference/javascript/introduction
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Row-Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Real-time**: https://supabase.com/docs/guides/realtime

---

## ✅ TaskGH Supabase Checklist

Pre-launch verification:

- [ ] Supabase project created
- [ ] Database schema loaded (32 tables)
- [ ] All indexes created
- [ ] RLS policies enabled
- [ ] Auth providers configured
- [ ] Storage buckets created
- [ ] Real-time enabled on key tables
- [ ] Backups tested
- [ ] Connection credentials secure
- [ ] Environment variables set in Vercel
- [ ] Staging deployment working
- [ ] Production deployment ready

---

**Status**: Production-Ready | **Supabase Tier**: Pro | **Region**: Frankfurt/London

