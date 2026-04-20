# TaskGH: Production Deployment Guide

## Pre-Launch Checklist (Day -7)

### Infrastructure Setup (1-2 days)

- [ ] **AWS Account Setup**
  - [ ] Root account with MFA enabled
  - [ ] IAM users created (DevOps, Backend, Frontend)
  - [ ] CloudTrail enabled for audit logging
  - [ ] Billing alerts set (>50% budget)

- [ ] **Networking & Security**
  - [ ] VPC created (10.0.0.0/16)
  - [ ] Public subnets (2): 10.0.1.0/24, 10.0.2.0/24
  - [ ] Private subnets (2): 10.0.10.0/24, 10.0.11.0/24
  - [ ] NAT Gateway configured
  - [ ] Security groups created (ALB, ECS, RDS, Redis)

- [ ] **Secrets Management**
  - [ ] AWS Secrets Manager initialized
  - [ ] Database password (20+ chars, randomized)
  - [ ] JWT signing key (RS256 pair)
  - [ ] Redis auth token (32+ chars)
  - [ ] API keys (Hubtel, FlashSMS, SendGrid)

- [ ] **Database Setup**
  - [ ] PostgreSQL 15 RDS instance created (db.t3.micro initially)
  - [ ] Backup retention: 30 days
  - [ ] Multi-AZ: disabled for MVP (enable later)
  - [ ] Parameter group configured (log_statement=all)
  - [ ] Schema migrated: `psql < database/schema.sql`
  - [ ] Indexes created: `psql < database/indexes.sql`
  - [ ] Test data loaded (100 taskers, 1000 bookings)

- [ ] **Redis Setup**
  - [ ] ElastiCache Redis cluster created (cache.t3.micro)
  - [ ] Auth token enabled
  - [ ] Encryption at rest & in transit enabled
  - [ ] Backup retention: 7 days

- [ ] **Container Registry**
  - [ ] GitHub Container Registry (GHCR) authenticated
  - [ ] Docker image built & pushed: `v1.0.0`
  - [ ] Image scanned with Trivy (0 critical/high vulns)

### Application Deployment (1-2 days)

- [ ] **ECS Cluster**
  - [ ] Cluster created: `taskgh-cluster`
  - [ ] Capacity provider: Fargate (no EC2 instances)
  - [ ] Task definition: 512 CPU, 1024 MB RAM
  - [ ] Logging: CloudWatch `/ecs/taskgh`

- [ ] **Load Balancer**
  - [ ] ALB created with health check (`/health`)
  - [ ] Target group configured (HTTP 3000)
  - [ ] Security group (80 & 443 ingress)

- [ ] **Monitoring**
  - [ ] Prometheus deployed (pulls metrics from app)
  - [ ] Grafana dashboards configured
  - [ ] CloudWatch dashboards created
  - [ ] PagerDuty integrated
  - [ ] Slack integration enabled

- [ ] **Artifact Storage**
  - [ ] S3 bucket for media uploads
  - [ ] CloudFront distribution for CDN
  - [ ] Origin Access Identity configured

### Pre-Production Testing (2-3 days)

- [ ] **Load Testing**
  - [ ] k6 script: 1000 concurrent users
  - [ ] Booking creation throughput: >100 req/sec
  - [ ] API p95 latency: <300ms
  - [ ] No memory leaks after 1 hour

- [ ] **Security Testing**
  - [ ] OWASP ZAP scan: 0 critical/high issues
  - [ ] SQL injection test: ✓ protected
  - [ ] XSS test: ✓ protected
  - [ ] CSRF test: ✓ tokens validated
  - [ ] Dependency audit: `npm audit` ✓ no vulns

- [ ] **Backup & Recovery**
  - [ ] Snapshot restored to test instance
  - [ ] Data integrity verified
  - [ ] RTO tested: <1 hour
  - [ ] RPO tested: <15 minutes

- [ ] **Disaster Recovery**
  - [ ] Failover procedure documented
  - [ ] On-call runbooks prepared
  - [ ] Communication templates ready

### Operations Setup (1 day)

- [ ] **On-Call**
  - [ ] PagerDuty schedule: primary + backup
  - [ ] Escalation policy: L1 → L2 → L3
  - [ ] On-call handoff checklist

- [ ] **Documentation**
  - [ ] API documentation (Swagger)
  - [ ] Runbooks for critical scenarios
  - [ ] Architecture diagrams
  - [ ] Architecture ADRs (Architecture Decision Records)

- [ ] **Compliance**
  - [ ] Privacy Policy published
  - [ ] Terms of Service finalized
  - [ ] Data Processing Agreement signed (AWS)
  - [ ] Incident response plan approved

---

## LAUNCH DAY (Day 0)

### 4 Hours Before Launch

```bash
#!/bin/bash
set -e

echo "🚀 TaskGH Launch Day - Pre-Launch Checklist"

# 1. Final health checks
echo "1. Verifying infrastructure..."
aws ec2 describe-vpcs --filters "Name=cidr,Values=10.0.0.0/16"
aws ecs describe-clusters --clusters taskgh-cluster

# 2. Database health
echo "2. Verifying database..."
psql -h $(aws rds describe-db-instances \
  --db-instance-identifier taskgh-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text) \
  -U taskgh_admin -d taskgh_prod \
  -c "SELECT COUNT(*) as users FROM users; SELECT COUNT(*) as bookings FROM bookings;"

# 3. Redis health
echo "3. Verifying cache..."
redis-cli -h $(aws elasticache describe-cache-clusters \
  --cache-cluster-id taskgh-cache \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text) \
  ping

# 4. Load balancer health
echo "4. Verifying load balancer..."
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:eu-west-1:ACCOUNT_ID:targetgroup/taskgh-tg/...

# 5. DNS verification
echo "5. Configured DNS as:"
echo "  api.taskgh.com → $(aws elbv2 describe-load-balancers --query 'LoadBalancers[0].DNSName' --output text)"

echo ""
echo "✅ All systems ready for launch!"
```

### Deployment Steps

```bash
# Step 1: Verify current image is running
aws ecs describe-services \
  --cluster taskgh-cluster \
  --services taskgh-service \
  --region eu-west-1 | grep taskDefinition

# Step 2: Force new deployment (rolling update)
aws ecs update-service \
  --cluster taskgh-cluster \
  --service taskgh-service \
  --force-new-deployment \
  --region eu-west-1

# Step 3: Monitor deployment
watch -n 5 'aws ecs describe-services \
  --cluster taskgh-cluster \
  --services taskgh-service \
  --region eu-west-1 \
  | grep -E "runningCount|desiredCount"'

# Step 4: Health check API
for i in {1..60}; do
  if curl -f https://api.taskgh.com/health; then
    echo "✅ API is healthy!"
    break
  fi
  echo "Waiting... ($i/60)"
  sleep 5
done

# Step 5: Run smoke tests
npm run test:smoke:prod
```

### Post-Launch Monitoring (First 24 hours)

```bash
# Every 30 minutes, check:

# 1. API error rate
aws cloudwatch get-metric-statistics \
  --namespace Custom/TaskGH \
  --metric-name APIErrorRate \
  --start-time $(date -u -d "30 minutes ago" +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# 2. Database connections
SELECT COUNT(*) FROM pg_stat_activity;

# 3. Redis memory
redis-cli INFO memory

# 4. Booking count
SELECT COUNT(*) FROM bookings WHERE created_at > NOW() - INTERVAL '1 hour';

# 5. Payment success rate
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  ROUND(100.0 * COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*), 2) as success_rate
FROM payments WHERE created_at > NOW() - INTERVAL '1 hour';
```

### Launch Communications

**Slack announcement** (in #launches):
```
🚀 TaskGH API v1.0.0 is now LIVE!

📊 Metrics:
- API: https://api.taskgh.com
- Docs: https://api.taskgh.com/docs
- Status: https://status.taskgh.com
- Grafana: https://monitoring.taskgh.com

🎯 KPIs (first 24 hours):
- Users: 15 (beta testers)
- Bookings: 3
- Success rate: 100%
- Error rate: 0%
- Avg latency: 145ms

📝 Release Notes: https://wiki.taskgh.com/releases/v1.0.0
```

**Email to beta users**:
```
Subject: TaskGH is Live! 🎉

Hi there,

We're thrilled to announce that TaskGH is now live in Ghana!

API Endpoint: https://api.taskgh.com
Web App: https://app.taskgh.com
Mobile App: Coming soon

Getting started:
1. Create account
2. Browse taskers by category
3. Book your first service

Support: support@taskgh.com
```

---

## SCALING TIMELINE (Months 1-12)

### Month 1: MVP Stabilization
- ✅ 100 active users
- ✅ 10 bookings/day
- ✅ Monitor & iterate
- ✓ Fix bugs found by beta users
- ✓ Optimize slow queries

### Month 2-3: Early Growth
- 500 active users
- 50 bookings/day
- Add: SMS notifications, push notifications
- Database: add read replica
- Cache: increase Redis to micro

### Month 3-6: Ramp-Up
- 5,000 active users
- 500 bookings/day
- Multi-city expansion (Kumasi, Takoradi)
- RDS: upgrade to small instance
- Load: scale to 5 ECS tasks

### Month 6-12: Series A Scale
- 50,000+ active users
- 5,000+ bookings/day
- Multi-country (Nigeria, Kenya)
- Infrastructure: multi-zone, multi-region
- Database: read replicas in each region
- Caching layer optimization

---

## Production Support Model

### On-Call Rotation
- **Primary**: Lead Backend Engineer (7 days/week)
- **Secondary**: Senior Backend Engineer (backup)
- **Tertiary**: CTO (escalation)

### Response SLAs
| Severity | Response Time | Resolution Target |
|----------|---|---|
| Critical | 5 min | 1 hour |
| High | 15 min | 4 hours |
| Medium | 1 hour | 24 hours |
| Low | 4 hours | 7 days |

---

## Cost Optimization Milestones

**Month 1 Cost** (~$500-600/month):
- ECS: $50 (2 tasks × 512 CPU)
- RDS: $150 (db.t3.micro)
- ElastiCache: $30 (cache.t3.micro)
- S3/CDN: $50
- Misc (Secrets, CloudWatch): $50

**Series A Projection** (~$3,000-4,000/month):
- ECS: $500 (10 tasks × 1024 CPU)
- RDS: $500 (db.t3.small + replicas)
- ElastiCache: $200 (scaled Redis)
- S3/CDN: $300
- Multi-region: 2x cost for DR region

---

## Rollback Procedure

**If critical bugs found within 1 hour of launch**:

```bash
# Option 1: Redeploy previous working tag
git log --oneline | head -5
# o abc1234 v1.0.0 (current - BROKEN)
# o def5678 v0.9.9 (previous - working)

docker pull ghcr.io/taskgh/app:v0.9.9

aws ecs update-service \
  --cluster taskgh-cluster \
  --service taskgh-service \
  --force-new-deployment \
  --region eu-west-1

# Monitor
watch -n 5 'aws ecs describe-services --cluster taskgh-cluster --services taskgh-service --region eu-west-1 | grep runningCount'

# Verify
curl https://api.taskgh.com/health
```

---

**Generated**: April 2026 | **Status**: Ready for Launch | **Version**: 1.0.0

