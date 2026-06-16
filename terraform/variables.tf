variable "aws_region" {
  description = "AWS region for primary deployment"
  type        = string
  default     = "ap-south-1"
}

variable "dr_region" {
  description = "AWS region for disaster recovery"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "genomex"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "ec2_instance_type" {
  description = "EC2 instance type for GenomeX application"
  type        = string
  default     = "t3.micro"
}

variable "ec2_key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "civic-key"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "genomex"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "genomex_admin"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}
