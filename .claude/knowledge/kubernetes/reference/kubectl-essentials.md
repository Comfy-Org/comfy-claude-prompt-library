# kubectl Essentials - Command Reference

## Basic kubectl Syntax

```bash
kubectl [command] [TYPE] [NAME] [flags]
```

- **command**: What you want to do (get, create, delete, etc.)
- **TYPE**: Resource type (pod, service, deployment, etc.)
- **NAME**: Resource name (optional for some commands)
- **flags**: Additional options

## Essential Commands

### 1. Getting Information

```bash
# Get basic cluster info
kubectl cluster-info
kubectl version

# List nodes in cluster
kubectl get nodes
kubectl get nodes -o wide  # More details

# List all resources
kubectl get all
kubectl get all -A  # All namespaces

# List specific resource types
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get configmaps
kubectl get secrets
```

### 2. Detailed Information

```bash
# Describe resources (very detailed)
kubectl describe node <node-name>
kubectl describe pod <pod-name>
kubectl describe service <service-name>

# Get YAML/JSON output
kubectl get pod <pod-name> -o yaml
kubectl get deployment <deployment-name> -o json

# Get specific fields
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase
kubectl get pods --selector app=myapp
```

### 3. Creating Resources

```bash
# Apply from file
kubectl apply -f <filename.yaml>
kubectl apply -f <directory/>
kubectl apply -f <url>

# Create from command line
kubectl create deployment myapp --image=nginx
kubectl create service nodeport myapp --tcp=80:80

# Generate YAML without creating
kubectl create deployment myapp --image=nginx --dry-run=client -o yaml
kubectl run mypod --image=nginx --dry-run=client -o yaml
```

### 4. Updating Resources

```bash
# Apply changes from file
kubectl apply -f updated-config.yaml

# Edit resource directly
kubectl edit deployment myapp
kubectl edit service myapp

# Scale deployments
kubectl scale deployment myapp --replicas=5

# Set image
kubectl set image deployment/myapp container-name=nginx:1.21
```

### 5. Deleting Resources

```bash
# Delete specific resources
kubectl delete pod <pod-name>
kubectl delete service <service-name>
kubectl delete deployment <deployment-name>

# Delete from file
kubectl delete -f <filename.yaml>

# Delete all of a type
kubectl delete pods --all
kubectl delete deployments --all

# Force delete (use with caution)
kubectl delete pod <pod-name> --force --grace-period=0
```

## Working with Pods

### Pod Lifecycle Commands

```bash
# Create a quick test pod
kubectl run test-pod --image=nginx --restart=Never

# Run interactive pod
kubectl run -it --rm debug --image=busybox --restart=Never -- sh

# Get pod logs
kubectl logs <pod-name>
kubectl logs <pod-name> -f  # Follow logs
kubectl logs <pod-name> --previous  # Previous container instance
kubectl logs <pod-name> -c <container-name>  # Multi-container pod

# Execute commands in pod
kubectl exec <pod-name> -- ls -la
kubectl exec -it <pod-name> -- /bin/bash
kubectl exec -it <pod-name> -c <container-name> -- sh  # Multi-container

# Copy files to/from pod
kubectl cp <pod-name>:/path/to/file /local/path
kubectl cp /local/file <pod-name>:/path/to/destination
```

### Pod Debugging

```bash
# Check pod status and events
kubectl describe pod <pod-name>

# Check pod resource usage
kubectl top pod <pod-name>
kubectl top pods --sort-by=cpu
kubectl top pods --sort-by=memory

# Port forwarding for testing
kubectl port-forward pod/<pod-name> 8080:80
kubectl port-forward service/<service-name> 8080:80
```

## Working with Deployments

### Deployment Management

```bash
# Create deployment
kubectl create deployment myapp --image=nginx

# Scale deployment
kubectl scale deployment myapp --replicas=3

# Update deployment image
kubectl set image deployment/myapp nginx=nginx:1.21

# Check rollout status
kubectl rollout status deployment/myapp

# View rollout history
kubectl rollout history deployment/myapp

# Rollback deployment
kubectl rollout undo deployment/myapp
kubectl rollout undo deployment/myapp --to-revision=2

# Restart deployment (useful for picking up ConfigMap changes)
kubectl rollout restart deployment/myapp
```

## Working with Services

### Service Operations

```bash
# Expose deployment as service
kubectl expose deployment myapp --port=80 --target-port=80 --type=NodePort

# Get service endpoints
kubectl get endpoints
kubectl get endpoints <service-name>

# Test service connectivity
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -qO- <service-name>:<port>
```

## ConfigMaps and Secrets

### ConfigMap Operations

```bash
# Create ConfigMap from literal values
kubectl create configmap app-config --from-literal=key1=value1 --from-literal=key2=value2

# Create ConfigMap from file
kubectl create configmap app-config --from-file=config.properties

# Create ConfigMap from directory
kubectl create configmap app-config --from-file=config-dir/

# View ConfigMap data
kubectl get configmap app-config -o yaml
kubectl describe configmap app-config
```

### Secret Operations

```bash
# Create generic secret
kubectl create secret generic app-secret --from-literal=username=admin --from-literal=password=secret

# Create secret from file
kubectl create secret generic app-secret --from-file=credentials.txt

# Create TLS secret
kubectl create secret tls tls-secret --cert=tls.crt --key=tls.key

# View secret (base64 encoded)
kubectl get secret app-secret -o yaml

# Decode secret
kubectl get secret app-secret -o jsonpath='{.data.username}' | base64 --decode
```

## Namespace Operations

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace development

# Set default namespace for current context
kubectl config set-context --current --namespace=development

# Work with specific namespace
kubectl get pods -n development
kubectl apply -f app.yaml -n development

# Delete namespace (deletes all resources in it)
kubectl delete namespace development
```

## Troubleshooting Commands

### Cluster Diagnostics

```bash
# Check cluster component status
kubectl get componentstatuses

# Check cluster events
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl get events --field-selector type=Warning

# Check node conditions
kubectl describe nodes

# Check resource usage
kubectl top nodes
kubectl top pods --all-namespaces
```

### Network Troubleshooting

```bash
# Test pod-to-pod connectivity
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <service-name>

# Check service discovery
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup kubernetes.default

# Check DNS resolution
kubectl run test-pod --image=busybox --rm -it --restart=Never -- nslookup <pod-ip>
```

## Useful Flags and Options

### Output Formats

```bash
-o wide           # Additional columns
-o yaml           # YAML format
-o json           # JSON format
-o name           # Resource name only
-o jsonpath='{}'  # Custom output using JSONPath
--show-labels     # Show labels
--sort-by=        # Sort by field
```

### Selection and Filtering

```bash
--selector app=myapp          # Label selector
--field-selector status.phase=Running  # Field selector
--all-namespaces             # All namespaces
-n namespace-name           # Specific namespace
--watch                     # Watch for changes
--dry-run=client           # Simulate without creating
```

### Common Shortcuts

```bash
# Resource type shortcuts
po = pods
svc = services
deploy = deployments
cm = configmaps
ns = namespaces
no = nodes

# Examples
kubectl get po
kubectl get svc
kubectl describe deploy myapp
```

## Quick Reference Cheat Sheet

```bash
# Most common daily commands
kubectl get pods
kubectl describe pod <name>
kubectl logs <pod-name> -f
kubectl exec -it <pod-name> -- bash
kubectl port-forward <pod-name> 8080:80
kubectl apply -f <file.yaml>
kubectl delete pod <name>
kubectl get services
kubectl get deployments
kubectl scale deployment <name> --replicas=3
```

## Pro Tips

1. **Use aliases**: `alias k=kubectl` to save typing
2. **Tab completion**: Enable kubectl autocompletion in your shell
3. **Context switching**: Use kubectx/kubens tools for easy context/namespace switching
4. **Resource watching**: Use `--watch` flag to monitor resource changes
5. **Dry runs**: Always test with `--dry-run=client` before applying changes
6. **Resource quotas**: Check `kubectl describe quota` to understand limits
7. **Events debugging**: `kubectl get events --sort-by=.metadata.creationTimestamp` is invaluable for troubleshooting

## Next Steps

1. **Practice basic commands** with a local cluster (minikube)
2. **Learn YAML syntax** for creating resource manifests
3. **Understand labels and selectors** for resource organization
4. **Explore advanced topics** like custom resources and operators
5. **Set up your development environment** with useful tools and aliases