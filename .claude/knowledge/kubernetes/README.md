# Kubernetes Knowledge Base

## What is Kubernetes?

Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. Originally developed by Google and now maintained by the Cloud Native Computing Foundation (CNCF).

## Learning Path

### Phase 1: Fundamentals (Start Here)
- What are containers and why orchestration?
- Kubernetes vs Docker
- Basic architecture overview
- Key benefits and use cases

### Phase 2: Core Concepts
- Pods, Services, Deployments
- Namespaces and Labels
- ConfigMaps and Secrets
- Basic networking concepts

### Phase 3: Hands-On Basics
- Installing Kubernetes locally (minikube, kind)
- Your first deployment
- Exposing applications
- Basic troubleshooting

### Phase 4: Advanced Topics
- StatefulSets and persistent storage
- Ingress controllers
- Security and RBAC
- Monitoring and logging
- CI/CD integration

## Folder Structure

```
kubernetes/
├── 00-fundamentals/          # Basic concepts, terminology
├── 01-architecture/          # K8s architecture deep dive
├── 02-core-concepts/         # Pods, services, deployments
├── 03-workloads/            # Different workload types
├── 04-networking/           # Networking concepts and services
├── 05-storage/              # Persistent volumes, storage classes
├── 06-configuration/        # ConfigMaps, Secrets, management
├── 07-security/             # RBAC, security policies
├── 08-operations/           # Monitoring, logging, debugging
├── 09-advanced-topics/      # Service mesh, operators, etc.
├── 10-tools-ecosystem/      # Helm, kubectl, lens, etc.
├── examples/                # Example YAML files and configs
└── diagrams/                # Architecture and concept diagrams
```

## Resources for Learning

### Official Documentation
- **Kubernetes Official Docs**: https://kubernetes.io/docs/
- **Kubernetes Basics Tutorial**: https://kubernetes.io/docs/tutorials/kubernetes-basics/
- **Concepts Guide**: https://kubernetes.io/docs/concepts/

### Interactive Learning
- **Katacoda Kubernetes**: https://www.katacoda.com/courses/kubernetes
- **Play with Kubernetes**: https://labs.play-with-k8s.com/

### Video Courses
- **Kubernetes Course - Full Beginners Tutorial**: YouTube (TechWorld with Nana)
- **Kubernetes Tutorial for Beginners**: YouTube (FreeCodeCamp)

### Books & Guides
- **Kubernetes Up & Running** (O'Reilly)
- **The Kubernetes Book** (Nigel Poulton)
- **Kubernetes Patterns** (O'Reilly)

### Cheat Sheets
- **Kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **YAML Templates**: Common K8s YAML examples

## Getting Started Instructions

1. **Download the basics**:
   - Go to https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/
   - Save the page content as HTML or PDF
   - Download the "Kubernetes Basics" tutorial

2. **Architecture diagrams**:
   - Find and save the official K8s architecture diagram
   - Component interaction diagrams

3. **Practical examples**:
   - Download example YAML files from the docs
   - Get simple deployment examples

4. **Tools documentation**:
   - kubectl command reference
   - minikube getting started guide

Save downloaded content in appropriate subfolders and let me know the file locations - I'll help organize and summarize the content into digestible learning materials.