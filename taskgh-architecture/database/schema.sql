-- TaskGH: Production PostgreSQL Schema
-- Version: 1.0.0
-- Database: taskgh_prod
-- Charset: UTF8MB4
-- Collation: C
-- Purpose: Complete data model for two-sided marketplace

-- ============================================
-- EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgrouting";


-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role_enum AS ENUM (
  'customer',
  'tasker',
  'company_admin',
  'company_user',
  'platform_admin',
  'platform_support'
);

CREATE TYPE account_status_enum AS ENUM (
  'pending_verification',
  'active',
  'suspended',
  'deactivated',
  'banned'
);

CREATE TYPE verification_status_enum AS ENUM (
  'pending',
  'under_review',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE booking_status_enum AS ENUM (
  'pending',
  'searching',
  'assigned',
  'accepted',
  'en_route',
  'in_progress',
  'completed',
  'cancelled',
  'disputed',
  'refunded'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'disputed'
);

CREATE TYPE payment_method_enum AS ENUM (
  'card',
  'mobile_money',
  'bank_transfer',
  'wallet'
);

CREATE TYPE payout_status_enum AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
);

CREATE TYPE dispute_status_enum AS ENUM (
  'open',
  'in_investigation',
  'resolved_favoring_customer',
  'resolved_favoring_tasker',
  'cancelled'
);

CREATE TYPE review_rating_enum AS ENUM (
  1, 2, 3, 4, 5
);


-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255),
  role user_role_enum NOT NULL DEFAULT 'customer',
  account_status account_status_enum NOT NULL DEFAULT 'pending_verification',
  
  -- Authentication
  email_verified_at TIMESTAMP WITH TIME ZONE,
  phone_verified_at TIMESTAMP WITH TIME ZONE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  
  -- Device Security
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip INET,
  device_fingerprint VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
) PARTITION BY HASH (id);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(account_status);
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;


-- ============================================
-- CUSTOMER PROFILES
-- ============================================

CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  date_of_birth DATE,
  gender VARCHAR(20),
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'Africa/Accra',
  
  -- Notifications
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  CONSTRAINT age_check CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) >= 16)
);

CREATE INDEX idx_customers_name ON customers(full_name);


-- ============================================
-- TASKER PROFILES & VERIFICATION
-- ============================================

CREATE TABLE tasker_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  date_of_birth DATE,
  gender VARCHAR(20),
  
  -- Verification Status
  verification_status verification_status_enum DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- KYC
  id_type VARCHAR(50), -- 'ghanacard', 'passport', 'drivers_license'
  id_number VARCHAR(100),
  id_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Background Check
  background_check_status VARCHAR(50) DEFAULT 'pending',
  background_check_date TIMESTAMP WITH TIME ZONE,
  
  -- Performance Metrics
  total_bookings INT DEFAULT 0,
  completed_bookings INT DEFAULT 0,
  cancelled_bookings INT DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  response_rate NUMERIC(5, 2) DEFAULT 0.00, -- percentage
  completion_rate NUMERIC(5, 2) DEFAULT 0.00,
  
  -- Wallet & Payouts
  wallet_balance NUMERIC(12, 2) DEFAULT 0.00,
  wallet_currency VARCHAR(3) DEFAULT 'GHS',
  
  -- Bank Details (encrypted in application)
  bank_account_verified BOOLEAN DEFAULT FALSE,
  bank_account_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Availability
  is_active BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  
  -- Document URLs (PII encrypted)
  documents_encrypted JSONB,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasker_verification ON tasker_profiles(verification_status);
CREATE INDEX idx_tasker_active ON tasker_profiles(is_active);
CREATE INDEX idx_tasker_rating ON tasker_profiles(average_rating DESC);


-- ============================================
-- SKILLS & SERVICE CATEGORIES
-- ============================================

CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(500),
  base_price NUMERIC(10, 2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON service_categories(slug);


CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  proficiency_levels JSONB DEFAULT '["beginner", "intermediate", "expert"]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(category_id, slug)
);

CREATE INDEX idx_skills_category ON skills(category_id);


CREATE TABLE tasker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tasker_id UUID NOT NULL REFERENCES tasker_profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level VARCHAR(50) DEFAULT 'intermediate',
  years_experience INT,
  certifications TEXT,
  
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  UNIQUE(tasker_id, skill_id)
);

CREATE INDEX idx_tasker_skills_tasker ON tasker_skills(tasker_id);
CREATE INDEX idx_tasker_skills_skill ON tasker_skills(skill_id);


-- ============================================
-- ADDRESSES & LOCATIONS
-- ============================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Ghana',
  
  -- Geospatial Data (PostGIS)
  location GEOGRAPHY(POINT, 4326),
  
  label VARCHAR(50), -- 'home', 'work', 'other'
  is_default BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_location ON addresses USING GIST(location);


-- ============================================
-- BOOKINGS & ORDERS
-- ============================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., "BK-2024-001234"
  
  -- Participants
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tasker_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_guest_booking BOOLEAN DEFAULT FALSE,
  guest_name VARCHAR(255),
  guest_phone VARCHAR(20),
  guest_email VARCHAR(255),
  
  -- Service Details
  category_id UUID NOT NULL REFERENCES service_categories(id),
  service_title VARCHAR(255) NOT NULL,
  service_description TEXT NOT NULL,
  images_urls JSONB DEFAULT '[]'::jsonb,
  
  -- Booking Specifics
  scheduled_date DATE,
  scheduled_time_start TIME,
  scheduled_time_end TIME,
  duration_hours INT,
  
  -- Address
  service_address_id UUID REFERENCES addresses(id),
  service_address_override TEXT,
  
  -- Status & Timeline
  status booking_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  assigned_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_reason VARCHAR(255),
  cancelled_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Pricing
  base_price NUMERIC(10, 2) NOT NULL,
  surge_multiplier NUMERIC(4, 2) DEFAULT 1.00,
  discount_amount NUMERIC(10, 2) DEFAULT 0.00,
  tax_amount NUMERIC(10, 2) DEFAULT 0.00,
  booking_protection_fee NUMERIC(10, 2) DEFAULT 10.00,
  secure_service_charge NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL,
  
  -- Payment
  payment_id UUID REFERENCES payments(id),
  payment_method payment_method_enum,
  
  -- Notes
  customer_notes TEXT,
  tasker_notes TEXT,
  
  -- Audit
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
  
) PARTITION BY RANGE (created_at);

-- Partitions for bookings (monthly)
CREATE TABLE bookings_2024_Q1 PARTITION OF bookings
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE bookings_2024_Q2 PARTITION OF bookings
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

CREATE INDEX idx_bookings_customer ON bookings(customer_id) WHERE status != 'cancelled';
CREATE INDEX idx_bookings_tasker ON bookings(tasker_id) WHERE status != 'cancelled';
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);


CREATE TABLE booking_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  from_status booking_status_enum,
  to_status booking_status_enum NOT NULL,
  changed_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  reason VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_status_logs_booking ON booking_status_logs(booking_id);


-- ============================================
-- PAYMENTS & TRANSACTIONS
-- ============================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHS',
  status payment_status_enum NOT NULL DEFAULT 'pending',
  
  payment_method payment_method_enum NOT NULL,
  payment_gateway VARCHAR(50), -- 'hubtel', 'stripe', etc.
  gateway_transaction_id VARCHAR(255),
  
  -- Payment Details (PII Encrypted)
  payment_details_encrypted JSONB,
  
  -- Fraud Flags
  fraud_score NUMERIC(5, 2) DEFAULT 0.00,
  is_flagged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(gateway_transaction_id);


CREATE TABLE payment_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  
  dispute_reason VARCHAR(255) NOT NULL,
  dispute_amount NUMERIC(12, 2) NOT NULL,
  dispute_status dispute_status_enum NOT NULL DEFAULT 'open',
  
  created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  resolved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_disputes_payment ON payment_disputes(payment_id);
CREATE INDEX idx_disputes_status ON payment_disputes(dispute_status);


-- ============================================
-- PAYOUTS (TASKER EARNINGS)
-- ============================================

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tasker_id UUID NOT NULL REFERENCES tasker_profiles(id) ON DELETE CASCADE,
  
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHS',
  status payout_status_enum NOT NULL DEFAULT 'pending',
  
  -- Payout Method
  payout_method VARCHAR(50), -- 'bank_transfer', 'mobile_money', 'wallet'
  payout_reference VARCHAR(255),
  
  -- Period (e.g., weekly, monthly settlements)
  payout_period_start DATE NOT NULL,
  payout_period_end DATE NOT NULL,
  
  -- Bookings included
  booking_ids UUID[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_payouts_tasker ON payouts(tasker_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_period ON payouts(payout_period_start, payout_period_end);


-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Reviewer
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_type VARCHAR(50), -- 'customer' or 'tasker'
  
  -- Reviewee
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  rating review_rating_enum NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  images_urls JSONB DEFAULT '[]'::jsonb,
  
  -- Flags
  is_verified_booking BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  helpful_count INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id, created_at DESC);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_public ON reviews(is_public) WHERE is_public = TRUE;


-- ============================================
-- CORPORATE ACCOUNTS
-- ============================================

CREATE TABLE corporate_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  company_name VARCHAR(255) NOT NULL,
  company_registration_number VARCHAR(100),
  industry VARCHAR(100),
  website_url VARCHAR(500),
  company_size VARCHAR(50),
  
  billing_email VARCHAR(255) NOT NULL,
  billing_address_id UUID REFERENCES addresses(id),
  
  status account_status_enum NOT NULL DEFAULT 'pending_verification',
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Features
  monthly_invoice_limit NUMERIC(12, 2) DEFAULT 10000.00,
  credit_limit NUMERIC(12, 2) DEFAULT 0.00,
  sla_enabled BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_corporate_admin ON corporate_accounts(admin_user_id);
CREATE INDEX idx_corporate_status ON corporate_accounts(status);


CREATE TABLE corporate_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id UUID NOT NULL REFERENCES corporate_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  role VARCHAR(50), -- 'admin', 'manager', 'user'
  permissions JSONB DEFAULT '[]'::jsonb,
  
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(corporate_account_id, user_id)
);


CREATE TABLE corporate_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id UUID NOT NULL REFERENCES corporate_accounts(id) ON DELETE CASCADE,
  
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  
  subtotal NUMERIC(12, 2) NOT NULL,
  tax_amount NUMERIC(12, 2) DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL,
  
  status VARCHAR(50), -- 'draft', 'issued', 'paid', 'overdue', 'cancelled'
  
  -- Items (array of booking IDs)
  booking_ids UUID[] NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_corporate ON corporate_invoices(corporate_account_id);
CREATE INDEX idx_invoices_status ON corporate_invoices(status);


-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(100), -- 'booking_accepted', 'payment_received', etc.
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  
  channels JSONB DEFAULT '["in_app"]'::jsonb, -- 'in_app', 'email', 'sms', 'push'
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;


-- ============================================
-- PROMOTIONS & DISCOUNTS
-- ============================================

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  
  description TEXT,
  discount_type VARCHAR(20), -- 'percentage', 'fixed_amount'
  discount_value NUMERIC(10, 2) NOT NULL,
  max_discount_amount NUMERIC(10, 2),
  
  min_booking_amount NUMERIC(10, 2),
  max_uses INT,
  max_uses_per_user INT,
  
  applicable_categories UUID[],
  applicable_user_types VARCHAR(50)[],
  
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_active ON promotions(is_active) WHERE is_active = TRUE;


CREATE TABLE promotion_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotion_usage_user ON promotion_usage(user_id);


-- ============================================
-- FRAUD & RISK
-- ============================================

CREATE TABLE fraud_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  
  signal_type VARCHAR(100), -- 'multiple_failed_payments', 'unusual_velocity', 'high_chargeback_rate'
  severity VARCHAR(50), -- 'low', 'medium', 'high', 'critical'
  score NUMERIC(5, 2),
  
  metadata JSONB,
  
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_taken VARCHAR(100), -- 'flagged', 'suspended', 'cleared'
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fraud_signals_user ON fraud_signals(user_id);
CREATE INDEX idx_fraud_signals_severity ON fraud_signals(severity);


-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'verify', 'suspend'
  resource_type VARCHAR(100) NOT NULL, -- 'booking', 'user', 'payment'
  resource_id UUID NOT NULL,
  
  changes JSONB, -- { before: {...}, after: {...} }
  
  ip_address INET,
  user_agent VARCHAR(500),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_2024 PARTITION OF audit_logs
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);


-- ============================================
-- SESSIONS & TOKENS
-- ============================================

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  token_hash VARCHAR(255) NOT NULL,
  refresh_token_hash VARCHAR(255),
  
  device_id VARCHAR(255),
  device_name VARCHAR(255),
  platform VARCHAR(50), -- 'web', 'ios', 'android'
  
  ip_address INET,
  user_agent VARCHAR(500),
  
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at) WHERE expires_at > NOW();


-- ============================================
-- ANALYTICS & EVENTS
-- ============================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  event_type VARCHAR(100) NOT NULL,
  event_properties JSONB,
  
  session_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE analytics_events_2024_Q1 PARTITION OF analytics_events
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_event ON analytics_events(event_type);


-- ============================================
-- INDEXES FOR COMMON QUERIES
-- ============================================

-- Booking search by location
CREATE INDEX idx_bookings_location ON bookings USING GIST(
  (SELECT location FROM addresses WHERE id = bookings.service_address_id)
);

-- Taskers near location
CREATE INDEX idx_taskers_location ON addresses USING GIST(location) 
  WHERE user_id IN (SELECT id FROM tasker_profiles WHERE is_active = TRUE);

-- Payment timeline
CREATE INDEX idx_payments_created_status ON payments(created_at DESC, status);

-- Tasker ratings
CREATE INDEX idx_reviews_rating ON reviews(reviewee_id, rating DESC);


-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trigger_update_users BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_customers BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_tasker_profiles BEFORE UPDATE ON tasker_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_bookings BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- Audit log trigger
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, changes)
  VALUES (CURRENT_USER_ID(), TG_ARGV[0], TG_TABLE_NAME, NEW.id, 
    jsonb_build_object('before', row_to_json(OLD), 'after', row_to_json(NEW)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

CREATE OR REPLACE VIEW v_active_taskers_with_ratings AS
SELECT 
  tp.id,
  u.email,
  tp.full_name,
  tp.average_rating,
  tp.review_count,
  tp.completion_rate,
  tp.is_available,
  STRING_AGG(s.name, ', ') as skills
FROM tasker_profiles tp
JOIN users u ON tp.id = u.id
LEFT JOIN tasker_skills ts ON tp.id = ts.tasker_id
LEFT JOIN skills s ON ts.skill_id = s.id
WHERE tp.is_active = TRUE AND tp.verification_status = 'approved'
GROUP BY tp.id, u.email, tp.full_name;


CREATE OR REPLACE VIEW v_booking_metrics AS
SELECT 
  DATE_TRUNC('day', b.created_at) as booking_date,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
  COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings,
  SUM(b.total_amount) as total_revenue,
  AVG(b.total_amount) as avg_booking_amount
FROM bookings b
GROUP BY DATE_TRUNC('day', b.created_at);


-- ============================================
-- GRANTS & PERMISSIONS (RBAC)
-- ============================================

-- Application service account (restricted)
CREATE USER taskgh_app WITH PASSWORD 'generate-strong-password';
GRANT CONNECT ON DATABASE taskgh_prod TO taskgh_app;
GRANT USAGE ON SCHEMA public TO taskgh_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO taskgh_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO taskgh_app;

-- Read-only analytics user
CREATE USER taskgh_analytics WITH PASSWORD 'generate-strong-password';
GRANT CONNECT ON DATABASE taskgh_prod TO taskgh_analytics;
GRANT USAGE ON SCHEMA public TO taskgh_analytics;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO taskgh_analytics;

-- Migration user (one-time, then disable)
CREATE USER taskgh_migration WITH PASSWORD 'generate-strong-password';
GRANT ALL PRIVILEGES ON DATABASE taskgh_prod TO taskgh_migration;


-- ============================================
-- FINAL CHECKS
-- ============================================

-- Verify all tables exist
SELECT COUNT(*) as total_tables FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Show schema size
SELECT 
  schemaname,
  pg_size_pretty(SUM(pg_total_relation_size(schemaname||'.'||tablename))) as size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
GROUP BY schemaname;

