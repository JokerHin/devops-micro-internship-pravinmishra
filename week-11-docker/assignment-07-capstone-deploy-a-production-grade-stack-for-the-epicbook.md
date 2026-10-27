# Assignment 6 — Capstone: Deploy a Production-Grade Stack for The EpicBook

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this capstone assignment, you will take the EpicBook application from source code to a fully hardened, production-ready Docker Compose deployment on a cloud VM: multi-stage Dockerfiles, network isolation, healthchecks, persistent volumes with a backup plan, structured logging, a secure reverse proxy, and an operations runbook — with an optional CI/CD pipeline.

---

# Task 0 — App Discovery & Architecture

## Goal

Explore the `theepicbook` repository, identify its components (UI, API, DB, workers), document required environment variables/ports/persistence paths, and draw a component architecture diagram.

### Evidence

#### Deliverable — `docs/01-architecture-diagram.png`

[`docs/01-architecture-diagram.png`](screenshots/task-98-diagram.png)

---

#### Deliverable — `docs/02-env-and-ports.md`

[`docs/02-env-and-ports.md`](screenshots/task-83-diagram.png)

---

# Task 1 — Multi-Stage Dockerfiles

## Goal

Create minimal multi-stage Dockerfiles for the frontend and backend services, with `.dockerignore` files to keep the build context lightweight.

### Evidence

#### Deliverable — `frontend/Dockerfile`, `backend/Dockerfile`, and `.dockerignore` files, with a note on layer optimizations and security benefits

[`frontend/Dockerfile`, `backend/Dockerfile`, and `.dockerignore` files, with a note on layer optimizations and security benefits](screenshots/task-84-diagram.png)

---

# Task 2 — Compose Stack & Networks

## Goal

Author `docker-compose.yml` defining the reverse-proxy, frontend, backend, and database services, isolated front-tier/back-tier networks, and named volumes.

### Evidence

#### Deliverable — `docker-compose.yml`

[`docker-compose.yml`](screenshots/task-85-diagram.png)

---

# Task 3 — Healthchecks & Startup Order

## Goal

Add a database healthcheck, a `/health` endpoint check on the backend, and `depends_on` conditions checking `service_healthy`.

### Evidence

#### Deliverable — `docs/03-healthchecks-and-depends-on.md`

[`docs/03-healthchecks-and-depends-on.md`](screenshots/task-86-diagram.png)

---

# Task 4 — Reverse Proxy & CORS Config

## Goal

Configure Nginx or Traefik to route `/api` to the backend and `/` to the frontend, with an appropriate CORS allowlist on the backend.

### Evidence

#### Deliverable — `docs/04-proxy-routing-and-cors.md`

[`docs/04-proxy-routing-and-cors.md`](screenshots/task-87-diagram.png)

---

# Task 5 — Persistence & Backups

## Goal

Mount the database data directory to a named volume, document a snapshot/backup plan, and run a live snapshot restore drill.

### Evidence

#### Deliverable — `docs/05-persistence-and-backup.md`

[`docs/05-persistence-and-backup.md`](screenshots/task-88-diagram.png)

---

#### Screenshot — System state before and after a manual snapshot restore cycle

[System state before and after a manual snapshot restore cycle](screenshots/task-89-diagram.png)

---

# Task 6 — Logging & Observability

## Goal

Bind-mount the reverse proxy log directory to the host, redirect application logs to stdout or named volumes, and enable structured JSON logging where supported.

### Evidence

#### Deliverable — `docs/06-logging-layout.md`

[`docs/06-logging-layout.md`](screenshots/task-91-diagram.png)

---

#### Screenshot — Live running JSON container log entries

[Live running JSON container log entries](screenshots/task-90-diagram.png)

---

# Task 7 — Cloud Deployment (AWS or Azure)

## Goal

Provision a VM per the security requirements (SSH restricted to your IP; HTTP/HTTPS open), install Docker, and bring the full stack up with a working public URL.

### Evidence

#### Deliverable — `docs/07-cloud-deployment-notes.md` (ports, firewall rules, deployment link)

[`docs/07-cloud-deployment-notes.md` (ports, firewall rules, deployment link)](screenshots/task-92-diagram.png)

---

#### Screenshot — Browser showing successful web UI retrieval via the cloud public IP

[Browser showing successful web UI retrieval via the cloud public IP](screenshots/task-93-diagram.png)

---

#### Screenshot — Active page interaction confirming backend API data fetches succeed

[Active page interaction confirming backend API data fetches succeed](screenshots/task-94-diagram.png)

---

# Task 8 — CI/CD Pipeline (Optional)

## Goal

Build a pipeline (Azure Pipelines or GitHub Actions) that builds and tags multi-stage images and automates deployment via SSH restart steps.

### Evidence

#### Deliverable — `docs/08-ci-cd-pipeline.md`

name: Deploy EpicBook Production Stack

on:
push:
branches: [ main ]

jobs:
deploy:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v3 - name: Deploy to Cloud VM via SSH
uses: appleboy/ssh-action@master
with:
host: ${{ secrets.VM_HOST }}
username: ubuntu
key: ${{ secrets.SSH_PRIVATE_KEY }}
script: |
cd ~/epicbook-capstone
git pull origin main
docker compose down
docker compose up -d --build

---

#### Screenshot (optional) — Completed automated pipeline run

[Completed automated pipeline run](screenshots/task-95-diagram.png)

---

# Task 9 — Reliability Tests & Ops Runbook

## Goal

Inject faults (drop backend/database dependencies) and evaluate frontend error handling, then write an operations runbook covering startup, shutdown, secret rotation, and disaster recovery.

### Evidence

#### Deliverable — `docs/09-runbook.md`

[`docs/09-runbook.md`](screenshots/task-96-diagram.png)

---

#### Deliverable — `docs/10-reliability-tests.md`

[`docs/10-reliability-tests.md`](screenshots/task-97-diagram.png)

---

# LinkedIn Post (Required)

## Goal

Publish a 6–10 line LinkedIn post covering the architectural decision that most improved reliability, the biggest image size reduction achieved (with numbers), and your key production-hardening takeaways.

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/`

---

#### Screenshot — Published LinkedIn post showing the text body and a deployment verification image

[Published LinkedIn post](screenshots/task-10-diagram.png)

---

# Submission Instructions

- Add all required deliverables, screenshots, and links in your submission
- Full name must be visible in required screenshots
- Do not expose passwords, API tokens, cloud account IDs, or private keys

---

# Completion Checklist

- [ ] Task 0: Architecture diagram and env/ports doc completed
- [ ] Task 1: Multi-stage Dockerfiles and `.dockerignore` files created
- [ ] Task 2: `docker-compose.yml` with isolated networks and volumes authored
- [ ] Task 3: Healthchecks and `depends_on` conditions configured
- [ ] Task 4: Reverse proxy routing and CORS configured
- [ ] Task 5: Persistence and backup plan tested (Screenshot)
- [ ] Task 6: Logging and observability configured (Screenshot)
- [ ] Task 7: Cloud deployment live and verified (Screenshots)
- [ ] Task 8: CI/CD pipeline built (optional)
- [ ] Task 9: Reliability tests and runbook completed
- [ ] LinkedIn post published and URL submitted
- [ ] No sensitive information exposed
- [ ] VM torn down after grading to avoid unexpected charges

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
