output "genomic_data_bucket" {
  value = aws_s3_bucket.genomic_data.id
}

output "genomic_data_bucket_arn" {
  value = aws_s3_bucket.genomic_data.arn
}

output "simulation_results_bucket" {
  value = aws_s3_bucket.simulation_results.id
}

output "simulation_results_bucket_arn" {
  value = aws_s3_bucket.simulation_results.arn
}

output "audit_logs_bucket" {
  value = aws_s3_bucket.audit_logs.id
}

output "audit_logs_bucket_arn" {
  value = aws_s3_bucket.audit_logs.arn
}
