# TaskGH: Terraform Infrastructure as Code
# Purpose: Production deployment for MVP phase (single region, cost-optimized)
# Provider: AWS (use GCP/DigitalOcean variables for alternative clouds)
# Generated: April 2026

# ============================================
# BACKEND CONFIGURATION (S3 + DynamoDB)
# ============================================

terraform {
  required_version = ">= 1.5"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  # Store state in S3 with DynamoDB locking
  # First apply: comment out and use local state
  # Then: terraform init -migrate-state after creating S3 bucket
  
  # backend "s3" {
  #   bucket           = "taskgh-terraform-state"
  #   key              = "prod/terraform.tfstate"
  #   region           = "eu-west-1"
  #   encrypt          = true
  #   dynamodb_table   = "taskgh-terraform-locks"
  # }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "TaskGH"
      Environment = var.environment
      ManagedBy   = "Terraform"
      CreatedAt   = timestamp()
    }
  }
}

# ============================================
# VARIABLES
# ============================================

variable "aws_region" {
  description = "AWS region"
  default     = "eu-west-1" # Ireland (closest to Ghana)
  type        = string
}

variable "environment" {
  description = "Environment name"
  default     = "production"
  type        = string
  
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Must be development, staging, or production."
  }
}

variable "app_name" {
  description = "Application name"
  default     = "taskgh"
  type        = string
}

variable "container_image" {
  description = "Docker image URL"
  type        = string
}

variable "container_port" {
  description = "Container port"
  default     = 3000
  type        = number
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  default     = 2
  type        = number
}

variable "db_username" {
  description = "RDS master username"
  default     = "taskgh_admin"
  sensitive   = true
  type        = string
}

variable "db_password" {
  description = "RDS master password (generate and store in Secrets Manager)"
  sensitive   = true
  type        = string
}

variable "db_allocated_storage" {
  description = "Initial storage allocation (GB)"
  default     = 20
  type        = number
}

variable "enable_enhanced_monitoring" {
  description = "Enable RDS Enhanced Monitoring"
  default     = true
  type        = bool
}

# ============================================
# DATA SOURCES
# ============================================

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

# ============================================
# VPC & NETWORKING
# ============================================

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "${var.app_name}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${var.app_name}-public-subnet-${count.index + 1}"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "${var.app_name}-private-subnet-${count.index + 1}"
  }
}

# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"
  
  depends_on = [aws_internet_gateway.main]
  
  tags = {
    Name = "${var.app_name}-eip"
  }
}

# NAT Gateway (for private subnet egress)
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
  
  tags = {
    Name = "${var.app_name}-nat"
  }
  
  depends_on = [aws_internet_gateway.main]
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block      = "0.0.0.0/0"
    gateway_id      = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "${var.app_name}-rt-public"
  }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private Route Table
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }
  
  tags = {
    Name = "${var.app_name}-rt-private"
  }
}

resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# ============================================
# SECURITY GROUPS
# ============================================

# ALB Security Group
resource "aws_security_group" "alb" {
  name   = "${var.app_name}-alb-sg"
  vpc_id = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.app_name}-alb-sg"
  }
}

# ECS Tasks Security Group
resource "aws_security_group" "ecs_tasks" {
  name   = "${var.app_name}-ecs-sg"
  vpc_id = aws_vpc.main.id
  
  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.app_name}-ecs-sg"
  }
}

# RDS Security Group
resource "aws_security_group" "rds" {
  name   = "${var.app_name}-rds-sg"
  vpc_id = aws_vpc.main.id
  
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.app_name}-rds-sg"
  }
}

# Redis Security Group
resource "aws_security_group" "redis" {
  name   = "${var.app_name}-redis-sg"
  vpc_id = aws_vpc.main.id
  
  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${var.app_name}-redis-sg"
  }
}

# ============================================
# LOAD BALANCER
# ============================================

resource "aws_lb" "main" {
  name               = "${var.app_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = false
  enable_http2              = true
  enable_cross_zone_load_balancing = true
  
  tags = {
    Name = "${var.app_name}-alb"
  }
}

resource "aws_lb_target_group" "app" {
  name        = "${var.app_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  
  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200-299"
  }
  
  tags = {
    Name = "${var.app_name}-tg"
  }
}

resource "aws_lb_listener" "app" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# ============================================
# RDS DATABASE
# ============================================

resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id
  
  tags = {
    Name = "${var.app_name}-db-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.app_name}-db"
  engine         = "postgres"
  engine_version = "15.5"
  instance_class = var.environment == "production" ? "db.t3.small" : "db.t3.micro"
  
  allocated_storage = var.db_allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true
  
  db_name  = "taskgh_${var.environment}"
  username = var.db_username
  password = var.db_password
  
  db_subnet_group_name            = aws_db_subnet_group.main.name
  vpc_security_group_ids          = [aws_security_group.rds.id]
  publicly_accessible             = false
  parameter_group_name            = aws_db_parameter_group.main.name
  skip_final_snapshot             = var.environment != "production"
  final_snapshot_identifier       = var.environment == "production" ? "${var.app_name}-db-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null
  
  backup_retention_period = var.environment == "production" ? 30 : 7
  backup_window          = "02:00-03:00"
  maintenance_window     = "sun:03:00-sun:04:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  enable_iam_database_authentication = true
  
  monitoring_interval = var.enable_enhanced_monitoring ? 60 : 0
  monitoring_role_arn = var.enable_enhanced_monitoring ? aws_iam_role.rds_monitoring.arn : null
  
  multi_az = var.environment == "production" ? true : false
  
  tags = {
    Name = "${var.app_name}-db"
  }
}

resource "aws_db_parameter_group" "main" {
  name        = "${var.app_name}-db-pg"
  family      = "postgres15"
  description = "PostgreSQL parameter group for ${var.app_name}"
  
  parameter {
    name  = "log_statement"
    value = "all"
  }
  
  parameter {
    name  = "log_duration"
    value = "true"
  }
  
  tags = {
    Name = "${var.app_name}-db-pg"
  }
}

# RDS Enhanced Monitoring Role
resource "aws_iam_role" "rds_monitoring" {
  name = "${var.app_name}-rds-monitoring-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "monitoring.rds.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ============================================
# ELASTICACHE REDIS
# ============================================

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.app_name}-cache-subnet-group"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.app_name}-cache"
  engine               = "redis"
  node_type            = var.environment == "production" ? "cache.t3.small" : "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = aws_elasticache_parameter_group.main.name
  engine_version       = "7.0"
  port                 = 6379
  
  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [aws_security_group.redis.id]
  automatic_failover_enabled = false
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token_enabled         = true
  auth_token                 = random_password.redis_auth_token.result
  
  maintenance_window = "sun:02:00-sun:03:00"
  notification_topic_arn = null
  
  tags = {
    Name = "${var.app_name}-cache"
  }
}

resource "aws_elasticache_parameter_group" "main" {
  name   = "${var.app_name}-redis-pg"
  family = "redis7"
  
  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
  
  parameter {
    name  = "notify-keyspace-events"
    value = "Ex"
  }
}

resource "random_password" "redis_auth_token" {
  length  = 32
  special = true
}

# ============================================
# ECS CLUSTER & TASK DEFINITION
# ============================================

resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Name = "${var.app_name}-cluster"
  }
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name
  
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
  
  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
  
  default_capacity_provider_strategy {
    weight            = 50
    capacity_provider = "FARGATE_SPOT"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 30
  
  tags = {
    Name = "${var.app_name}-logs"
  }
}

# ECS Task Execution Role
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Allow pulling secrets from Secrets Manager
resource "aws_iam_role_policy" "ecs_task_execution_role_secrets" {
  name = "${var.app_name}-ecs-task-execution-secrets"
  role = aws_iam_role.ecs_task_execution_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue",
        "kms:Decrypt"
      ]
      Resource = "*"
    }]
  })
}

# ECS Task Role (permissions for app to access AWS services)
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.app_name}-ecs-task-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

# Allow S3 access for file uploads
resource "aws_iam_role_policy" "ecs_task_s3" {
  name = "${var.app_name}-ecs-task-s3"
  role = aws_iam_role.ecs_task_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ]
      Resource = "${aws_s3_bucket.media.arn}/*"
    }]
  })
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = var.app_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn
  
  container_definitions = jsonencode([{
    name      = var.app_name
    image     = var.container_image
    essential = true
    portMappings = [{
      containerPort = var.container_port
      hostPort      = var.container_port
      protocol      = "tcp"
    }]
    
    environment = [
      {
        name  = "NODE_ENV"
        value = var.environment
      },
      {
        name  = "PORT"
        value = tostring(var.container_port)
      },
      {
        name  = "DATABASE_URL"
        value = "postgresql://${var.db_username}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
      },
      {
        name  = "REDIS_URL"
        value = "rediss://:${random_password.redis_auth_token.result}@${aws_elasticache_cluster.main.cache_nodes[0].address}:6379"
      }
    ]
    
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
  
  tags = {
    Name = "${var.app_name}-task-def"
  }
}

# ============================================
# ECS SERVICE
# ============================================

resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = var.app_name
    container_port   = var.container_port
  }
  
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }
  
  enable_ecs_managed_tags = true
  propagate_tags          = "SERVICE"
  
  depends_on = [
    aws_lb_listener.app,
    aws_db_instance.main,
    aws_elasticache_cluster.main
  ]
  
  tags = {
    Name = "${var.app_name}-service"
  }
}

# ============================================
# AUTOSCALING
# ============================================

resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = var.environment == "production" ? 10 : 4
  min_capacity       = var.desired_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  name               = "${var.app_name}-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

resource "aws_appautoscaling_policy" "ecs_policy_memory" {
  name               = "${var.app_name}-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 80.0
  }
}

# ============================================
# S3 BUCKET (MEDIA STORAGE)
# ============================================

resource "aws_s3_bucket" "media" {
  bucket = "${var.app_name}-media-${data.aws_caller_identity.current.account_id}"
  
  tags = {
    Name = "${var.app_name}-media"
  }
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================
# CLOUDFRONT CDN
# ============================================

resource "aws_cloudfront_distribution" "media" {
  origin {
    domain_name = aws_s3_bucket.media.bucket_regional_domain_name
    origin_id   = "S3"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.media.cloudfront_access_identity_path
    }
  }
  
  enabled = true
  
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  tags = {
    Name = "${var.app_name}-cdn"
  }
}

resource "aws_cloudfront_origin_access_identity" "media" {
  comment = "${var.app_name} OAI"
}

resource "aws_s3_bucket_policy" "media" {
  bucket = aws_s3_bucket.media.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "CloudFrontAccess"
      Effect = "Allow"
      Principal = {
        AWS = aws_cloudfront_origin_access_identity.media.iam_arn
      }
      Action   = "s3:GetObject"
      Resource = "${aws_s3_bucket.media.arn}/*"
    }]
  })
}

# ============================================
# DATA SOURCE: CURRENT AWS ACCOUNT
# ============================================

data "aws_caller_identity" "current" {}

# ============================================
# OUTPUTS
# ============================================

output "alb_dns_name" {
  description = "Load balancer DNS name"
  value       = aws_lb.main.dns_name
}

output "db_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
  sensitive   = true
}

output "s3_bucket_name" {
  description = "S3 media bucket name"
  value       = aws_s3_bucket.media.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.media.domain_name
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.app.name
}
