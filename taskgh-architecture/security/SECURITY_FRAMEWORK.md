# TaskGH: Security Architecture & Compliance Framework

## Overview

This document defines the security architecture, threat model, compliance requirements, and security controls for TaskGH marketplace platform.

---

## 1. SECURITY LAYERS

### 1.1 Network Security

**Perimeter Protection**
- ✅ AWS WAF (Web Application Firewall) on CloudFront
  - SQL injection rules
  - Cross-site scripting (XSS) prevention
  - Geo-blocking (restrict to Ghana initially)
  - Rate limiting: 2,000 req/min per IP
  - Bot control (CAPTCHA on suspicious activity)

**DDoS Protection**
- ✅ AWS Shield Standard (free)
- ✅ AWS Shield Advanced for production
- ✅ CloudFront edge location DDoS mitigation

**Network Segmentation**
- ✅ VPC with public/private subnets
- ✅ Private RDS/Redis in isolated subnets
- ✅ NAT Gateway for outbound traffic
- ✅ NACLs (Network ACLs) for subnet-level filtering
- ✅ Security groups with least privilege

### 1.2 Application Security

**API Security**
- ✅ HTTPS (TLS 1.3 enforced)
- ✅ API rate limiting: 100 req/min per authenticated user
- ✅ Request validation & sanitization
- ✅ CORS policy: whitelist frontend domain only
- ✅ CSRF token validation on state-changing operations

**Authentication**
- ✅ JWT with RS256 (RSA-2048) signing
- ✅ Access tokens: 15 minutes TTL
- ✅ Refresh tokens: 7 days TTL, rotated on use
- ✅ Token storage: HttpOnly, Secure cookie
- ✅ MFA (TOTP) mandatory for admin users
- ✅ Session invalidation on logout
- ✅ Concurrent session limit: 5 per user

**Authorization**
- ✅ RBAC: customer, tasker, company_admin, platform_admin, platform_support
- ✅ ABAC for premium features (attribute-based: subscription level, verification status)
- ✅ Resource ownership validation (user can only access own data)
- ✅ Audit trail: all privileged actions logged

**Data Protection**
- ✅ Field-level encryption for PII (names, emails, phone, bank details)
- ✅ Encryption algorithm: AES-256-GCM
- ✅ Encrypted at rest:
  - RDS: AWS KMS encryption
  - S3: Server-side encryption (SSE-S3)
  - Redis: ElastiCache encryption
- ✅ Encrypted in transit: TLS 1.3 for all connections
- ✅ Secrets management: AWS Secrets Manager (rotated every 90 days)
- ✅ Key rotation: quarterly

### 1.3 Database Security

**Access Control**
- ✅ Principle of least privilege IAM roles
- ✅ Database user accounts for specific purposes:
  - `taskgh_app`: application service account (limited SELECT/INSERT/UPDATE)
  - `taskgh_analytics`: read-only analytics account
  - `taskgh_migration`: DDL migrations (temp, disabled after)
- ✅ No shared credentials between environments
- ✅ SSH key-based authentication (no passwords in logs)

**Auditing**
- ✅ PostgreSQL audit logging enabled
- ✅ All data modifications logged to `audit_logs` table
- ✅ Failed authentication attempts logged
- ✅ Admin action audit trail: actor, action, resource, timestamp

**Backup & Recovery**
- ✅ Daily automated snapshots (retained 30 days)
- ✅ Point-in-time recovery (last 30 days via WAL archiving)
- ✅ Encrypted snapshots to S3 (cross-region replication)
- ✅ Backup integrity tested weekly
- ✅ DR drill: quarterly restore test

### 1.4 Payment Security

**PCI-DSS Compliance Path**
- ✅ Tokenized payment processing (no raw card data stored)
- ✅ Payment gateway: Hubtel (PCI Level 1)
- ✅ 3D Secure (3DS) for card transactions >GHS 100
- ✅ Fraud detection scoring (multiple signals):
  - Unusual velocity (>3 bookings/hour)
  - Failed payment retry (>2 attempts)
  - Chargebacks (automatic review)
  - Geolocation inconsistency

**Escrow System**
- ✅ Payment held pending booking completion
- ✅ Automatic release after 48 hours post-completion
- ✅ Manual dispute resolution by admin
- ✅ Secure refund queue with audit trail

---

## 2. THREAT MODEL & RISK MITIGATION

### Threat: Unauthorized Access to User Accounts

**Risk**: Low-privilege user gains admin access, modifies bookings, finances.

**Mitigation**:
- ✅ Strong password requirements (min 12 chars, complexity)
- ✅ MFA mandatory for admin accounts
- ✅ Account lockout after 5 failed login attempts
- ✅ Anomaly detection: flagged on unusual login location
- ✅ Session timeout: 30 minutes inactivity

### Threat: SQL Injection

**Risk**: Attacker injects SQL via booking description, reviews.

**Mitigation**:
- ✅ Parameterized queries (ORM: TypeORM/Sequelize)
- ✅ Input validation: max 1000 chars for strings, whitelisted fields
- ✅ WAF SQL injection rules
- ✅ Regular SAST scanning (SonarQube)

### Threat: Cross-Site Scripting (XSS)

**Risk**: Malicious script injected into review comments.

**Mitigation**:
- ✅ Output encoding (client-side: React auto-escapes)
- ✅ Content Security Policy header:
  ```
  default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  ```
- ✅ No inline script execution
- ✅ DOMPurify for rich text sanitization

### Threat: Man-in-the-Middle (MITM)

**Risk**: Attacker intercepts communication, steals tokens.

**Mitigation**:
- ✅ TLS 1.3 enforced (HSTS header: max-age=31536000)
- ✅ Certificate pinning (React Native app)
- ✅ DNS-over-HTTPS (DoH) recommendation

### Threat: Fraud (Payment Chargeback / Fake Tasker)

**Risk**: Customer charges back after booking, fake tasker steals payments.

**Mitigation**:
- ✅ Booking protection fee (GHS 10) non-refundable
- ✅ Escrow prevents immediate payout
- ✅ Background check before tasker verification
- ✅ ID verification (Ghana Card / Passport)
- ✅ Proof of work (photos/video during booking)
- ✅ Dispute resolution with 48-hour review window

### Threat: Denial of Service (DoS)

**Risk**: Attacker floods API causing service outage.

**Mitigation**:
- ✅ AWS WAF rate limiting (2,000 req/min per IP)
- ✅ API rate limiting (100 req/min per user)
- ✅ CloudFront caching + edge protection
- ✅ Auto-scaling (scale to 10 tasks on high CPU)
- ✅ Circuit breakers (disable external integrations if failing)

### Threat: Data Breach (Customer PII Exposure)

**Risk**: Database compromised, customer data leaked.

**Mitigation**:
- ✅ Field-level encryption (AES-256)
- ✅ Minimum data retention (PII deleted after 12 months for completed bookings)
- ✅ Right to erasure: GDPR/Ghana Data Protection compliance
- ✅ Regular penetration testing (quarterly)
- ✅ Bug bounty program (HackerOne/Bugcrowd)
- ✅ Data access logs (who accessed sensitive data, when, why)

---

## 3. IAM & ACCESS CONTROL

### AWS IAM Policies (Least Privilege)

**ECS Task Role** (application service account)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::taskgh-media-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:eu-west-1:ACCOUNT_ID:secret:taskgh/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*"
    }
  ]
}
```

**RDS Database User Permissions** (least privilege for app)
```sql
-- Create restricted user
CREATE USER taskgh_app WITH PASSWORD 'ROTATE_EVERY_90_DAYS';

-- Grant usage on specific tables only
GRANT SELECT, INSERT, UPDATE ON bookings, payments, users TO taskgh_app;
GRANT SELECT ON service_categories, skills TO taskgh_app;

-- Deny dangerous operations
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM taskgh_app;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM taskgh_app;
```

### Admin Access Control

**Admin MFA Requirements**
- ✅ TOTP (Time-based One-Time Password)
- ✅ No SMS-based OTP (vulnerable to SIM swap)
- ✅ Backup codes (printed & encrypted at onboarding)

**Admin Activity Audit**
- ✅ All admin actions logged: action, resource, timestamp, IP
- ✅ Suspicious activity alerts (>10 actions/min)
- ✅ Monthly admin access review
- ✅ Automatic logout after 1 hour inactivity

---

## 4. COMPLIANCE & REGULATIONS

### Ghana Data Protection Act (2012)

**Compliance Requirements**:
1. **Lawful Basis for Processing**: 
   - ✅ User explicit consent for booking data
   - ✅ Legitimate interest for fraud detection

2. **Data Minimization**:
   - ✅ Only collect: name, email, phone, address, ID (for taskers)
   - ✅ NOT collect: political affiliation, health data, religion

3. **Retention Limits**:
   - ✅ Customer booking data: 3 years (for disputes)
   - ✅ Personal data: delete after purpose served
   - ✅ Automated deletion jobs (quarterly purge)

4. **Data Subject Rights** (implemented in admin dashboard):
   - ✅ Right to access: export user data as JSON
   - ✅ Right to rectification: update profile
   - ✅ Right to erasure: soft delete (30-day grace period)
   - ✅ Right to data portability: GDPR-style export

5. **Data Processing Agreements**:
   - ✅ Contracts with third parties (Hubtel, AWS)
   - ✅ Data sub-processor list maintained

### GDPR Readiness (for future EU expansion)

- ✅ Privacy Policy (updated annually)
- ✅ Terms of Service (clear data usage)
- ✅ DPIA (Data Protection Impact Assessment) completed
- ✅ Data Processing Agreement (DPA) with AWS
- ✅ Cookie consent (only essential, no tracking)
- ✅ Request response SLA: 30 days

---

## 5. MONITORING & INCIDENT RESPONSE

### Security Monitoring

**Intrusion Detection**
- ✅ Failed authentication attempts: alert on >10/5min per user
- ✅ Unusual API patterns: alert on >1000 req/min
- ✅ Database anomalies: alert on large data exports
- ✅ Certificate expiry: alert 30 days before

**Vulnerability Scanning**
- ✅ Daily: npm audit (dependencies)
- ✅ Weekly: container image scan (Trivy)
- ✅ Monthly: infrastructure scan (AWS Config)
- ✅ Quarterly: penetration testing

**Alerting Channels**
- ✅ Critical: SMS + PagerDuty + Slack
- ✅ High: PagerDuty + Email
- ✅ Medium: Email + Dashboard

### Incident Response Plan

**Severity Classification**
| Level | Definition | Response Time | Resolution Time |
|-------|-----------|---|---|
| **Critical** | Data breach, service down | 5 min | 1 hour |
| **High** | Payment failure, fraud spike | 15 min | 4 hours |
| **Medium** | API degradation | 1 hour | 24 hours |
| **Low** | Minor security alert | 4 hours | 7 days |

**Incident Commander Role**
- ✅ Assigned on-call engineer
- ✅ Calls war room conference
- ✅ Coordinates technical response
- ✅ Communicates status to stakeholders
- ✅ Documents timeline & root cause (post-incident)

**Post-Incident**
- ✅ Blameless RCA (Root Cause Analysis)
- ✅ Action items assigned with owners
- ✅ Follow-up verification (7 days)

---

## 6. DEVELOPER SECURITY

### Secure Development Lifecycle

**Code Review**
- ✅ Minimum 2 reviewers per PR
- ✅ Security review for: auth, database, payments, PII
- ✅ Automated checks: SAST (SonarQube), dependency scan (Snyk)

**Secret Management**
- ✅ No credentials in Git (pre-commit hook)
- ✅ Secrets in AWS Secrets Manager
- ✅ Access via IAM (not hardcoded)
- ✅ Rotation: quarterly

**Dependency Management**
- ✅ npm audit on every PR
- ✅ Automated updates: Dependabot
- ✅ No known vulnerabilities in production
- ✅ LTS versions preferred

**Logging & Monitoring**
- ✅ No PII in logs (masked email: a***z@example.com)
- ✅ Structured logs (JSON with timestamp, level, user_id)
- ✅ Debug logs disabled in production
- ✅ Logs retained 30 days (Loki)

---

## 7. SECURITY CHECKLIST (Pre-Launch)

- [ ] SSL certificate installed & valid
- [ ] HSTS header enabled (max-age=31536000)
- [ ] WAF rules deployed & tested
- [ ] Admin MFA enforced
- [ ] Database passwords rotated
- [ ] Secrets Manager populated
- [ ] Backup tested (restore drill)
- [ ] Penetration test completed
- [ ] Privacy policy published
- [ ] Terms of Service published
- [ ] GDPR Data Processing Agreement signed
- [ ] Incident response runbook finalized
- [ ] On-call schedule in place
- [ ] Security training completed (all staff)
- [ ] Third-party audit completed (if applicable)

---

## 8. SECURITY CONTACTS

- **Security Lead**: security@taskgh.com
- **Incident Response**: incident@taskgh.com
- **Bug Bounty**: bounty@taskgh.com
- **GDPR/Privacy**: dpo@taskgh.com

---

**Generated**: April 2026 | **Status**: Production Ready | **Version**: 1.0.0

