# Kubernetes Hands-On Quickstart

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Docker Desktop installed and running
- [ ] minikube installed (see our minikube guide)
- [ ] kubectl installed
- [ ] Basic terminal/command line knowledge

## Step 1: Start Your First Kubernetes Cluster

### Start minikube
```bash
# Start your local Kubernetes cluster
minikube start

# Verify cluster is running
kubectl cluster-info
kubectl get nodes
```

**What happened?**
- minikube created a virtual machine
- Installed Kubernetes on it
- Configured kubectl to talk to your cluster

### Explore Your Cluster
```bash
# See cluster components
kubectl get pods -A

# Check cluster status
kubectl get componentstatuses
```

## Step 2: Deploy Your First Application

### Create a Simple Web Application
```bash
# Create a deployment with nginx
kubectl create deployment hello-k8s --image=nginx:1.21

# Check if it's running
kubectl get deployments
kubectl get pods
```

**What happened?**
- Kubernetes created a Deployment object
- Deployment created a Pod running nginx
- Pod was scheduled to a node and started

### Inspect Your Application
```bash
# Get detailed information about your deployment
kubectl describe deployment hello-k8s

# Look at the pod details
kubectl describe pod <pod-name>

# Check the logs
kubectl logs <pod-name>
```

## Step 3: Expose Your Application

### Create a Service
```bash
# Expose the deployment as a service
kubectl expose deployment hello-k8s --type=NodePort --port=80

# Check the service
kubectl get services
kubectl describe service hello-k8s
```

**What happened?**
- Kubernetes created a Service object
- Service provides a stable way to access your pods
- NodePort type makes it accessible from outside the cluster

### Access Your Application
```bash
# Get the URL to access your app
minikube service hello-k8s --url

# Or open it directly in browser
minikube service hello-k8s
```

**Success!** You should see the nginx welcome page.

## Step 4: Scale Your Application

### Scale Up
```bash
# Scale to 3 replicas
kubectl scale deployment hello-k8s --replicas=3

# Watch the pods being created
kubectl get pods --watch
# Press Ctrl+C to stop watching

# Verify all pods are running
kubectl get pods
```

**What happened?**
- Kubernetes created 2 additional pods
- All pods are identical and serve the same content
- Service automatically load balances between all pods

### Test Load Balancing
```bash
# Get service URL
SERVICE_URL=$(minikube service hello-k8s --url)

# Make multiple requests (if you have curl)
for i in {1..10}; do curl $SERVICE_URL; echo; done
```

## Step 5: Update Your Application

### Rolling Update
```bash
# Update to a different nginx version
kubectl set image deployment/hello-k8s nginx=nginx:1.22

# Watch the rolling update happen
kubectl rollout status deployment/hello-k8s

# Check the update history
kubectl rollout history deployment/hello-k8s
```

**What happened?**
- Kubernetes gradually replaced old pods with new ones
- No downtime occurred during the update
- You can rollback if needed

### Rollback (if needed)
```bash
# Rollback to previous version
kubectl rollout undo deployment/hello-k8s

# Check rollback status
kubectl rollout status deployment/hello-k8s
```

## Step 6: Add Configuration

### Create a ConfigMap
```bash
# Create a simple configuration
kubectl create configmap app-config \
  --from-literal=MESSAGE="Hello from Kubernetes!" \
  --from-literal=ENVIRONMENT="development"

# View the ConfigMap
kubectl describe configmap app-config
```

### Use Configuration in a Pod
Save this as `config-pod.yaml`:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-demo
spec:
  containers:
  - name: demo
    image: nginx
    env:
    - name: MESSAGE
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: MESSAGE
    - name: ENVIRONMENT
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: ENVIRONMENT
```

```bash
# Apply the configuration
kubectl apply -f config-pod.yaml

# Check environment variables in the pod
kubectl exec config-demo -- env | grep -E "MESSAGE|ENVIRONMENT"
```

## Step 7: Health Checks and Monitoring

### Add Health Checks
Save this as `health-demo.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: health-demo
  template:
    metadata:
      labels:
        app: health-demo
    spec:
      containers:
      - name: web
        image: nginx:1.21
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

```bash
# Deploy with health checks
kubectl apply -f health-demo.yaml

# Watch the deployment
kubectl get pods -l app=health-demo --watch
```

## Step 8: Explore Logs and Debugging

### View Logs
```bash
# Get logs from all pods with a label
kubectl logs -l app=hello-k8s

# Follow logs in real-time
kubectl logs -f deployment/hello-k8s

# Get logs from previous container (if crashed)
kubectl logs <pod-name> --previous
```

### Debug a Pod
```bash
# Get shell access to a running pod
kubectl exec -it <pod-name> -- /bin/bash

# Run commands inside the pod
kubectl exec <pod-name> -- ls -la /usr/share/nginx/html

# Copy files from pod
kubectl cp <pod-name>:/usr/share/nginx/html/index.html ./index.html
```

## Step 9: Clean Up

### Delete Resources
```bash
# Delete individual resources
kubectl delete deployment hello-k8s
kubectl delete service hello-k8s
kubectl delete pod config-demo
kubectl delete configmap app-config

# Or delete everything you created
kubectl delete deployment health-demo
kubectl delete -f health-demo.yaml

# Stop minikube
minikube stop
```

## Common Commands Summary

```bash
# Cluster management
minikube start                  # Start cluster
minikube stop                   # Stop cluster
minikube status                 # Check status
minikube dashboard              # Open web UI

# Basic operations
kubectl get <resource>          # List resources
kubectl describe <resource>     # Detailed info
kubectl logs <pod-name>         # View logs
kubectl exec -it <pod> -- bash  # Shell access

# Application management
kubectl create deployment       # Create app
kubectl expose deployment       # Create service
kubectl scale deployment       # Scale app
kubectl set image deployment   # Update app
kubectl rollout undo           # Rollback app

# File-based operations
kubectl apply -f <file.yaml>    # Create from file
kubectl delete -f <file.yaml>   # Delete from file
```

## What You've Learned

✅ **Cluster Management**: Started and explored a Kubernetes cluster  
✅ **Pod Deployment**: Created and managed application pods  
✅ **Service Networking**: Exposed applications to outside traffic  
✅ **Scaling**: Horizontally scaled applications  
✅ **Updates**: Performed rolling updates and rollbacks  
✅ **Configuration**: Used ConfigMaps for application configuration  
✅ **Health Checks**: Implemented liveness and readiness probes  
✅ **Debugging**: Accessed logs and troubleshot issues  

## Next Steps

1. **Learn YAML**: Understanding Kubernetes manifests deeply
2. **Explore Namespaces**: Organize resources and multi-tenancy
3. **Study Networking**: Services, Ingress, and network policies
4. **Practice Storage**: Persistent volumes and claims
5. **Security Basics**: RBAC, security contexts, and policies
6. **Production Concepts**: Monitoring, logging, and best practices

## Troubleshooting Guide

### Common Issues

**Pod stuck in Pending:**
```bash
kubectl describe pod <pod-name>
# Look for events showing resource or scheduling issues
```

**Pod crashing (CrashLoopBackOff):**
```bash
kubectl logs <pod-name> --previous
# Check logs from the crashed container
```

**Service not accessible:**
```bash
kubectl get endpoints <service-name>
# Verify endpoints are populated
```

**minikube not starting:**
```bash
minikube delete  # Delete and recreate
minikube start --driver=docker  # Specify driver
```

### Useful Debug Commands
```bash
# Check cluster events
kubectl get events --sort-by=.metadata.creationTimestamp

# Check resource usage
kubectl top nodes
kubectl top pods

# Network troubleshooting
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup kubernetes.default
```

You now have hands-on experience with the core Kubernetes concepts! This foundation will serve you well as you dive deeper into more advanced topics.