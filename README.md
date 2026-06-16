# 🧬 GenomeX — DevOps Final Sem Project

**Project**: Case Study 120 — Global Pharmaceutical AI Drug Discovery Platform
**Stack**: Node.js + React + PostgreSQL + Full DevOps lifecycle

---

## 📁 Project Structure

```
genomex-platform/
├── backend/              ← Node.js + Express + Prisma (port 5000)
├── frontend/             ← React + Vite + Tailwind (port 3000)
├── kubernetes/           ← K8s manifests (Deployment, Service, etc.)
├── terraform/            ← AWS infrastructure code
├── jenkins/              ← CI/CD pipeline
├── monitoring/           ← Prometheus + Grafana config
├── vault/                ← Secrets management
├── docs/                 ← Architecture diagrams, DR plan, report
└── docker-compose.yml    ← Local dev (all services)
```

---

## 🚀 Quick Start — Local Development

### Option A: With Docker Compose (recommended)

```bash
docker-compose up -d
```

Wait 30 sec for services to start. Then:

```bash
# Initialize DB schema + seed sample data
docker exec genomex-backend npx prisma db push
docker exec genomex-backend npm run seed
```

**Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Metrics: http://localhost:5000/metrics

### Option B: Local node (without Docker)

```bash
# 1. Start PostgreSQL via Docker
docker run --name genomex-pg \
  -e POSTGRES_USER=genomex \
  -e POSTGRES_PASSWORD=genomex123 \
  -e POSTGRES_DB=genomexdb \
  -p 5432:5432 -d postgres:15-alpine

# 2. Backend setup
cd backend
npm install
npm run prisma:push
npm run seed
npm run dev   # port 5000

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev   # port 3000
```

---

## 🔐 Demo Login Credentials

After seeding, use these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@genomex.io | Password@123 | ADMIN |
| scientist@genomex.io | Password@123 | SCIENTIST |
| researcher@genomex.io | Password@123 | RESEARCHER |

Or click the quick-login buttons on the login page.

---

## 🧪 Features

### Backend (Node.js + Express)
- ✅ JWT authentication with bcrypt
- ✅ Role-Based Access Control (RBAC): 4 roles
- ✅ Genome sequence CRUD
- ✅ Drug discovery simulation workflow (async)
- ✅ Compliance audit logs
- ✅ Prometheus metrics (/metrics endpoint)
- ✅ Structured JSON logging (Winston) — ELK ready
- ✅ Health check endpoints (/health, /ready)
- ✅ PostgreSQL via Prisma ORM

### Frontend (React + Vite + Tailwind)
- ✅ Login with quick-demo accounts
- ✅ Dashboard with platform stats
- ✅ Genome library (upload + browse)
- ✅ Simulation runner (auto-refresh status)
- ✅ Role-based UI (admin/scientist can upload)

---

## 🛠️ DevOps Stack Coverage

| Tool | Purpose | Status |
|---|---|---|
| **Docker** | Containerization | ✅ Multi-stage Dockerfiles |
| **Kubernetes** | Orchestration | ⏳ Manifests in `kubernetes/` |
| **Helm** | K8s package mgmt | ⏳ Charts coming |
| **Prometheus** | Metrics | ✅ App exposes `/metrics` |
| **Grafana** | Dashboards | ⏳ Coming |
| **ELK Stack** | Centralized logging | ✅ App logs JSON structured |
| **Vault** | Secrets | ⏳ Coming |
| **Terraform** | AWS IaC | ⏳ Code in `terraform/` |
| **Jenkins** | CI/CD | ⏳ Jenkinsfile coming |

---

## 📊 API Endpoints

```
GET  /                       - Service info
GET  /health                 - Liveness probe
GET  /ready                  - Readiness probe
GET  /metrics                - Prometheus metrics

POST /api/auth/register      - Create account
POST /api/auth/login         - Authenticate

GET  /api/genomes            - List genome sequences
POST /api/genomes            - Upload sequence (ADMIN, SCIENTIST)
GET  /api/genomes/:id        - Get sequence details
DELETE /api/genomes/:id      - Delete (ADMIN only)

GET  /api/simulations        - List simulations
POST /api/simulations        - Start drug discovery simulation
GET  /api/simulations/:id    - Get simulation details

GET  /api/audit-logs         - Compliance audit trail (ADMIN only)
```

---

## 🎯 Build Images

```bash
# Backend
cd backend
docker build -t genomex-backend:v1 .

# Frontend
cd frontend
docker build -t genomex-frontend:v1 .
```

---

## 📦 Next Steps

1. Test locally with `docker-compose up`
2. Deploy to Minikube (K8s manifests)
3. Install Prometheus + Grafana via Helm
4. Install ELK Stack via Helm
5. Setup Vault for secrets
6. Write Terraform code for AWS
7. Setup Jenkins CI/CD pipeline
8. Documentation + diagrams + final report

---

**Author**: Arpit Sawant
**License**: MIT
