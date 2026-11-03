# Week 13 — Final Project

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

Bring together everything from the program into one capstone project. Describe what you built, how it's architected, and what you learned across the full 14 weeks.

---

# Task 1 — Project Overview

## Goal

Describe your final project in 2-3 sentences. What does it do? What problem does it solve?

Totoro is a full-stack, AI-powered knowledge extraction application built with Next.js and FastAPI that automatically converts study notes, Markdown files, and PDFs into interactive 3D concept relationship graphs. The system solves complex document analysis challenges by extracting entities dynamically and persisting them into an Amazon RDS PostgreSQL database. The entire platform is deployed on an enterprise AWS EKS cluster utilizing a zero-trust, declarative GitOps deployment workflow.

### Evidence

**Project Name:**Totoro

**GitHub Repo:** `https://github.com/JokerHin/Totoro`

**Live URL:** `http://k8s-default-totoroin-a541c4124e-1576574714.us-east-1.elb.amazonaws.com/`

---

# Task 2 — Architecture

## Goal

Describe or embed a diagram of your project architecture.

### Evidence

#### Screenshot 1 — Architecture diagram

[Architecture diagram](screenshots/task-1-diagram.png)

---

# Task 3 — Tech Stack

## Goal

List the technologies used in each layer of your project.

### Evidence

| Layer       | Technology Used                                                                             |
| ----------- | ------------------------------------------------------------------------------------------- |
| Cloud       | AWS (EKS, RDS PostgreSQL, ECR, Secrets Manager, ALB, VPC, Security Group, EIP, NAT Gateway) |
| IaC         | Terraform                                                                                   |
| CI/CD       | Azure DevOps Pipelines & ArgoCD (GitOps Engine)                                             |
| Containers  | Docker & Kubernetes (AWS EKS)                                                               |
| Config Mgmt | Kustomize & External Secrets Operator (ESO)                                                 |

---

# Task 4 — What I Built

## Goal

Walk through what you implemented, step by step.

### Evidence

#### Step 1 — Local File & Project Directory Structure

Organized the totoro codebase into a clean, decoupled workspace. The repository separates application source code (frontend/ and backend/), configuration management (ansible/), infrastructure provisioning (terraform/), deployment manifests (k8s/), and continuous integration pipelines (.azure-pipelines/ and .github/).

#### Screenshot 2 — Step 1

[Local File & Project Directory Structure](screenshots/task-2-diagram.png)

#### Step 2 — DevSecOps Architecture Flow

Designed an enterprise GitOps delivery flow that completely decouples developer code builds from Kubernetes cluster administration.

Application Code Refactoring: Updated client-side API logic in the Next.js frontend to use relative paths (/api/v1/extract-graph). Routing requests through the AWS Application Load Balancer (ALB) eliminated hardcoded localhost:8000 dependencies and solved client-side bundle compilation constraints.

Database Migration Strategy: Configured FastAPI models to write extracted nodes and edges to Amazon RDS PostgreSQL, running pre-deployment schema updates using Alembic init-containers.

Continuous Delivery Pipeline: Azure DevOps compiles container images, runs Trivy vulnerability scans, pushes artifacts to AWS ECR, and commits updated image tags directly to the GitOps repository—allowing ArgoCD to automatically pull and reconcile EKS cluster state.

#### Screenshot 3 — Step 2

[DevSecOps Architecture Flow](screenshots/task-1-diagram.png)

#### Step 3 — Azure DevOps CI/CD Pipeline Implementation

Authored .azure-pipelines.yml inside .azure-pipelines/ to automate container builds, security scans, registry pushes, and GitOps image tag promotion without manually executing kubectl commands.

#### Screenshot 4 — Step 3

[Azure DevOps CI/CD Pipeline Implementation](screenshots/task-3-diagram.png)

#### Step 4 — Azure DevOps Pipeline Run

Executed modular Terraform scripts to provision the VPC (Public/Private Subnets, NAT Gateway), AWS EKS cluster, worker node groups, Amazon RDS PostgreSQL instance, and IAM OIDC roles for Service Accounts (IRSA).

#### Screenshot 5 — Step 4

[Azure DevOps CI/CD Pipeline Implementation](screenshots/task-4-diagram.png)

#### Step 5 — ArgoCD Application Sync Dashboard

Deployed ArgoCD into the argocd namespace to handle declarative GitOps synchronization and configured External Secrets Operator (ESO) in the external-secrets namespace to handle runtime secret injection.

ArgoCD Continuous Sync: ArgoCD continuously monitors the k8s/overlays/production path in Git, automatically applying manifest changes via the internal Kubernetes API to achieve zero-downtime rolling updates.

Dynamic Secret Ingestion: ESO authenticates via IRSA to pull sensitive database credentials from AWS Secrets Manager, syncing them into a native Kubernetes secret (rds-db-credentials) consumed by the FastAPI backend pods.

#### Screenshot 6 — Step 5

[Azure DevOps CI/CD Pipeline Implementation](screenshots/task-5-diagram.png)

#### Step 6 — Live Totoro Graphify Dashboard

Validated end-to-end functionality on the live web environment and applied OS-level security hardening across the underlying EKS worker nodes using Ansible.

Live System Verification: Accessed the frontend via the AWS Application Load Balancer URL ([http://k8s-default-totoroin-a541c4124e-1576574714.us-east-1.elb.amazonaws.com](http://k8s-default-totoroin-a541c4124e-1576574714.us-east-1.elb.amazonaws.com)). Successfully uploaded study notes, generated interactive 3D concept relationship graphs, and verified persistent record storage in Amazon RDS PostgreSQL.

Node Configuration & Hardening: Executed Ansible playbooks (ansible/site.yml) to standardize worker node operating systems, apply network sysctl hardening (net.ipv4.tcp_syncookies = 1), update system repositories, and deploy Prometheus node_exporter metrics collection agents.

#### Screenshot 7 — Step 6

[Azure DevOps CI/CD Pipeline Implementation](screenshots/task-6-diagram.png)

---

# Task 5 — Challenges & Key Learnings

## Goal

Reflect on what was hard, how you solved it, and your biggest takeaways from the full program.

### Evidence

#### Challenges & How I Solved Them

Challenges & How I Solved Them
EKS Worker Node Pod Density Limits (0/3 nodes available: Too many pods):

Challenge: During initial deployments on EC2 Spot instance worker nodes (such as t3.medium), pod scheduling hit AWS Elastic Network Interface (ENI) IP allocation caps. The default Secondary IP mode ran out of IP addresses per node, leaving new frontend and backend pods stuck indefinitely in the Pending state during rolling updates.

Solution: Enabled Amazon VPC CNI Prefix Delegation (ENABLE_PREFIX_DELEGATION=true) on the aws-node DaemonSet. This allowed each ENI to allocate /28 IPv4 CIDR blocks (16 IP addresses) instead of individual secondary IPs, increasing node pod capacity by up to 4x. Additionally, deployment replica counts were calibrated to match spot node instance thresholds.

Client-Side Build-Time Environment Variable Hardcoding (ERR_CONNECTION_REFUSED):

Challenge: The Next.js frontend code initially relied on http://localhost:8000 or build-time environment variables (NEXT*PUBLIC_API_URL). When deployed inside Kubernetes behind an AWS Application Load Balancer (ALB), client browser requests failed because Next.js bakes NEXT_PUBLIC* variables into static JavaScript bundles at build time, preventing runtime cluster URL overriding.

Solution: Refactored the Next.js API client layer to use environment-agnostic relative URL paths (/api/v1/extract-graph). The ingress routing layer was updated in k8s/base/ingress.yaml to route /api paths directly to the totoro-backend FastAPI service while sending all root / traffic to totoro-frontend. This eliminated cross-origin issues and hardcoded environment values entirely.

Zero-Trust Secrets Ingestion without Plaintext Credentials in Git:

Challenge: Passing sensitive database credentials (RDS PostgreSQL connections and password strings) via standard Kubernetes YAML files created unacceptable security risks and violated GitOps principles, as plain text secrets could be exposed in the version control repository.

Solution: Implemented the External Secrets Operator (ESO) combined with IAM Roles for Service Accounts (IRSA). Configured an OpenID Connect (OIDC) federated identity provider for the EKS cluster, allowing the ESO pod service account to authenticate directly to AWS IAM without static AWS access keys. ESO dynamically retrieves secret parameters from AWS Secrets Manager and generates native, auto-rotating Kubernetes Secrets (rds-db-credentials) inside the cluster at runtime.

State Drift and Lifecycle Failures During IaC Destruction:

Challenge: Running terraform destroy threw IAM and CloudWatch AccessDenied errors (iam:GetPolicy, iam:GetRole, logs:DescribeLogGroups). These dependency locks occurred because active Application Load Balancers and AWS Target Groups dynamically created by the AWS Load Balancer Controller lingered in the VPC, blocking standard Terraform state cleanup.

Solution: Structured a strict teardown sequence: first deleting the Kubernetes Ingress resource (kubectl delete ingress) to cleanly signal the AWS ALB Controller to decommission AWS Load Balancers and security groups, emptying container blobs from ECR repositories, and aligning the deployment service account's IAM permissions with AWS IAM boundary policies before running terraform destroy.

#### Key Learnings from the Full Program

Declarative GitOps Engine over Manual Imperative Execution:

Relying on manual terminal commands (kubectl apply, kubectl rollout restart) creates unrecorded cluster drift, lacks auditability, and leads to failed deployments. Adopting ArgoCD as an in-cluster GitOps controller enforces declarative state management, where Git serves as the single source of truth. Any change committed to Kustomize overlays in Git is automatically reconciled inside EKS, enabling self-healing clusters and automated rollbacks.

Decoupling Application Build Pipelines from Infrastructure Deployment:

Professional continuous integration must decouple the Image Build phase from the Cluster Operations phase. Using Azure DevOps pipelines to build Docker images, execute Trivy container vulnerability scans, push artifacts to AWS ECR, and update manifest image tags in Git ensures that CI runners never require direct kubectl access or administrative credentials to the production Kubernetes cluster.

Enterprise Runtime Configuration vs. Build-Time Arguments:

Container images must remain environment-agnostic so the exact same image artifact built by CI can be promoted across Development, Staging, and Production environments without rebuilding binaries. Application architecture must separate build-time logic from runtime configuration, leveraging Kubernetes ConfigMaps, relative ingress routing, and dynamic secret operators rather than compiling environment-specific strings into application code.

Cloud-Native Security & Identity Federation (OIDC / IRSA):

Storing long-lived cloud access keys (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) inside application containers or Kubernetes secrets introduces severe credential leakage risks. Leveraging AWS IAM Roles for Service Accounts (IRSA) via OIDC federated identity allows individual pods to assume short-lived, scoped IAM roles, achieving a true zero-trust security architecture for managed services like AWS Secrets Manager and Amazon RDS.

Configuration Management & OS-Level Hardening with Ansible:

Infrastructure provisioning with Terraform only covers cloud resource creation; ensuring host-level security requires automated configuration management. Using Ansible playbooks to apply sysctl kernel parameters (such as net.ipv4.tcp_syncookies), update OS repositories, and deploy telemetry agents (node_exporter) provides standardized, reproducible host security across EC2 node groups.

# Task 6 — LinkedIn Post

## Goal

Publish a LinkedIn post summarizing your final project and your journey through the program.

### Evidence

#### LinkedIn Post URL

Add your LinkedIn post URL here...

Add the following credit note at the end of your post:

> **P.S. This post is part of the DevOps Micro Internship (DMI) with Agentic AI — Cohort 3 — by Pravin Mishra. My graded progress is public: https://dmi.pravinmishra.com/s/JokerHin.html · Start your DevOps journey: https://dmi.pravinmishra.com/?utm_source=student&utm_medium=ps-linkedin&utm_campaign=cohort3**

---

_Part of the [DevOps Micro Internship with Agentic AI](https://www.linkedin.com/in/pravin-mishra-aws-trainer/) by Pravin Mishra — Join: https://discord.pravinmishra.com/?utm_source=github&utm_medium=readme_
