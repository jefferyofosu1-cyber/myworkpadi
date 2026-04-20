# TaskGH: Architecture Complete Reference

## 🎯 Project Overview

TaskGH is a two-sided marketplace platform connecting customers with service providers in Ghana. The architecture is designed for:
- **MVP Launch**: 10 users/day → 100 users/day (weeks 1-8)
- **Growth Phase**: 100 users/day → 1,000 users/day (months 2-6)
- **Scale Phase**: 1,000+ daily active users → Series A readiness (months 6-12)

---

## 📦 Architecture Layers

### 1. Presentation Layer
- **Frontend**: Next.js 14 (React, TypeScript)
- **Mobile**: React Native (future)
- **Admin Dashboard**: Next.js + shadcn/ui
- **API Documentation**: Swagger/OpenAPI
- **CDN**: AWS CloudFront
- **SSL/TLS**: AWS Certificate Manager (auto-renew)

### 2. API Gateway & Routing
- **Load Balancer**: AWS Application Load Balancer (ALB)
- **WAF**: AWS Web Application Firewall
- **Rate Limiting**: API Gateway + middleware (100 req/min per user)
- **Request Validation**: Zod/Joi
- **CORS**: Whitelist frontend domain only

### 3. Application Layer
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (modular, type-safe)
- **Authentication**: JWT (RS256, 15 min TTL)
- **Authorization**: RBAC (5 roles: customer, tasker, company_admin, platform_admin, support)
- **Logging**: Structured JSON (Pino)
- **Observability**: Prometheus metrics, OpenTelemetry traces

### 4. Business Logic Services
- **Auth Service**: Registration, login, MFA, password reset
- **User Service**: Profile management, KYC verification
- **Booking Service**: Create, update, cancel, state transitions
- **Tasker Service**: Availability, rating, performance metrics
- **Payment Service**: Tokenized payments, escrow, refunds
- **Review Service**: Rating submissions, moderation
- **Notification Service**: Email, SMS, push notifications
- **Admin Service**: User management, dispute resolution
- **Analytics Service**: Event tracking, reporting
- **Audit Service**: Compliance logging

### 5. Data Layer
- **Primary Database**: PostgreSQL 15 (RDS)
  - 32 tables (users, bookings, payments, reviews, etc.)
  - Full-text search capability
  - Partitioned tables (bookings by date)
  - Audit logging table
  - 25+ indexes for query optimization

- **Cache Layer**: ElastiCache Redis 7
  - Session storage
  - Booking state cache
  - Rate limiting counters
  - Job queue (Bullmq)

- **Search**: Elasticsearch 8 (full-text search + geo-spatial)
- **Object Storage**: AWS S3 (media, backups)
- **Backup**: Automated snapshots (daily, 30-day retention)

### 6. External Integrations
- **Payment Gateway**: Hubtel (Ghana-focused PCI Level 1)
- **SMS**: FlashSMS (Ghana-focused, OTP, notifications)
- **Email**: SendGrid (transactional email)
- **Maps**: Google Maps API (geolocation)
- **Analytics**: Mixpanel or Segment (optional)

### 7. Monitoring & Observability
- **Metrics**: Prometheus (scrape every 15s)
- **Visualization**: Grafana (dashboards, alerts)
- **Logs**: Loki (log aggregation)
- **Tracing**: Jaeger (distributed tracing)
- **Incidents**: PagerDuty + Slack

### 8. Infrastructure & Deployment
- **Container Runtime**: Docker
- **Orchestration**: AWS ECS Fargate (MVP) → Kubernetes (at scale)
- **Infrastructure as Code**: Terraform (650+ lines)
- **CI/CD**: GitHub Actions (8 jobs: lint/test/security/build/deploy)
- **Secrets Management**: AWS Secrets Manager
- **Monitoring Dashboard**: CloudWatch

---

## 📂 Repository Structure

```
taskgh-architecture/
├── docs/
│   ├── README.md (master overview)
│   ├── DEPLOYMENT_GUIDE.md (launch checklist)
│   └── ARCHITECTURE.md (system design)
├── database/
│   ├── schema.sql (32 tables, indexes, partitions)
│   ├── migrations/
│   └── seed.sql
├── api/
│   ├── openapi.yaml (30+ endpoints)
│   └── postman-collection.json
├── infra/
│   ├── main.tf (Terraform for AWS)
│   ├── terraform.tfvars (env-specific vars)
│   └── outputs.tf
├── docker/
│   ├── docker-compose.yml (12 services)
│   ├── Dockerfile.prod (multi-stage build)
│   └── .dockerignore
├── ci-cd/
│   ├── github-actions.yml (8 jobs)
│   └── .github/workflows/
├── monitoring/
│   ├── prometheus-config.yaml (alerts, targets)
│   ├── grafana-dashboards.json
│   └── alert-rules.yml
├── security/
│   ├── SECURITY_FRAMEWORK.md
│   ├── IAM_POLICIES.json
│   └── threat-model.md
└── runbooks/
    ├── OPERATIONAL_RUNBOOKS.md
    ├── incident-response.md
    ├── scaling-guide.md
    └── backup-restore.md
```

---

## 🔐 Security Architecture

### Authentication & Authorization
- ✅ JWT with RS256 (RSA-2048 signing)
- ✅ MFA mandatory for admins (TOTP)
- ✅ RBAC with 5 user roles
- ✅ Session timeout: 30 min inactivity
- ✅ Token rotation: refresh tokens (7-day TTL)

### Data Protection
- ✅ End-to-end encryption (TLS 1.3)
- ✅ Field-level encryption (PII: AES-256-GCM)
- ✅ Encrypted at rest: RDS, S3, Redis
- ✅ Secrets rotation: 90-day key rotation
- ✅ No PII in logs (masked emails, phone numbers)

### API Security
- ✅ HTTPS enforced
- ✅ CORS whitelist (frontend domain only)
- ✅ CSRF token validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (content encoding, CSP header)
- ✅ Rate limiting: 2,000 req/min per IP (WAF)

### Payment Security
- ✅ Tokenized payment processing (no raw card data)
- ✅ PCI-DSS Level 1 via Hubtel
- ✅ 3D Secure for transactions >GHS 100
- ✅ Fraud detection: velocity, geography, retry attempts
- ✅ Escrow system for booking protection

### Compliance
- ✅ Ghana Data Protection Act compliance
- ✅ GDPR-ready (data portability, right to erasure)
- ✅ Data retention: 3 years for disputes, 12 months for PII
- ✅ Audit logging: all admin actions
- ✅ Incident response plan

---

## 📊 Performance Targets

### API Response Times
- **p50 (median)**: <100ms
- **p95**: <300ms
- **p99**: <1s
- **Error rate**: <0.1%
- **Availability**: 99.9% (SLA)

### Throughput
- **RPS (requests/sec)**: 100+ rps
- **Bookings created/sec**: 10+ bps
- **Concurrent users**: 1,000+

### Database
- **Connection pool**: 100-200 connections
- **Query time (p95)**: <50ms
- **Backup time**: <15 minutes
- **Recovery time**: <1 hour

### Infrastructure
- **Container startup**: <30 seconds
- **Deployment time**: 5-10 minutes (rolling update)
- **Scaling time**: <2 minutes (auto-scaling)

---

## 💰 Cost Breakdown (MVP)

| Component | Size | Monthly Cost |
|-----------|-----|---------|
| **ECS/Fargate** | 2 tasks, 512 CPU | $50 |
| **RDS PostgreSQL** | db.t3.micro, 20GB | $150 |
| **ElastiCache** | cache.t3.micro | $30 |
| **ALB** | 1 load balancer | $25 |
| **S3 Storage** | 10GB media | $25 |
| **CloudFront CDN** | 100GB/month | $50 |
| **Monitoring** | CloudWatch, Logs | $50 |
| **Other** | Secrets, DNS, minor | $25 |
| **TOTAL** | **MVP Stack** | **~$405** |

**Cost Optimization**: Fargate Spot instances (70% discount) + Reserved Capacity (40% discount) available at scale

---

## 🚀 Deployment Phases

### Phase 1: MVP Launch (Week 1-8)
- **Scope**: 100 users, 10 bookings/day
- **Geography**: Accra
- **Features**: Core booking, ratings, payments
- **Infrastructure**: Single region (eu-west-1)
- **Start Point**: Day 0 (100 beta testers)
- **End Point**: Public launch

**Deployment Command**:
```bash
cd taskgh-architecture/infra
terraform apply -var-file="terraform.tfvars.staging"
cd ../docker
docker-compose up -d
```

### Phase 2: Growth (Month 2-6)
- **Scale Target**: 10,000 active users, 500 bookings/day
- **Geography Expansion**: Kumasi, Takoradi
- **New Features**: Corporate accounts, advanced search, promo codes
- **Infrastructure**: Multi-AZ within single region

**Scaling Actions**:
- RDS upgrade: t3.micro → t3.small
- ECS tasks: 2 → 5
- Redis: t3.micro → t3.small
- Add read replicas for analytics

### Phase 3: Series A Scale (Month 6-12)
- **Scale Target**: 50,000+ daily active users
- **Geography**: Nigeria, Kenya, Uganda
- **Infrastructure**: Multi-region, multi-zone
- **Advanced Features**: AI-based matching, subscription tiers

**Scaling Actions**:
- Kubernetes deployment (multi-region)
- Database sharding (by city/country)
- Dedicated search cluster (Elasticsearch)
- Regional CDN distribution

---

## 📋 Pre-Launch Checklist (Week -1)

### MVP Feature Validation
- [ ] User registration & email verification
- [ ] Booking creation & confirmation
- [ ] Payment processing (test + live)
- [ ] Review submission & display
- [ ] Email notifications
- [ ] Admin dashboard

### Security & Compliance
- [ ] SSL certificate installed
- [ ] OWASP ZAP scan (0 critical issues)
- [ ] Privacy Policy published
- [ ] Terms of Service approved
- [ ] Data Processing Agreement signed

### Infrastructure
- [ ] All AWS resources deployed
- [ ] Database seeded with test data
- [ ] Backups tested
- [ ] Monitoring dashboards created
- [ ] On-call schedule finalized

### Operations
- [ ] Runbooks written & reviewed
- [ ] Team trained on incident response
- [ ] Support email & chat ready
- [ ] Status page created
- [ ] Communication templates ready

---

## 🎯 Critical Success Metrics

| Metric | Target (Week 1) | Target (Month 1) |
|--------|---------|---------|
| **User Signups** | 50 | 500 |
| **Bookings Created** | 20 | 300 |
| **Payment Success Rate** | 95% | 99.5% |
| **API Error Rate** | <1% | <0.1% |
| **Customer Support Response** | <4 hours | <2 hours |
| **System Uptime** | 99% | 99.9% |
| **Avg Booking Value** | GHS 50 | GHS 75 |

---

## 📞 Contacts & Support

- **Technical Issues**: incident@taskgh.com
- **Security Issues**: security@taskgh.com
- **Customer Support**: support@taskgh.com
- **Business Inquiries**: business@taskgh.com
- **On-Call Pager**: PagerDuty (TaskGH service)

---

## 🔄 Document Ownership & Updates

| Document | Owner | Review Frequency |
|----------|-------|---------|
| README.md | VP Engineering | Quarterly |
| SECURITY_FRAMEWORK.md | Security Lead | Monthly |
| DEPLOYMENT_GUIDE.md | DevOps Lead | Per launch |
| OPERATIONAL_RUNBOOKS.md | On-Call Lead | Monthly |
| Database Schema | Senior Backend | Quarterly |
| API Spec | Lead Backend | Per feature |

---

## 📚 Related Documentation

- **API Reference**: See `api/openapi.yaml`
- **Database Guide**: See `database/schema.sql`
- **Infrastructure Code**: See `infra/main.tf`
- **Monitoring Setup**: See `monitoring/prometheus-config.yaml`
- **Runbooks**: See `runbooks/OPERATIONAL_RUNBOOKS.md`

---

## 🎓 Architecture Decision Records (ADRs)

**ADR-001**: Use NestJS for backend (type safety, modular architecture)
**ADR-002**: PostgreSQL for primary DB (ACID, proven at scale)
**ADR-003**: Redis for caching & sessions (performance, reliability)
**ADR-004**: Modular monolith for MVP (speed, migration path to microservices)
**ADR-005**: Terraform for IaC (version control, auditability)
**ADR-006**: GitHub Actions for CI/CD (native GitHub integration)
**ADR-007**: JWT with RS256 (stateless, scalable auth)

---

## 🎬 Quick Start Guide

### For New Team Members
1. Read this document (5 min)
2. Read `docs/README.md` (20 min)
3. Read `runbooks/OPERATIONAL_RUNBOOKS.md` (15 min)
4. Set up local dev: `docker-compose up -d` (2 min)
5. Run tests: `npm test` (2 min)

### For Incident Response
1. Check alert in PagerDuty or Grafana
2. Review relevant runbook in `runbooks/OPERATIONAL_RUNBOOKS.md`
3. Execute diagnostic steps
4. Document incident timeline
5. Post-mortem within 24 hours

### For New Deployment
1. Run pre-launch checklist
2. Execute: `npm run deploy:staging`
3. Run smoke tests: `npm run test:smoke:staging`
4. Execute: `npm run deploy:production`
5. Monitor metrics for 24 hours

---

**Generated**: April 2026 | **Status**: Production Ready | **Version**: 1.0.0  
**Last Updated**: April 15, 2024  
**Next Review**: July 15, 2024

