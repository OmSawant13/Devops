# GenomeX Terraform Infrastructure

Production-grade AWS infrastructure for the GenomeX pharmaceutical drug discovery platform.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  AWS (ap-south-1)               │
│                                                 │
│  ┌──────────────── VPC (10.0.0.0/16) ────────┐ │
│  │                                            │ │
│  │  Public Subnets (3 AZs)                    │ │
│  │  ├── NAT Gateway                           │ │
│  │  └── ALB / Ingress                         │ │
│  │                                            │ │
│  │  Private Subnets (3 AZs)                   │ │
│  │  ├── EKS Cluster (1.30)                    │ │
│  │  │   └── Node Group: t3.medium × 3-10      │ │
│  │  └── RDS PostgreSQL (Multi-AZ)             │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  S3 Buckets:                                    │
│  ├── genomex-prod-genomic-data (encrypted)      │
│  ├── genomex-prod-simulation-results            │
│  └── genomex-prod-audit-logs (7yr retention)    │
│                                                 │
│  Secrets Manager: DB credentials                │
└─────────────────────────────────────────────────┘
```

## Modules

| Module | Purpose |
|--------|---------|
| `vpc/` | Multi-AZ VPC with public/private subnets and NAT Gateway |
| `eks/` | EKS cluster with managed node group + OIDC provider |
| `rds/` | PostgreSQL with Multi-AZ, encryption, and Secrets Manager |
| `s3/` | Versioned, encrypted S3 buckets with lifecycle policies |

## Prerequisites

- Terraform >= 1.5.0
- AWS CLI configured (`aws configure`)
- IAM user with `AdministratorAccess` (or equivalent)

## Usage

```bash
# 1. Initialize
terraform init

# 2. Validate syntax
terraform validate

# 3. Preview changes
terraform plan

# 4. Apply (creates real AWS resources - costs money)
terraform apply

# 5. Configure kubectl
aws eks update-kubeconfig --region ap-south-1 --name genomex-production

# 6. Tear down (delete everything)
terraform destroy
```

## Cost Estimate

| Resource | Monthly Cost (USD) |
|----------|--------------------|
| EKS control plane | $73 |
| EC2 nodes (3× t3.medium) | $90 |
| RDS (db.t3.small Multi-AZ) | $50 |
| NAT Gateway | $32 |
| ALB | $16 |
| S3 + Data Transfer | $10 |
| **Total** | **~$271/month** |

⚠️ Always run `terraform destroy` when not in use to avoid charges.

## Security Features

- ✅ All S3 buckets encrypted (AES-256)
- ✅ RDS encryption at rest
- ✅ Secrets stored in AWS Secrets Manager
- ✅ Private subnets for EKS nodes and RDS
- ✅ Security groups with least-privilege access
- ✅ VPC flow logs (production)
- ✅ EKS control plane audit logging
- ✅ S3 public access blocked
- ✅ IRSA (IAM Roles for Service Accounts) via OIDC

## Compliance

- FDA 21 CFR Part 11 ready (audit logs, encryption)
- HIPAA-eligible (PHI handling)
- 7-year audit log retention

## Disaster Recovery

- Primary region: `ap-south-1` (Mumbai)
- DR region: `ap-southeast-1` (Singapore)
- RTO: 30 minutes
- RPO: 5 minutes (RDS automated backups + S3 cross-region replication)

## Variables

See `terraform.tfvars.example` for all configurable variables.
