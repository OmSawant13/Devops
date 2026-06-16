# Kubernetes Deployment Guide

## Manifests Structure

| File | Purpose |
|------|---------|
| `00-namespace.yaml` | Logical isolation (`genomex` namespace) |
| `01-configmap.yaml` | Non-sensitive config |
| `02-secret.yaml` | Sensitive data (later replaced by Vault) |
| `03-postgres.yaml` | StatefulSet + PVC for DB persistence |
| `04-backend.yaml` | Deployment + Service + HPA (3-20 replicas) |
| `05-frontend.yaml` | Deployment + Service + HPA (2-10 replicas) |
| `06-ingress.yaml` | Route external traffic |
| `07-network-policy.yaml` | Zero-trust networking |

## Quick Deploy

```bash
./kubernetes/deploy.sh
```

This automates everything: Minikube start, image build, manifest apply, DB init.

## Manual Steps

```bash
# 1. Start Minikube
minikube start --driver=docker --cpus=2 --memory=3072

# 2. Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# 3. Build images in Minikube's Docker
eval $(minikube docker-env)
docker build -t genomex-backend:v1 ./backend
docker build -t genomex-frontend:v1 ./frontend

# 4. Apply manifests
kubectl apply -f kubernetes/

# 5. Initialize DB
kubectl wait --for=condition=ready pod -l app=postgres -n genomex --timeout=120s
BACKEND_POD=$(kubectl get pod -n genomex -l app=genomex-backend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n genomex $BACKEND_POD -- npx prisma db push
kubectl exec -n genomex $BACKEND_POD -- npm run seed

# 6. Access
minikube service frontend-service -n genomex
```

## Useful Commands

```bash
# View all resources
kubectl get all -n genomex

# View pods
kubectl get pods -n genomex

# Pod logs
kubectl logs -n genomex <pod-name>

# Exec into pod
kubectl exec -it -n genomex <pod-name> -- sh

# HPA status (auto-scaling)
kubectl get hpa -n genomex

# Scale manually
kubectl scale deployment genomex-backend -n genomex --replicas=10

# Rolling update
kubectl set image deployment/genomex-backend backend=genomex-backend:v2 -n genomex

# Rollback
kubectl rollout undo deployment/genomex-backend -n genomex
```

## Chaos Testing (Reviewer scenarios)

```bash
# 1. Pod crash → K8s auto-restart
kubectl delete pod -n genomex <backend-pod>
kubectl get pods -n genomex -w   # watch new pod come up

# 2. Scale up under load
kubectl run -i --rm load-test --image=busybox -- /bin/sh -c \
  "while true; do wget -qO- http://backend-service.genomex:5000/api/genomes; done"

# 3. Storage corruption recovery
kubectl exec -n genomex postgres-0 -- psql -U genomex -c "DROP TABLE genomes;"
# Restore via Velero backup (Round 6)
```

## Cleanup

```bash
kubectl delete namespace genomex
minikube stop
```
