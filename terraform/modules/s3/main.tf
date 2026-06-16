# S3 buckets for GenomeX platform
# Genomic data + simulation results + audit logs

# Genomic data bucket (versioned, encrypted)
resource "aws_s3_bucket" "genomic_data" {
  bucket = "${var.project_name}-${var.environment}-genomic-data"

  tags = {
    Name        = "${var.project_name}-genomic-data"
    DataType    = "PHI"
    Compliance  = "HIPAA"
  }
}

resource "aws_s3_bucket_versioning" "genomic_data" {
  bucket = aws_s3_bucket.genomic_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "genomic_data" {
  bucket = aws_s3_bucket.genomic_data.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "genomic_data" {
  bucket = aws_s3_bucket.genomic_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "genomic_data" {
  bucket = aws_s3_bucket.genomic_data.id

  rule {
    id     = "archive-old-data"
    status = "Enabled"

    filter {}

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

# Simulation results bucket
resource "aws_s3_bucket" "simulation_results" {
  bucket = "${var.project_name}-${var.environment}-simulation-results"

  tags = {
    Name     = "${var.project_name}-simulation-results"
    DataType = "Application"
  }
}

resource "aws_s3_bucket_versioning" "simulation_results" {
  bucket = aws_s3_bucket.simulation_results.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "simulation_results" {
  bucket = aws_s3_bucket.simulation_results.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "simulation_results" {
  bucket = aws_s3_bucket.simulation_results.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Audit logs bucket (compliance)
resource "aws_s3_bucket" "audit_logs" {
  bucket = "${var.project_name}-${var.environment}-audit-logs"

  tags = {
    Name       = "${var.project_name}-audit-logs"
    Compliance = "FDA-HIPAA"
  }
}

resource "aws_s3_bucket_versioning" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Audit logs - 7 year retention for compliance
resource "aws_s3_bucket_lifecycle_configuration" "audit_logs" {
  bucket = aws_s3_bucket.audit_logs.id

  rule {
    id     = "compliance-retention"
    status = "Enabled"

    filter {}

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 2555  # 7 years
    }
  }
}
