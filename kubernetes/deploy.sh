
#!/bin/bash
# GenomeX - Deploy to Minikube

set -e

echo "🚀 GenomeX Kubernetes Deployment"
echo "================================="

# 1. Start Minikube if not running
if ! minikube status | grep -q "Running"; then
  echo "▶ Starting Minikube..."
  minikube start --driver=docker --cpus=2 --memory=3072
fi

# 2. Enable required addons
echo "▶ Enabling addons..."
minikube addons enable ingress
minikube addons enable metrics-server

# 3. Build images directly in Minikube's Docker (so K8s can find them)
echo "▶ Switching to Minikube's Docker..."
eval $(minikube docker-env)

echo "▶ Building backend image..."
docker build -t genomex-backend:v1 ./backend

echo "▶ Building frontend image..."
docker build -t genomex-frontend:v1 ./frontend

# 4. Apply all manifests
echo "▶ Applying K8s manifests..."
kubectl apply -f kubernetes/

# 5. Wait for pods to be ready
echo "▶ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n genomex --timeout=120s
kubectl rollout status deployment/genomex-backend -n genomex --timeout=120s
kubectl rollout status deployment/genomex-frontend -n genomex --timeout=120s

# 6. Initialize DB
echo "▶ Initializing database..."
BACKEND_POD=$(kubectl get pod -n genomex -l app=genomex-backend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n genomex $BACKEND_POD -- npx prisma db push
kubectl exec -n genomex $BACKEND_POD -- npm run seed

# 7. Show status
echo ""
echo "✅ Deployment complete!"
echo ""
kubectl get all -n genomex
echo ""
echo "🌐 Access frontend:"
echo "   minikube service frontend-service -n genomex"
echo ""
echo "📊 Or use ingress (add to /etc/hosts: '$(minikube ip) genomex.local'):"
echo "   http://genomex.local"
