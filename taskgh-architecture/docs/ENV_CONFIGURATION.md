# TaskGH: Environment Configuration Template

This file documents all environment variables required for TaskGH deployment across dev, staging, and production environments.

---

## Environment Variables

### .env.development (Local Development)

```bash
# Application
NODE_ENV=development
PORT=3000
APP_NAME=TaskGH
APP_VERSION=1.0.0
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://taskgh_dev:password@postgres:5432/taskgh_dev
DATABASE_SSL=false
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis Cache
REDIS_URL=redis://:password@redis:6379/0
REDIS_TTL=3600

# JWT Authentication
JWT_SECRET_KEY=your_dev_jwt_secret_key_min_32_chars
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d

# Payment Gateway (Hubtel)
HUBTEL_MERCHANT_ID=YOUR_DEV_MERCHANT_ID
HUBTEL_API_KEY=your_dev_hubtel_api_key
HUBTEL_API_URL=https://api-sandbox.hubtel.com  # Use sandbox for dev

# SMS Gateway (FlashSMS)
FLASHSMS_API_KEY=your_dev_flashsms_api_key
FLASHSMS_SENDER_ID=TASKGH

# Email Service (SendGrid)
SENDGRID_API_KEY=your_dev_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@taskgh.dev

# AWS Services
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=dev_access_key
AWS_SECRET_ACCESS_KEY=dev_secret_key
AWS_S3_BUCKET=taskgh-media-dev
AWS_S3_REGION=eu-west-1

# Elasticsearch
ELASTICSEARCH_URL=http://elasticsearch:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_ADMIN_PASSWORD=admin

# OAuth (Google, Facebook)
GOOGLE_CLIENT_ID=your_dev_google_client_id
GOOGLE_CLIENT_SECRET=your_dev_google_secret
FACEBOOK_APP_ID=your_dev_facebook_id
FACEBOOK_APP_SECRET=your_dev_facebook_secret

# Frontend URLs
FRONTEND_URL=http://localhost:3001
ADMIN_URL=http://localhost:3002

# Feature Flags
FEATURE_CORPORATE_ACCOUNTS=false
FEATURE_ADVANCED_SEARCH=true
FEATURE_SUBSCRIPTION_TIERS=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000  # 1 minute
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGINS=http://localhost:3001,http://localhost:3002
CSRF_PROTECTION_ENABLED=true

# Timezone
TZ=Africa/Accra
```

### .env.staging (Staging Environment)

```bash
# Application
NODE_ENV=staging
PORT=3000
APP_NAME=TaskGH
APP_VERSION=1.0.0
LOG_LEVEL=info

# Database (RDS)
DATABASE_URL=postgresql://taskgh_app:${DB_PASSWORD}@taskgh-db.XXXXX.eu-west-1.rds.amazonaws.com:5432/taskgh_staging
DATABASE_SSL=require
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Redis Cache (ElastiCache)
REDIS_URL=redis://:${REDIS_AUTH_TOKEN}@taskgh-cache-staging.XXXXX.ng.0001.euw1.cache.amazonaws.com:6379/0
REDIS_TTL=3600

# JWT Authentication (from AWS Secrets Manager)
JWT_SECRET_KEY=${/taskgh/staging/jwt_secret_key}
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d

# Payment Gateway (Hubtel - using sandbox)
HUBTEL_MERCHANT_ID=${HUBTEL_STAGING_MERCHANT_ID}
HUBTEL_API_KEY=${HUBTEL_STAGING_API_KEY}
HUBTEL_API_URL=https://api-sandbox.hubtel.com

# SMS Gateway (FlashSMS - staging credentials)
FLASHSMS_API_KEY=${FLASHSMS_STAGING_API_KEY}
FLASHSMS_SENDER_ID=TASKGH-STAGING

# Email Service (SendGrid)
SENDGRID_API_KEY=${SENDGRID_STAGING_KEY}
SENDGRID_FROM_EMAIL=noreply@staging.taskgh.com

# AWS Services
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=${AWS_STAGING_ACCESS_KEY}
AWS_SECRET_ACCESS_KEY=${AWS_STAGING_SECRET_KEY}
AWS_S3_BUCKET=taskgh-media-staging
AWS_S3_REGION=eu-west-1

# Elasticsearch
ELASTICSEARCH_URL=https://taskgh-es-staging.XXXXX.eu-west-1.es.amazonaws.com
ELASTICSEARCH_USERNAME=${ES_USERNAME}
ELASTICSEARCH_PASSWORD=${ES_PASSWORD}

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}

# OAuth
GOOGLE_CLIENT_ID=${GOOGLE_STAGING_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_STAGING_CLIENT_SECRET}
FACEBOOK_APP_ID=${FACEBOOK_STAGING_APP_ID}
FACEBOOK_APP_SECRET=${FACEBOOK_STAGING_APP_SECRET}

# URLs
FRONTEND_URL=https://staging-app.taskgh.com
ADMIN_URL=https://staging-admin.taskgh.com
API_URL=https://staging-api.taskgh.com

# Feature Flags
FEATURE_CORPORATE_ACCOUNTS=false
FEATURE_ADVANCED_SEARCH=true
FEATURE_SUBSCRIPTION_TIERS=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGINS=https://staging-app.taskgh.com,https://staging-admin.taskgh.com
CSRF_PROTECTION_ENABLED=true

# Sentry (Error tracking)
SENTRY_DSN=${SENTRY_STAGING_DSN}
SENTRY_ENVIRONMENT=staging

# Timezone
TZ=Africa/Accra

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### .env.production (Production Environment)

```bash
# Application
NODE_ENV=production
PORT=3000
APP_NAME=TaskGH
APP_VERSION=1.0.0
LOG_LEVEL=warn

# Database (RDS Multi-AZ)
DATABASE_URL=postgresql://taskgh_app:${DB_PASSWORD}@taskgh-db.XXXXX.eu-west-1.rds.amazonaws.com:5432/taskgh_prod
DATABASE_SSL=require
DATABASE_POOL_MIN=10
DATABASE_POOL_MAX=50

# Redis Cache (ElastiCache Multi-AZ)
REDIS_URL=redis://:${REDIS_AUTH_TOKEN}@taskgh-cache-prod.XXXXX.ng.0001.euw1.cache.amazonaws.com:6379/0
REDIS_TTL=7200

# JWT Authentication (from AWS Secrets Manager)
JWT_SECRET_KEY=${/taskgh/prod/jwt_secret_key}
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d

# Payment Gateway (Hubtel - LIVE)
HUBTEL_MERCHANT_ID=${HUBTEL_PROD_MERCHANT_ID}
HUBTEL_API_KEY=${HUBTEL_PROD_API_KEY}
HUBTEL_API_URL=https://api.hubtel.com  # Production endpoint

# SMS Gateway (FlashSMS - LIVE)
FLASHSMS_API_KEY=${FLASHSMS_PROD_API_KEY}
FLASHSMS_SENDER_ID=TASKGH

# Email Service (SendGrid - LIVE)
SENDGRID_API_KEY=${SENDGRID_PROD_KEY}
SENDGRID_FROM_EMAIL=noreply@taskgh.com

# AWS Services (Production account)
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=${AWS_PROD_ACCESS_KEY}
AWS_SECRET_ACCESS_KEY=${AWS_PROD_SECRET_KEY}
AWS_S3_BUCKET=taskgh-media-prod
AWS_S3_REGION=eu-west-1
AWS_CLOUDFRONT_DOMAIN=dXXXXXX.cloudfront.net

# Elasticsearch
ELASTICSEARCH_URL=https://taskgh-es-prod.XXXXX.eu-west-1.es.amazonaws.com
ELASTICSEARCH_USERNAME=${ES_USERNAME}
ELASTICSEARCH_PASSWORD=${ES_PASSWORD}

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}

# OAuth
GOOGLE_CLIENT_ID=${GOOGLE_PROD_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_PROD_CLIENT_SECRET}
FACEBOOK_APP_ID=${FACEBOOK_PROD_APP_ID}
FACEBOOK_APP_SECRET=${FACEBOOK_PROD_APP_SECRET}

# URLs (Production)
FRONTEND_URL=https://app.taskgh.com
ADMIN_URL=https://admin.taskgh.com
API_URL=https://api.taskgh.com

# Feature Flags
FEATURE_CORPORATE_ACCOUNTS=true
FEATURE_ADVANCED_SEARCH=true
FEATURE_SUBSCRIPTION_TIERS=true

# Rate Limiting (stricter for production)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Security (production hardening)
CORS_ORIGINS=https://app.taskgh.com,https://admin.taskgh.com
CSRF_PROTECTION_ENABLED=true
HSTS_MAX_AGE=31536000
HTTP_TRACE_DISABLED=true
SSL_MIN_VERSION=TLSv1.3

# Sentry (Error tracking)
SENTRY_DSN=${SENTRY_PROD_DSN}
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=0.1  # 10% sample rate in production

# PagerDuty (Incident management)
PAGERDUTY_INTEGRATION_KEY=${PAGERDUTY_PROD_KEY}

# Timezone
TZ=Africa/Accra

# Logging
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_RETENTION_DAYS=30

# Database Backups
BACKUP_SCHEDULE=daily
BACKUP_RETENTION_DAYS=30

# Cache Warmer
CACHE_WARMER_ENABLED=true
CACHE_WARMER_SCHEDULE=0 2 * * *  # 2 AM UTC daily
```

---

## Secrets Management (AWS Secrets Manager)

Store the following sensitive values in AWS Secrets Manager (not in .env files):

```bash
# Development
/taskgh/dev/db_password
/taskgh/dev/redis_auth_token
/taskgh/dev/jwt_secret_key
/taskgh/dev/hubtel_api_key
/taskgh/dev/sendgrid_api_key
/taskgh/dev/flashsms_api_key

# Staging
/taskgh/staging/db_password
/taskgh/staging/redis_auth_token
/taskgh/staging/jwt_secret_key
/taskgh/staging/hubtel_api_key
/taskgh/staging/sendgrid_api_key
/taskgh/staging/flashsms_api_key
/taskgh/staging/sentry_dsn

# Production
/taskgh/prod/db_password
/taskgh/prod/redis_auth_token
/taskgh/prod/jwt_secret_key
/taskgh/prod/hubtel_api_key
/taskgh/prod/sendgrid_api_key
/taskgh/prod/flashsms_api_key
/taskgh/prod/sentry_dsn
/taskgh/prod/pagerduty_integration_key

# Retrieve at runtime:
# aws secretsmanager get-secret-value --secret-id /taskgh/prod/db_password --region eu-west-1
```

---

## Environment Setup Instructions

### For Local Development

```bash
# 1. Copy template
cp .env.example .env.development.local

# 2. Edit .env file with local values
vim .env.development.local

# 3. Verify database connectivity
npm run db:migrate:dev

# 4. Seed test data
npm run db:seed:dev

# 5. Start development environment
docker-compose up -d
npm run dev
```

### For Staging Deployment

```bash
# 1. AWS Secrets Manager populated? ✓
aws secretsmanager list-secrets --region eu-west-1

# 2. Environment variables in GitHub Secrets
# Settings → Secrets and variables → Actions

# 3. Deploy via CI/CD
git push staging

# 4. Verify deployment
curl https://staging-api.taskgh.com/health
```

### For Production Deployment

```bash
# 1. Create tag (triggers production deployment)
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. CI/CD pipeline runs automatically
# Wait for deployments to complete in GitHub Actions

# 3. Monitor deployment
aws ecs describe-services \
  --cluster taskgh-cluster \
  --services taskgh-service \
  --region eu-west-1

# 4. Health check
curl https://api.taskgh.com/health
```

---

## Environment Variable Validation

Run this test before deployment to catch missing/invalid variables:

```bash
#!/bin/bash
# validate-env.sh

echo "Validating environment variables..."

REQUIRED_VARS=(
  "NODE_ENV"
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET_KEY"
  "HUBTEL_MERCHANT_ID"
  "HUBTEL_API_KEY"
  "SENDGRID_API_KEY"
  "AWS_REGION"
  "AWS_S3_BUCKET"
)

MISSING=0
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing: $var"
    MISSING=$((MISSING + 1))
  else
    echo "✅ Found: $var"
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "❌ $MISSING environment variables missing!"
  exit 1
else
  echo ""
  echo "✅ All environment variables present!"
  exit 0
fi
```

---

## Environment Variable Documentation

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| NODE_ENV | string | production | development/staging/production |
| DATABASE_URL | string | postgresql://... | PostgreSQL connection string |
| REDIS_URL | string | redis://:pass... | Redis connection string |
| JWT_SECRET_KEY | string | 32+ chars | Min 32 characters for security |
| HUBTEL_MERCHANT_ID | string | GHXXXXXXXX | Ghana merchant ID |
| HUBTEL_API_KEY | string | LIVE/SANDBOX key | Rotate every 6 months |
| SENDGRID_API_KEY | string | SG.XXXX | Create per environment |
| FLASHSMS_API_KEY | string | fs_xxxx_xxxx | FlashSMS API key (Ghana SMS provider) |
| FLASHSMS_SENDER_ID | string | TASKGH | Branded sender name (max 11 chars) |
| AWS_REGION | string | eu-west-1 | Ireland region (closest to Ghana) |
| AWS_S3_BUCKET | string | taskgh-media-prod | Environment-specific bucket |
| FRONTEND_URL | string | https://app.taskgh.com | HTTPS required for production |

---

## SMS Provider: FlashSMS

**Why FlashSMS?**
- Ghana-focused SMS provider (lowest latency)
- Competitive pricing for bulk SMS
- Better local support and compliance
- High delivery rates in West Africa

**Getting FlashSMS Credentials:**
1. Sign up at https://portal.flashsms.io/
2. Verify business details
3. Create API key in account settings
4. Set sender ID (e.g., "TASKGH")
5. Add API key to `FLASHSMS_API_KEY` environment variable

**FlashSMS API Reference:**
- **Endpoint**: https://api.flashsms.io/v1/messages/send
- **Auth**: API key in header `Authorization: Token {API_KEY}`
- **Cost**: ~0.05 GHS per SMS (approximately 0.002 USD)
- **Delivery Rate**: >99% within Ghana
- **Documentation**: https://docs.flashsms.io/

---

**Generated**: April 2026 | **Status**: Ready for Deployment | **Version**: 1.0.0

