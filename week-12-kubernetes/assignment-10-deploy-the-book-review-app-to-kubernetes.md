# Assignment 10 — Capstone: Deploy the Book Review App to Kubernetes

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this capstone assignment, you will deploy the Book Review App as a production-style three-tier application on Kubernetes (EKS, AKS, GKE, Minikube, or k3s): a Next.js frontend behind Nginx exposed publicly, an internal Node.js/Express backend on port 3010, and a persistent or managed MySQL database — configured with ConfigMaps, Secrets, and validated end to end.

---

# Task 1 — Prepare the Kubernetes Cluster and Tooling

## Goal

Select a Kubernetes platform, confirm `kubectl` (and Helm, if used) can communicate with the cluster, and verify nodes are Ready.

### Evidence

#### Screenshot 1 — Terminal showing the active Kubernetes context and Ready nodes

[Terminal showing the active Kubernetes context and Ready nodes](screenshots/task-47-diagram.png)

---

#### Screenshot 2 (if using Helm) — Terminal showing `helm version`

[Terminal showing `helm version`](screenshots/task-48-diagram.png)

---

# Task 2 — Design the Three-Tier Kubernetes Architecture

## Goal

Create an architecture diagram showing the public entry point, frontend, internal backend, MySQL, ConfigMaps/Secrets, and the permitted traffic flow.

### Evidence

#### Screenshot 3 — Completed Kubernetes architecture diagram

[Completed Kubernetes architecture diagram](screenshots/task-49-diagram.png)

---

# Task 3 — Create ConfigMaps and Secrets

## Goal

Externalize non-sensitive configuration into ConfigMaps and sensitive values (database credentials, JWT secret) into Secrets, referenced from the Pod specs without committing plaintext values.

### Evidence

#### Screenshot 4 — ConfigMap manifest or `kubectl describe configmap` output showing non-sensitive configuration

[ConfigMap manifest or `kubectl describe configmap` output showing non-sensitive configuration](screenshots/task-50-diagram.png)

---

#### Screenshot 5 — Secret object usage with sensitive values hidden or redacted

[Secret object usage with sensitive values hidden or redacted](screenshots/task-51-diagram.png)

---

# Task 4 — Deploy and Configure the MySQL Data Tier

## Goal

Provide a persistent MySQL database (managed service or StatefulSet + PVC) reachable only by the backend, initialize the schema, and test connectivity.

### Evidence

#### Screenshot 6 — Managed MySQL status or MySQL StatefulSet/PVC status

[Managed MySQL status or MySQL StatefulSet/PVC status](screenshots/task-52-diagram.png)

---

#### Screenshot 7 — Successful database connectivity or schema verification with credentials hidden

[Successful database connectivity or schema verification with credentials hidden](screenshots/task-53-diagram.png)

---

# Task 5 — Deploy the Backend Application Tier

## Goal

Run one or two Node.js/Express backend replicas on port 3010, expose them via ClusterIP (or internal LoadBalancer), and connect them to MySQL using ConfigMaps/Secrets.

### Evidence

#### Screenshot 8 — Backend Deployment, Pods, and internal Service

[Backend Deployment, Pods, and internal Service](screenshots/task-54-diagram.png)

---

#### Screenshot 9 — Backend logs showing successful startup and database connectivity

[Backend logs showing successful startup and database connectivity](screenshots/task-55-diagram.png)

---

# Task 6 — Deploy the Frontend and Configure Nginx

## Goal

Run one or two Next.js frontend replicas behind Nginx on port 80, reverse-proxying to the backend's internal Service name.

### Evidence

#### Screenshot 10 — Frontend Deployment and Ready Pods

[Frontend Deployment and Ready Pods](screenshots/task-56-diagram.png)

---

#### Screenshot 11 — Nginx reverse-proxy configuration showing the internal backend Service name

[Nginx reverse-proxy configuration showing the internal backend Service name](screenshots/task-57-diagram.png)

---

# Task 7 — Configure External and Internal Networking

## Goal

Expose only the frontend publicly (LoadBalancer or Ingress), restrict backend access to the frontend path (NetworkPolicy or platform equivalent), and confirm MySQL is not publicly reachable.

### Evidence

#### Screenshot 12 — Frontend LoadBalancer or Ingress showing the public endpoint

[Frontend LoadBalancer or Ingress showing the public endpoint](screenshots/task-58-diagram.png)

---

#### Screenshot 13 — Internal backend Service and NetworkPolicy (or equivalent restriction)

[Internal backend Service and NetworkPolicy](screenshots/task-59-diagram.png)

---

# Task 8 — Validate the Application End to End

## Goal

Confirm the frontend loads publicly, a full user flow reaches the backend and MySQL, and collect operational evidence.

### Evidence

#### Screenshot 14 — `kubectl get all` output

[`kubectl get all` output](screenshots/task-60-diagram.png)

---

#### Screenshot 15 — Functional Book Review App in the browser with the public URL or IP visible

[Functional Book Review App in the browser with the public URL or IP visible](screenshots/task-61-diagram.png)

---

#### Screenshot 16 — Frontend Pod logs

[Frontend Pod logs](screenshots/task-62-diagram.png)

---

#### Screenshot 17 — Backend Pod logs showing successful requests or database activity

[Backend Pod logs showing successful requests or database activity](screenshots/task-63-diagram.png)

---

#### Screenshot 18 (optional) — Kubernetes dashboard

[Kubernetes dashboard](screenshots/task-64-diagram.png)

---

# Task 9 — Implement Optional Production Enhancements

## Goal

Optionally package as a Helm chart, add HPA, add readiness/liveness probes, or configure TLS via cert-manager — without changing the core architecture.

### Evidence

#### Screenshot 19 (optional) — Helm release, HPA, probes, or TLS evidence

[Helm release, HPA, probes, or TLS evidence](screenshots/task-65-diagram.png)

---

### Notes

Report the Kubernetes platform used, the public frontend URL/IP, a GitHub link to your manifests/Helm chart (if applicable), and the architecture diagram link. Summarize what worked, issues encountered and how they were resolved, and the tools/sources that helped the most.

Kubernetes Platform Used: Minikube (v1.3x) running via Docker Driver on Windows.

Public Frontend URL: [http://127.0.0.1:80](http://127.0.0.1:80) (or [http://127.0.0.1:8080](http://127.0.0.1:8080) via port-forwarding).

GitHub Repository / Manifests: pravinmishraaws/theepicbook (manifests under ~/k8s-labs/capstone).

Architecture Overview:

Frontend Tier: 2 Nginx reverse-proxy replicas handling edge traffic on port 80 and proxying backend requests (proxy_pass http://backend-svc:5000).

Backend Tier: 2 Node.js/Express API replicas operating on port 5000, exposed internally via backend-svc (ClusterIP).

Database Tier: 1 MySQL 8.0 pod backed by a 1Gi PersistentVolumeClaim (mysql-pvc), reachable exclusively via mysql-svc (ClusterIP).

Configuration & Security: Non-sensitive settings managed via epicbook-config (ConfigMap) and database credentials isolated via epicbook-secret (Secret).

Key Operational Challenges & Resolutions
Inline Container Build Failures:

Issue: The backend container originally failed to start (CrashLoopBackOff) due to an invalid package flag in Alpine Linux (apk add --no-libc-prefix), preventing Git installation and repository cloning.

Resolution: Updated 03-backend.yaml to use apk add --no-cache git, added elevated execution context (securityContext: runAsUser: 0), and ensured /app was properly initialized prior to cloning.

Local Host Port 80 Conflicts:

Issue: Visiting [http://127.0.0.1](http://127.0.0.1) returned a default Windows IIS page instead of the application.

Resolution: Disabled the local IIS service (net stop w3svc) to free up port 80 for minikube tunnel, or used kubectl port-forward svc/frontend-svc 8080:80 as an alternative local endpoint.

Git Bash Exec Path Conversion:

Issue: Running kubectl exec -it <pod> -- /bin/sh failed with exit code 127 because Git Bash auto-converted /bin/sh to a Windows path (C:/Program Files/Git/...).

Resolution: Used winpty kubectl exec -it <pod> -- //bin//sh with double slashes to bypass path conversion and successfully run the database seed script.

---

# Submission Instructions

- Add all required screenshots and links in your submission
- Do not display decoded Secret values in screenshots or the report

---

# Completion Checklist

- [ ] Task 1: Cluster and tooling verified (Screenshots 1–2)
- [ ] Task 2: Architecture diagram completed (Screenshot 3)
- [ ] Task 3: ConfigMaps and Secrets created (Screenshots 4–5)
- [ ] Task 4: MySQL data tier deployed and verified (Screenshots 6–7)
- [ ] Task 5: Backend tier deployed internally (Screenshots 8–9)
- [ ] Task 6: Frontend deployed behind Nginx (Screenshots 10–11)
- [ ] Task 7: External/internal networking configured (Screenshots 12–13)
- [ ] Task 8: End-to-end validation completed (Screenshots 14–18)
- [ ] Task 9: Optional production enhancements documented (Screenshot 19)
- [ ] Report completed (Notes)
- [ ] No sensitive information exposed

---

## 📌 About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra (The CloudAdvisory) focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## 📌 Resources

- 🌐 DMI Official Website: https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme
- 🎓 University: https://university.pravinmishra.com?utm_source=github&utm_medium=readme
- 💬 Discord Community: https://discord.pravinmishra.com?utm_source=github&utm_medium=readme
- 📝 Blog: https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme
- ▶️ YouTube Playlist: https://www.youtube.com/playlist?list=PLFeSNDtI4Cho
- 🔗 Pravin Mishra (LinkedIn): https://www.linkedin.com/in/pravin-mishra-aws-trainer/
- 🏢 CloudAdvisory (LinkedIn): https://www.linkedin.com/company/thecloudadvisory/

---

_This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track._
