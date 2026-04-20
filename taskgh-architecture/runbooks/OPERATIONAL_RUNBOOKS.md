# TaskGH: Operational Runbooks

## Index

1. [Incident Response](#incident-response)
2. [Scaling Guide](#scaling-guide)
3. [Backup & Disaster Recovery](#backup--disaster-recovery)
4. [Database Troubleshooting](#database-troubleshooting)
5. [On-Call Procedures](#on-call-procedures)

---

## Incident Response

### Critical Alert: Service Down (API returning 5xx errors)

**Severity**: CRITICAL | **Response Time**: 5 minutes

#### Step 1: Assessment

```bash
# 1. Check ECS service status
aws ecs describe-services \
  --cluster taskgh-cluster \
  --services taskgh-service \
  --region eu-west-1

# 2. Review CloudWatch logs
aws logs tail /ecs/taskgh --follow

# 3. Check ALB health
aws elbv2 describe-target-health \
  --target-group-arn arn:aws:elasticloadbalancing:eu-west-1:ACCOUNT_ID:targetgroup/taskgh-tg/...

# 4. Monitor Prometheus
# Visit: http://prometheus.internal:9090
# Queries:
# - container_cpu_usage_seconds_total
# - container_memory_usage_bytes
# - http_request_duration_milliseconds{status="5xx"}
```

#### Step 2: Triage

**If ECS tasks are failing**:
```bash
# Check task logs
aws ecs describe-tasks \
  --cluster taskgh-cluster \
  --tasks <TASK_ARN> \
  --region eu-west-1

# Restart tasks
aws ecs update-service \
  --cluster taskgh-cluster \
  --service taskgh-service \
  --force-new-deployment \
  --region eu-west-1
```

**If database is down**:
```bash
# Check RDS status
aws rds describe-db-instances \
  --db-instance-identifier taskgh-db \
  --region eu-west-1

# Check Multi-AZ failover status
# If failover needed, describe-events shows the event
aws rds describe-events \
  --source-identifier taskgh-db \
  --max-records 10
```

**If Redis is down**:
```bash
# Check ElastiCache cluster
aws elasticache describe-cache-clusters \
  --cache-cluster-id taskgh-cache \
  --region eu-west-1
```

#### Step 3: Recovery

| Scenario | Action |
|----------|--------|
| **OOM (Memory)** | Increase task memory (512→1024MB). Redeploy. Monitor. |
| **CPU Spike** | Check for runaway queries. Auto-scaling should kick in. Monitor. |
| **Database Connection Pool Exhausted** | `SHOW max_connections;` Increase if needed. Restart app tasks. |
| **Redis Memory Full** | `INFO memory`. Implement eviction policy (allkeys-lru). Restart. |
| **Certificate Expired** | AWS auto-renews. If manual: `certbot renew`. Redeploy. |

#### Step 4: Notify & Document

```bash
# Create incident in PagerDuty
curl -X POST https://api.pagerduty.com/incidents \
  -H 'Authorization: Token token=YOUR_PAGERDUTY_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "incident": {
      "type": "incident",
      "title": "TaskGH API Down - ECS Tasks Failing",
      "urgency": "high",
      "service": {"id": "SERVICE_ID", "type": "service_reference"}
    }
  }'

# Post to Slack
# Channel: #incidents
# @here TaskGH API is DEGRADED. ECS investigating. Update in 5 min.

# Document in incident log
# Add entry to: https://wiki.taskgh.com/incidents/INCIDENT_ID
```

#### Step 5: Post-Incident

```
- Timeline: 14:05 - Alert fired
- Root cause: OOM on container (1024MB burstable insufficient)
- Fix: Increased to 2GB, deployed new task definition
- Verification: 3 min recovery, all health checks green
- Action items:
  - [ ] Set CloudWatch alarm for memory (>80%)
  - [ ] Load test new sizing
  - [ ] Documentation update (by @devops-lead)
```

---

### Critical Alert: Payment Gateway Timeout

**Severity**: HIGH | **Response Time**: 15 minutes

#### Step 1: Check Hubtel Status

```bash
# 1. Check Hubtel API status
curl -I https://api.hubtel.com/v1/health

# 2. Review recent payment logs
aws logs filter-log-events \
  --log-group-name /ecs/taskgh \
  --filter-pattern "error.*hubtel" \
  --start-time $(date -d '15 minutes ago' +%s)000

# 3. Check circuit breaker state (if implemented)
redis-cli -h REDIS_HOST
> GET circuit_breaker:hubtel
```

#### Step 2: Decision Tree

```
Is Hubtel API responding?
  ├─ YES: Check our timeout settings (increase temporarily?)
  │   └─ Notify team, monitor
  └─ NO: Hubtel outage
      └─ Enable payment fallback (if configured)
         └─ Or queue payments, process when restored
```

#### Step 3: Queue Fallback

```sql
-- If Hubtel is down: insert pending payments to queue
INSERT INTO payment_queue (booking_id, amount, status, retry_count)
SELECT id, total_amount, 'pending', 0
FROM bookings
WHERE payment_id IS NULL AND status NOT IN ('cancelled', 'completed')
ON CONFLICT DO NOTHING;

-- Worker will retry every 5 minutes
-- Manual retry: TRUNCATE payment_queue; INSERT...
```

#### Step 4: Customer Communication

```
Subject: TaskGH Payment Processing Delay

We're experiencing a temporary delay in payment processing with our 
payment provider. Your booking is secure and will be processed once 
our system is restored. You'll receive a confirmation email within 1 hour.

Support: support@taskgh.com
```

---

### Medium Alert: Database CPU High (>80%)

**Severity**: MEDIUM | **Response Time**: 1 hour

#### Step 1: Identify Slow Queries

```sql
-- Get top slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Get queries currently running
SELECT 
  pid,
  query,
  state_change
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY query_start DESC;

-- Kill long-running query (if needed)
SELECT pg_terminate_backend(pid);
```

#### Step 2: Access Plan Optimization

```sql
-- Analyze query plan
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM bookings
WHERE created_at > NOW() - INTERVAL '7 days'
AND status = 'completed'
ORDER BY created_at DESC
LIMIT 100;

-- Check missing indexes
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

-- Add missing index if needed
CREATE INDEX CONCURRENTLY idx_bookings_status_date 
ON bookings(status, created_at DESC);
```

#### Step 3: Scaling Options

```bash
# Option 1: Increase RDS instance size (downtime)
aws rds modify-db-instance \
  --db-instance-identifier taskgh-db \
  --db-instance-class db.t3.medium \
  --apply-immediately
# ⚠️ ~2-3min downtime

# Option 2: Add read replica (no downtime)
aws rds create-db-instance-read-replica \
  --db-instance-identifier taskgh-db-read-replica \
  --source-db-instance-identifier taskgh-db \
  --region eu-west-1

# Update analytics/reporting queries to use replica
# Connection string: taskgh-db-read-replica.XXXXX.eu-west-1.rds.amazonaws.com
```

#### Step 4: Monitor Recovery

```bash
# Watch metrics
watch -n 5 'aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=taskgh-db \
  --start-time $(date -u -d "10 minutes ago" +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average'
```

---

## Scaling Guide

### Horizontal Scaling (More Instances)

**When**: API p95 > 300ms, CPU > 80%

```bash
# Current setup: 2 tasks (min), 10 tasks (max)

# 1. Monitor metric thresholds
watch -n 5 'aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=taskgh-service \
  --start-time $(date -u -d "5 minutes ago" +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 60 \
  --statistics Average'

# 2. Auto-scaling should handle automatically via target tracking
# But can manually scale if needed:
aws ecs update-service \
  --cluster taskgh-cluster \
  --service taskgh-service \
  --desired-count 5 \
  --region eu-west-1

# 3. Verify new tasks are healthy
aws ecs describe-services \
  --cluster taskgh-cluster \
  --services taskgh-service \
  --region eu-west-1 \
  | grep -E "runningCount|desiredCount"
```

### Vertical Scaling (Bigger Instances)

**When**: Single task is bottleneck

```bash
# Current: 512 CPU, 1024 MB RAM
# Upgrade to: 1024 CPU, 2048 MB RAM

# 1. Update task definition
aws ecs register-task-definition \
  --family taskgh \
  --container-definitions '[{
    "name": "taskgh",
    "cpu": 1024,
    "memory": 2048,
    "image": "ghcr.io/taskgh/app:latest"
  }]'

# 2. Update service to use new task def
aws ecs update-service \
  --cluster taskgh-cluster \
  --service taskgh-service \
  --task-definition taskgh:2 \
  --force-new-deployment

# 3. Monitor deployment
aws ecs wait services-stable \
  --cluster taskgh-cluster \
  --services taskgh-service
```

### Database Scaling

**Read-heavy workload**:
```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier taskgh-db-read-1 \
  --source-db-instance-identifier taskgh-db \
  --region eu-west-1

# Point analytics queries to replica
# All write queries still go to primary
```

**Write-heavy workload** (future):
```bash
# Shard bookings by city/date
# For now, vertical scaling or read cache (Redis CACHING)
```

### Cache Optimization

```bash
# Check Redis memory
redis-cli -h REDIS_HOST
> INFO memory

# If memory high: set eviction policy
CONFIG SET maxmemory-policy allkeys-lru

# Implement cache key TTL
SET booking:{id}:details {json} EX 300  # 5 min TTL

# Monitor cache hit rate
INFO stats
# hits / (hits + misses)
```

---

## Backup & Disaster Recovery

### Manual Database Snapshot

```bash
# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier taskgh-db \
  --db-snapshot-identifier taskgh-db-snapshot-$(date +%Y%m%d-%H%M%S) \
  --region eu-west-1

# Verify snapshot
aws rds describe-db-snapshots \
  --db-snapshot-identifier taskgh-db-snapshot-20240415-143000 \
  --region eu-west-1

# Snapshots are automatically encrypted & replicated to S3
```

### Point-in-Time Recovery (PITR)

```bash
# If data was corrupted/deleted at 14:32 UTC
# Restore to 14:30 UTC (before corruption)

aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier taskgh-db \
  --target-db-instance-identifier taskgh-db-recovery-$(date +%s) \
  --restore-time 2024-04-15T14:30:00Z \
  --region eu-west-1

# This creates new DB instance (doesn't touch original)
# Verify data in new instance
# Swap CNAME/DNS once verified
```

### Full Disaster Recovery (Region Failover)

**Scenario**: eu-west-1 (Ireland) completely down

```bash
# 1. Promote read replica (if in different region)
# (Pre-created in us-east-1 as standby)
aws rds promote-read-replica \
  --db-instance-identifier taskgh-db-us-east-1 \
  --region us-east-1

# 2. Update application DNS to point US region
# CNAME: api.taskgh.com -> us-east-1 ALB

# 3. Scale up US region ECS cluster
aws ecs update-service \
  --cluster taskgh-cluster-us-east-1 \
  --service taskgh-service \
  --desired-count 5 \
  --region us-east-1

# 4. Verify health
while true; do
  curl -I https://api.taskgh.com/health
  sleep 5
done

# 5. Notify stakeholders
# Incident: Failover to US region complete. ETA 1.5 hours to restore EU.
```

### Backup Restoration Test (Weekly)

```bash
#!/bin/bash
# test_restore.sh - Restore backup to test environment

BACKUP_SNAPSHOT="taskgh-db-snapshot-latest"
TEST_INSTANCE="taskgh-db-test-restore"

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier $TEST_INSTANCE \
  --db-snapshot-identifier $BACKUP_SNAPSHOT \
  --region eu-west-1 \
  --publicly-accessible false \
  --db-subnet-group-name taskgh-db-subnet-group

# Wait for restore
aws rds wait db-instance-available \
  --db-instance-identifier $TEST_INSTANCE \
  --region eu-west-1

# Run smoke tests
psql -h $(aws rds describe-db-instances \
  --db-instance-identifier $TEST_INSTANCE \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text) \
  -U taskgh_admin -d taskgh_prod -c "SELECT COUNT(*) FROM users;"

# Cleanup
aws rds delete-db-instance \
  --db-instance-identifier $TEST_INSTANCE \
  --skip-final-snapshot \
  --region eu-west-1

echo "Backup restore test completed successfully"
```

---

## Database Troubleshooting

### Connection Pool Exhaustion

```sql
-- Symptom: "too many connections" error

-- Check current connections
SELECT datname, count(*) FROM pg_stat_activity
GROUP BY datname
ORDER BY count(*) DESC;

-- Kill idle connections (careful!)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND query_start < NOW() - INTERVAL '30 minutes';

-- Increase max_connections
ALTER SYSTEM SET max_connections = 400;
SELECT pg_reload_conf();
```

### Replication Lag (on read replica)

```sql
-- On read replica, check lag
SELECT EXTRACT(EPOCH FROM (NOW() - pg_last_xact_replay_timestamp())) AS replication_lag_seconds;

-- If > 60 seconds, query writes are happening faster than replica can process
-- Solution: Don't use replica for real-time queries, use primary
```

### Out of Disk Space

```bash
# Check RDS disk usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name FreeStorageSpace \
  --dimensions Name=DBInstanceIdentifier,Value=taskgh-db \
  --start-time $(date -u -d "1 hour ago" +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average

# If < 10% free:
# 1. Clean up old audit logs:
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '6 months';

# 2. Or increase allocated storage:
aws rds modify-db-instance \
  --db-instance-identifier taskgh-db \
  --allocated-storage 100 \
  --apply-immediately
```

---

## On-Call Procedures

### On-Call Handoff

**Before end of shift**:
```
Tuesday 09:00 UTC: On-Call A → On-Call B

Checklist:
- [ ] Review incidents from last 24 hours
- [ ] Check open alerts in Grafana
- [ ] Review any degraded services
- [ ] Update on-call notes in Slack topic
- [ ] Verify PagerDuty schedule is correct
- [ ] Confirm new on-call has all access
```

### Escalation Policy

```
Level 1 (15 min response):
- Automated alerts from Grafana/CloudWatch
- PagerDuty page: On-call engineer

Level 2 (5 min response):
- P1 alerts (service down, security breach)
- PagerDuty escalates to: On-call + Lead Engineer

Level 3 (Emergency):
- Multiple critical services down
- Executive emergency contact: VP Engineering
```

### On-Call Tools & Access

**Required Credentials**:
- ✅ AWS Console access
- ✅ PagerDuty responder role
- ✅ Slack /incident command access
- ✅ Grafana dashboard access
- ✅ VPN (for bastion host)
- ✅ SSH keys (for database access)

**Useful Commands**:
```bash
# Quick status check
./scripts/health-check.sh

# View recent logs
aws logs tail /ecs/taskgh --follow

# Check service status
./scripts/service-status.sh

# Trigger manual redeploy (if needed)
./scripts/redeploy.sh staging
```

---

**Generated**: April 2026 | **Status**: Production Ready | **Version**: 1.0.0

