# TaskGH: Production-Grade Marketplace Architecture

> **Enterprise-grade, startup-fast, two-sided marketplace for professional services in Africa**

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Service Boundaries](#service-boundaries)
4. [Technology Stack](#technology-stack)
5. [Deployment Strategy](#deployment-strategy)
6. [Security & Compliance](#security--compliance)
7. [Operational Readiness](#operational-readiness)

---

## System Overview

**TaskGH** is a two-sided marketplace connecting:
- **Customers** (individuals / businesses needing services)
- **Taskers** (verified professionals providing services)
- **Companies** (corporate accounts with recurring jobs)
- **Admins** (platform operators / moderators)

### Key Metrics

| Metric | MVP Phase | Scale Phase | Series A |
|--------|-----------|-------------|----------|
| **Users/Month** | 1,000 | 10,000 | 100,000+ |
| **Bookings/Day** | 10 | 500 | 5,000+ |
| **API p95 Latency** | <500ms | <300ms | <200ms |
| **Availability** | 99% | 99.9% | 99.95% |
| **Regions** | Ghana (Accra) | 5+ Ghana cities | Africa (5+ countries) |

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                      │
│  NextJS Web App │ Mobile App (React Native/Flutter) │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│              API GATEWAY LAYER                      │
│  NGINX / Traefik │ Rate Limiting │ Request Routing  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│          SERVICES LAYER (Modular Monolith)          │
├─────────────────────────────────────────────────────┤
│ Auth │ Booking │ Tasker │ Payments │ Notification   │
│ User │ Pricing │ Review │ Admin    │ Corporate      │
│ Analytics │ Dispatch │ Fraud │ Search               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│         DATA & INFRASTRUCTURE LAYER                 │
├─────────────────────────────────────────────────────┤
│ PostgreSQL (Primary) │ Redis (Cache/Queue/Session   │
│ Elasticsearch (Search) │ S3/Object Storage (Media)   │
└─────────────────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│        PLATFORM SERVICES LAYER                      │
├─────────────────────────────────────────────────────┤
│ Message Queue │ Observability │ Secrets │ CDN        │
└─────────────────────────────────────────────────────┘
```

---

## Service Boundaries

### 1. **Auth Service**
- JWT-based authentication
- OAuth 2.0 integration (Google, Facebook)
- Phone OTP (SMS via FlashSMS)
- Rate limiting on login attempts
- MFA for admin users

### 2. **User Service**
- Profile management (customers, taskers, admins)
- Preferences / settings
- Address book
- Device management
- Session tracking

### 3. **Tasker & Verification Service**
- Skills & certification management
- Verification workflow (KYC, background check)
- Rating & review system
- Availability management
- Payout wallet setup

### 4. **Booking Service**
- Real-time booking state machine
- Match algorithm (dispatch)
- Rescheduling / cancellation
- Booking history + search
- Guest checkout support

### 5. **Payments Service**
- Payment gateway integration (Hubtel)
- Escrow management
- Wallet / prepaid balance
- Refund queue
- PCI compliance tokenization

### 6. **Notification Service**
- Multi-channel: Email, SMS, Push
- Real-time WebSocket events
- Notification preferences
- Retry queue

### 7. **Pricing Service**
- Dynamic pricing rules
- Surge pricing engine
- Promotions / discount codes
- Fee calculation

### 8. **Analytics Service**
- Event streaming (Kafka / Redis Streams)
- Data warehouse export (BigQuery / Redshift)
- Business intelligence dashboards
- Fraud signals

### 9. **Admin Service**
- Moderation workflows
- Dispute resolution
- Refund processing
- KYC review queue
- Analytics dashboard

### 10. **Corporate Accounts Service**
- Team management
- Invoice generation
- Recurring job scheduling
- SLA tracking

---

## Technology Stack

### Backend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Node.js 20 LTS | Vibrant ecosystem, rapid development |
| **Framework** | NestJS | Type-safe, modular, enterprise-ready |
| **Database** | PostgreSQL 15 | ACID, rich feature set, proven at scale |
| **Cache** | Redis 7 | Sessions, rate limiting, queues |
| **Search** | Elasticsearch 8 | Full-text search, geospatial queries |
| **Message Queue** | Redis Streams or RabbitMQ | Async jobs, event streaming |
| **Object Storage** | AWS S3 / DO Spaces | Media files, backups |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Container Runtime** | Docker | Consistent environments |
| **Orchestration** | Kubernetes (EKS/GKE/DO K8s) | Self-healing, scaling |
| **Ingress** | NGINX / Traefik | Load balancing, SSL/TLS |
| **IaC** | Terraform | Reproducible infrastructure |
| **Monitoring** | Prometheus + Grafana | Metrics collection & visualization |
| **Logging** | Loki / ELK Stack | Centralized logging |
| **Error Tracking** | Sentry | Exception monitoring |
| **CI/CD** | GitHub Actions / GitLab CI | Automated testing & deployment |

### Dev Tools

| Tool | Purpose |
|------|---------|
| **VS Code + Dev Container** | Standardized dev environment |
| **Docker Compose** | Local full-stack development |
| **Postman / Insomnia** | API testing |
| **K6** | Load testing |
| **OWASP ZAP** | Security scanning |

---

## Deployment Strategy

### Phase 1: MVP (Weeks 0-8) - Single Region, Cost Optimized

```yaml
Environment: Staging + Production (Ghana - Accra)
Infrastructure:
  - Single Kubernetes cluster (3 nodes minimum)
  - RDS PostgreSQL (db.t3.micro initially)
  - ElastiCache Redis (cache.t3.micro)
  - Single NAT Gateway
  - CloudFront CDN for static assets
  - No multi-zone initially
Cost: ~$500-800/month
```

### Phase 2: Scale (Months 3-6) - Multi-Zone, Resilience

```yaml
Environment: Dev + Staging + Production
Infrastructure:
  - Multi-AZ Kubernetes cluster (min 5 nodes)
  - RDS PostgreSQL (db.t3.small) with Multi-AZ failover
  - ElastiCache Redis with Multi-AZ
  - Auto Scaling Groups for workers
  - Secrets Manager integration
  - Multi-region backup (S3 Cross-Region Replication)
  - WAF + Shield DDoS protection
Cost: ~$2,000-3,000/month
```

### Phase 3: Series A Ready (Months 6+) - Multi-Region, Enterprise

```yaml
Environment: Dev + Staging + Production + DR
Infrastructure:
  - Multi-region active-active setup (Ghana + Nigeria + Kenya)
  - Aurora PostgreSQL Global Database
  - DynamoDB for distributed cache (eventual consistency)
  - Managed Elasticsearch domain
  - Lambda for serverless background jobs
  - EventBridge for complex event routing
  - API Gateway for rate limiting & WAF
Cost: ~$5,000-8,000/month per region
```

---

## Security & Compliance

### Authentication & Authorization
- ✅ JWT with RS256 signing
- ✅ Refresh token rotation
- ✅ RBAC (Role-Based Access Control)
- ✅ ABAC for premium features (Attribute-Based)
- ✅ MFA mandatory for admin/support staff

### Data Protection
- ✅ Encryption at rest (RDS, S3 KMS)
- ✅ TLS 1.3 for all transport
- ✅ Field-level encryption for PII
- ✅ Database audit logging
- ✅ Secrets rotated every 90 days

### Payment Security
- ✅ PCI DSS compliance pathway
- ✅ Tokenized payment processing (no raw card storage)
- ✅ Fraud detection rules
- ✅ 3D Secure for high-risk transactions
- ✅ Escrow system prevents chargebacks

### Compliance
- ✅ Ghana Data Protection ACT compliance
- ✅ GDPR-ready (for future EU expansion)
- ✅ Right to erasure workflows
- ✅ Data residency (Ghana Region primary)
- ✅ Audit trail for all transactions

### DevOps Security
- ✅ Least privilege IAM policies
- ✅ Network segmentation (private subnets for DBs)
- ✅ WAF rules for SQL injection / XSS
- ✅ Secrets in HashiCorp Vault / AWS Secrets Manager
- ✅ Container image scanning (Trivy)
- ✅ SBOM (Software Bill of Materials)

---

## Operational Readiness

### Monitoring & Alerting
- **Availability**: 99.9% SLA (43 minutes downtime/month tolerated)
- **P95 Latency**: <300ms
- **Error Rate**: <0.5%
- **Alert Channels**: PagerDuty, Slack, SMS

### High Availability
- **Multi-zone failover**: Active-passive RDS, DNS failover
- **Circuit breakers**: Payment gateway timeouts
- **Bulkheads**: Separate connection pools
- **Graceful degradation**: Non-critical features disabled on outage

### Disaster Recovery
- **RTO**: 1 hour (max time to restore)
- **RPO**: 15 minutes (max data loss)
- **Daily backups**: Snapshots retained 30 days
- **Point-in-time recovery**: PostgreSQL WAL archiving

### On-Call & Incident Response
- **Severity Levels**: Critical → High → Medium → Low
- **Escalation**: L1 Support → L2 Engineering → L3 Leadership
- **Incident Commander**: Designated on-call engineer
- **Runbooks**: Every critical alert has a decision tree

---

## Directory Structure

```
taskgh-architecture/
├── docs/                          # Architecture documentation
│   ├── ARCHITECTURE.md           # System design deep dive
│   ├── API_DESIGN.md             # REST API conventions
│   ├── DATABASE_STRATEGY.md      # Schema, indexing, query patterns
│   ├── DEPLOYMENT.md             # Environment setup & promotion
│   └── LAUNCH_CHECKLIST.md       # Pre-production sign-off
├── infra/                         # Infrastructure as Code
│   ├── terraform/                # Terraform modules
│   ├── helm/                     # Kubernetes Helm charts
│   └── cloud-init/               # VM bootstrapping scripts
├── database/                      # Database artifacts
│   ├── schema.sql                # PostgreSQL DDL
│   ├── migrations/               # Flyway/Liquibase versions
│   └── indexes.sql               # Performance tuning
├── api/                          # API specifications
│   ├── openapi.yaml              # Complete OpenAPI 3.0 spec
│   └── examples/                 # Request/response examples
├── docker/                       # Container files
│   ├── Dockerfile.prod           # Production image
│   ├── Dockerfile.dev            # Development image
│   └── docker-compose.yml        # Full local stack
├── ci-cd/                        # Continuous integration
│   ├── github-actions/           # Workflows
│   └── gitlab-ci/                # Alternative CI config
├── monitoring/                   # Observability stack
│   ├── prometheus.yml            # Scrape configs
│   ├── grafana/                  # Dashboard definitions
│   ├── loki/                     # Log aggregation
│   └── alerts/                   # AlertManager rules
├── security/                     # Security framework
│   ├── SECURITY_CHECKLIST.md     # Pre-launch audit
│   ├── IAM_POLICIES.json         # AWS/GCP policies
│   └── threat-model.md           # Attack surface analysis
└── runbooks/                     # Operational guides
    ├── INCIDENT_RESPONSE.md      # Crisis procedures
    ├── SCALING_GUIDE.md          # Horizontal scale path
    ├── BACKUP_RESTORE.md         # DR procedures
    └── ON_CALL.md                # Escalation policies
```

---

## Quick Start

### 1. **Local Development**
```bash
cd docker/
docker-compose up -d
npm run dev
```

### 2. **Deploy to Staging**
```bash
git push origin feature/xyz
# GitHub Actions runs tests → builds image → deploys to staging
```

### 3. **Promote to Production**
```bash
git tag v1.0.0
git push origin v1.0.0
# Manual approval in GitHub Actions → Terraform apply → Blue-green deployment
```

---

## Key Principles

1. **Security First**: Encrypt, validate, audit everything
2. **Observability**: If it can fail, we must see it fail
3. **Cost Conscious**: Single region MVP, progressive infrastructure
4. **Reliability**: 99.9%, not 100% (accept outages, but plan recovery)
5. **Scalability**: Horizontal scaling only (no vertical scaling limits)
6. **Simplicity**: Boring is beautiful (proven tech, minimal custom code)

---

## Contact & Next Steps

- **Architecture Lead**: DevOps Engineer + Backend Architect
- **Review Cycle**: Weekly architecture sync
- **Reference**: AWS Well-Architected Framework + 12-Factor App

---

**Generated**: April 2026 | **Status**: Production Ready | **Version**: 1.0.0
