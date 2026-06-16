# GenomeX Bioinformatics Platform - AWS Infrastructure
# Production-grade IaC for drug discovery platform

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "GenomeX"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "DevOps Team"
      Compliance  = "FDA-HIPAA"
    }
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

locals {
  azs          = slice(data.aws_availability_zones.available.names, 0, 3)

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

# VPC + Subnets
module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
  azs          = local.azs
}

# EC2 Application Server
module "ec2" {
  source = "./modules/ec2"

  project_name  = var.project_name
  environment   = var.environment
  vpc_id        = module.vpc.vpc_id
  subnet_id     = module.vpc.public_subnet_ids[0]
  instance_type = var.ec2_instance_type
  key_name      = var.ec2_key_name
}

# RDS PostgreSQL for application data (placed in public subnet)
module "rds" {
  source = "./modules/rds"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = module.vpc.public_subnet_ids
  db_name               = var.db_name
  db_username           = var.db_username
  db_instance_class     = var.db_instance_class
  db_allocated_storage  = var.db_allocated_storage
  ec2_security_group_id = module.ec2.security_group_id
}

# S3 buckets for genomic data + simulation results
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}
