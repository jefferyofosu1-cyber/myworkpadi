# TaskGH: Vercel-First Architecture

## 🎯 Project Overview

TaskGH is a two-sided marketplace platform connecting customers with service providers in Ghana. This is the **Vercel-first architecture** (all AWS removed).

### Why Vercel + Supabase?
✅ **Zero DevOps**: Automatic scaling, global CDN, built-in monitoring  
✅ **Cost-effective**: ~60% cheaper than AWS for startup MVP  
✅ **Fast deployment**: Push to git → live in 60 seconds  
✅ **Global by default**: Served from 35+ edge locations worldwide  
✅ **Integrated backend**: Supabase provides PostgreSQL, Auth, Storage, Real-time APIs  
✅ **Real-time capable**: Live subscriptions for instant updates  

---

## 🏗️ Architecture Layers

### 1. **Presentation Layer**
- **Frontend**: Next.js 14 (React, TypeScript) on Vercel
- **Mobile**: React Native (future, via Expo EAS)
- **Admin Dashboard**: Next.js with shadcn/ui on Vercel
- **API Documentation**: Swagger/OpenAPI (auto-hosted by Vercel)
- **CDN**: Vercel Edge Network (global, automatic)
- **SSL/TLS**: Automatic via Vercel (free, auto-renew with Let's Encrypt)

### 2. **API Layer**
- **Load Balancing**: Vercel (automatic, global edge functions)
- **Rate Limiting**: Vercel Edge Middleware
- **Request Validation**: Zod/Joi
- **CORS**: Whitelist frontend domain (Vercel middleware)
- **Authentication**: JWT (RS256, 15 min TTL, HttpOnly cookies)
- **Logging**: Vercel Logs + Sentry for errors

### 3. **Application Layer**
- **Runtime**: Node.js 20 LTS on Vercel Functions
- **Framework**: NestJS (modular, type-safe)
- **Execution**: Vercel Serverless Functions (automatic scaling)
- **Concurrency**: Handled by Vercel (unlimited)
- **Deployment**: Automatic on git push

### 4. **Business Logic Services**
Same 12 services as original architecture:
- Auth, User, Booking, Tasker, Payment, Review, Notification, Admin, Analytics, Audit, Pricing, Corporate

### 5. **Data Layer**
- **Primary Database**: Supabase PostgreSQL (managed PostgreSQL 15)
  - Real-time subscriptions via PostgREST
  - Secure connection via TLS
  - Row-level security (RLS) policies
  - Automatic backups (7-day retention on free, 30-day on paid)
  - Point-in-time recovery
  - Read replicas available (paid tier)
  - Built-in authentication (Supabase Auth)

- **Cache Layer**: Supabase + Upstash Redis (optional)
  - Session storage (via Supabase session table or Upstash)
  - Rate limiting counters
  - Booking state cache
  - Job queue (optional)

- **Search**: Supabase Full-text Search (native PostgreSQL)
  - No external Elasticsearch needed
  - Built-in to PostgreSQL

- **Object Storage**: Supabase Storage + Vercel Blob
  - Media files (photos, videos) via Supabase
  - Documents via Supabase
  - Automatic CDN distribution
  - Direct browser access with signed URLs

- **Real-time**: Supabase Realtime
  - Live booking updates
  - Instant notifications
  - Presence tracking

- **Backup**: Automated (Supabase manages snapshots)

### 6. **External Integrations**
- **Payment Gateway**: Hubtel (Ghana PCI Level 1)
- **SMS**: FlashSMS (Ghana-focused, ~0.05 GHS/SMS)
- **Email**: SendGrid (transactional emails)
- **Maps**: Google Maps API
- **Analytics**: PostHog or Segment (optional)
- **Error Tracking**: Sentry
- **Monitoring**: Vercel Analytics + Axiom (logs)

### 7. **Monitoring & Observability**
- **Dashboards**: Vercel Dashboards + Sentry
- **Metrics**: Vercel Analytics (automatic)
- **Logs**: Vercel Logs + Axiom (optional)
- **Tracing**: OpenTelemetry (self-hosted collector optional)
- **Alerting**: Sentry alerts + Slack via webhooks

### 8. **Infrastructure & Deployment**
- **Hosting**: Vercel (automatic global CDN)
- **Database**: Supabase PostgreSQL (hosted globally)
- **Authentication**: Supabase Auth (JWT, OAuth, MFA)
- **Storage**: Supabase Storage (with CDN)
- **Cache**: Upstash Redis (optional, for extreme performance)
- **Real-time**: Supabase Realtime (WebSocket subscriptions)
- **CI/CD**: Vercel (automatic on git push)
- **Secrets**: Vercel Environment Variables
- **DNS**: Vercel or custom domain
- **Backup**: Automatic (Supabase manages)

---

## 📂 Repository Structure

```
myworkpadi/                    # Main Next.js app (hosted on Vercel)
├── src/
│   ├── app/                  # Next.js app routes
│   ├── components/           # React components
│   ├── pages/               # API routes (/api/* all run on Vercel Functions)
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client (DB, Auth, Storage)
│   │   ├── db.ts            # Database query helpers
│   │   ├── auth.ts          # Supabase Auth helpers
│   │   ├── storage.ts       # Supabase Storage client
│   │   └── utils.ts
│   └── utils/
├── vercel.json              # Vercel deployment config
├── .env.local               # Local dev environment
├── .env.production          # Production secrets (set in Vercel dashboard)
├── package.json
├── tsconfig.json
├── next.config.js
└── public/

taskgh-architecture/         # Documentation & reference
├── docs/
│   ├── README.md            # (this file)
│   ├── DEPLOYMENT_GUIDE.md  # Vercel deployment guide
│   ├── ENV_CONFIGURATION.md # Environment variables
│   └── QUICK_REFERENCE.md
├── database/
│   └── schema.sql           # PostgreSQL schema
├── api/
│   └── openapi.yaml         # API specification
└── docker/
    └── docker-compose.yml   # Local development stack
```

---

## 💾 Backend Services Overview

### Supabase PostgreSQL
**Connection**: Automatically secured with TLS
```
postgresql://postgres:password@db.supabase.co:5432/postgres
```
- ✅ 500MB free tier
- ✅ Real-time subscriptions via PostgREST
- ✅ Row-level security (RLS)
- ✅ Automatic backups (7-30 days)
- ✅ Point-in-time recovery
- ✅ Read replicas (paid)
- ✅ Full-text search (native)
- ✅ Vector embeddings (pgvector)

### Supabase Auth
**Features**: Built-in authentication
```typescript
const { data, error } = await supabase.auth.signUpWithPassword({
  email: 'user@taskgh.com',
  password: 'password'
})
```
- ✅ JWT tokens (configurable TTL)
- ✅ OAuth (Google, GitHub, Facebook)
- ✅ MFA/TOTP support
- ✅ Email/SMS verification
- ✅ Row-level security integration

### Supabase Storage
**Connection**: REST API authenticated with Supabase token
```
https://supabase.co/storage/v1/object/{bucket}/{path}
```
- ✅ 5GB free tier
- ✅ Automatic CDN distribution
- ✅ Direct browser access with signed URLs
- ✅ No egress charges
- ✅ S3 compatibility

### Supabase Realtime
**Features**: Real-time WebSocket subscriptions
```typescript
supabase
  .channel('booking_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'bookings' },
    (payload) => handleChange(payload)
  )
  .subscribe()
```
- ✅ Live database changes
- ✅ Presence tracking
- ✅ Broadcast messaging
- ✅ Scales with database replicas

### Vercel Functions
**Execution**: Automatic serverless on Vercel
- ✅ Cold start: <100ms (Node.js)
- ✅ Concurrency: Unlimited
- ✅ Memory: 3GB per function
- ✅ Timeout: 60s (pro) or 300s (enterprise)

---

## 🔐 Security

### Authentication & Authorization
- ✅ JWT with RS256 (RSA-2048)
- ✅ MFA for admin users (TOTP)
- ✅ RBAC with 5 roles
- ✅ Session timeout: 30 min
- ✅ HttpOnly, Secure cookies

### Data Protection
- ✅ End-to-end TLS 1.3
- ✅ Field-level encryption (PII with AES-256-GCM)
- ✅ Automatic backups (Vercel manages encryption at rest)
- ✅ Secrets rotation: 90 days
- ✅ No PII in logs

### Network Security
- ✅ DDoS protection (Vercel + Cloudflare)
- ✅ WAF rules (Vercel Edge Network)
- ✅ HSTS headers
- ✅ CSP headers
- ✅ Rate limiting via Vercel Edge Middleware

### Compliance
- ✅ Ghana Data Protection Act
- ✅ GDPR-ready
- ✅ PCI-DSS pathway (via Hubtel)
- ✅ Audit logging
- ✅ Data retention policies

---

## 📊 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| **p50 latency** | <50ms | ✅ Via edge functions |
| **p95 latency** | <300ms | ✅ Via global CDN |
| **p99 latency** | <1s | ✅ Via auto-scaling |
| **Availability** | 99.9% | ✅ Vercel SLA |
| **RPS** | 100+ req/sec | ✅ Auto-scales |
| **Concurrent users** | 1,000+ | ✅ Vercel manages |

---

## 💰 Cost Breakdown

| Component | Size | Monthly Cost |
|-----------|-----|-------------|
| **Vercel Pro** | Unlimited bandwidth | $20 |
| **Supabase Pro** | Postgres, Auth, Storage | $25 |
| **Upstash Redis** (optional) | For extreme performance caching | $0-20 |
| **External Services** | Hubtel, FlashSMS, SendGrid, Google Maps | $40 |
| **Error Tracking** | Sentry Pro | $20 |
| **Monitoring** (optional) | Axiom | $10 |
| **Domain** | Custom domain | $12 |
| **Other** | Misc | $3 |
| **TOTAL** | **MVP Stack** | **~$130** |

**Scaling at 50k users**: $200-300/month (still far cheaper than AWS)

---

## 🚀 Deployment Flow

### Local Development
```bash
npm install
npm run dev
# http://localhost:3000
```

### Push to GitHub
```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

### Automatic Deployment via Vercel
- Vercel detects git push
- Automatic build: `npm run build`
- Type checking: `npm run type-check`
- Linting: `npm run lint`
- Tests: `npm test` (optional)
- Deploy preview URL generated
- Merge to main → Automatic production deploy

### Monitoring
- Vercel dashboards show real-time metrics
- Sentry captures errors automatically
- Vercel Logs show request/response details

---

## 📋 Pre-Launch Checklist

- [ ] GitHub repo connected to Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Database migrated: `npm run db:migrate`
- [ ] Test data seeded: `npm run db:seed`
- [ ] Hubtel credentials configured
- [ ] FlashSMS API key added
- [ ] SendGrid API key configured
- [ ] Sentry DSN configured
- [ ] Database backups tested
- [ ] API endpoints working
- [ ] Security headers configured
- [ ] HTTPS enforced (automatic)
- [ ] Analytics configured

---

## 🎊 Success Metrics

Your TaskGH deployment is successful when:

✅ **Immediate (Day 0)**
- All GitHub Actions pass
- Vercel deployment succeeds (< 60 seconds)
- `https://taskgh.vercel.app` returns 200 OK
- Dashboard shows <100ms avg latency

✅ **Week 1**
- 100+ beta users active
- <0.1% error rate (monitored in Sentry)
- Payment processing working (Hubtel)
- <300ms p95 latency maintained

✅ **Month 1**
- 500+ active users
- 50+ bookings/day
- 99.9% uptime maintained
- Database size <1GB

✅ **Series A (Month 6+)**
- 50,000+ daily active users
- Multi-country presence
- Vercel auto-scaling handling load
- <3% avg error rate
- Enterprise-grade reliability

---

## 🔧 Common Vercel Tasks

### Deploy a new version
```bash
git push origin main  # Automatic
```

### Rollback to previous version
```bash
# Vercel dashboard → Deployments → Click previous → Promote to Production
```

### Scale the database
```bash
# Vercel dashboard → Storage → Postgres → Upgrade plan
```

### View logs
```bash
vercel logs
# Or: Vercel dashboard → Deployments → Logs
```

### Access database directly
```bash
# Install Vercel CLI
npm i -g vercel

# Connect to database
vercel postgres shell
# psql prompt opens
```

### Backup database
```bash
# Automatic daily backups (7-30 days depending on plan)
# Or manual in Vercel dashboard → Storage → Backups
```

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/postgres
- **Vercel KV**: https://vercel.com/docs/kv
- **Vercel Blob**: https://vercel.com/docs/blob
- **Sentry Docs**: https://docs.sentry.io/
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎯 Next Steps

1. Connect GitHub repo to Vercel
2. Set up environment variables
3. Deploy to Vercel
4. Configure custom domain
5. Set up monitoring & alerts
6. Launch beta program
7. Monitor and iterate

---

**Generated**: April 2026 | **Status**: Vercel-First Architecture | **Version**: 1.0.0

