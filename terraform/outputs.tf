output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "ec2_public_ip" {
  description = "Public IP address of the EC2 application server"
  value       = module.ec2.public_ip
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = module.rds.db_port
}

output "s3_genomic_data_bucket" {
  description = "S3 bucket for genomic data"
  value       = module.s3.genomic_data_bucket
}

output "s3_simulation_results_bucket" {
  description = "S3 bucket for simulation results"
  value       = module.s3.simulation_results_bucket
}
