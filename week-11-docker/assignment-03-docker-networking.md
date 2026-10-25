# Assignment 3 — Docker Networking

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will explore Docker network types and deploy applications using different networking modes: the default bridge network, a custom bridge network for microservices, multiple networks for a multi-tier architecture, and host networking.

---

# Task 1 — Deploy a Standalone Application Using Docker Bridge Network

## Goal

List Docker networks, verify/pull the Nginx image, run an Nginx container (`myweb`) on the default bridge network with port 80 mapped, and verify it's reachable from a browser via the VM's public IP.

### Evidence

#### Screenshot 1 — Output of `docker network ls`

[Output of `docker network ls`](screenshots/task-18-diagram.png)

---

#### Screenshot 2 — Output of `docker images`

[Output of `docker images`](screenshots/task-19-diagram.png)

---

#### Screenshot 3 — Output of `docker search nginx`

[Output of `docker search nginx`](screenshots/task-20-diagram.png)

---

#### Screenshot 4 — Successful `docker pull nginx` (if applicable)

[Successful `docker pull nginx`](screenshots/task-21-diagram.png)

---

#### Screenshot 5 — Output of `docker ps` showing the running `myweb` container

[Output of `docker ps` showing the running `myweb` container](screenshots/task-22-diagram.png)

---

#### Screenshot 6 — Browser displaying the Nginx Welcome Page using the Public IP address

[Browser displaying the Nginx Welcome Page using the Public IP address](screenshots/task-23-diagram.png)

---

# Task 2 — Connect Multiple Containers Using a Custom Bridge Network

## Goal

Create a custom bridge network `mynetwork`, build and run a Node/Express `frontend` container and an Nginx `backend` container on it, and verify they can communicate by container name.

### Evidence

#### Screenshot 1 — Output of `docker network create mynetwork`

[Output of `docker network create mynetwork`](screenshots/task-24-diagram.png)

---

#### Screenshot 2 — Output of `docker network ls`

[Output of `docker network ls`](screenshots/task-25-diagram.png)

---

#### Screenshot 3 — Frontend Dockerfile

[Frontend Dockerfile](screenshots/task-26-diagram.png)

---

#### Screenshot 4 — Successful `docker build` for the frontend

[Successful `docker build` for the frontend](screenshots/task-27-diagram.png)

---

#### Screenshot 5 — Output of `docker ps` showing the frontend container

[Output of `docker ps` showing the frontend container](screenshots/task-28-diagram.png)

---

#### Screenshot 6 — Output of `docker ps` showing both frontend and backend containers

[Output of `docker ps` showing both frontend and backend containers](screenshots/task-29-diagram.png)

---

#### Screenshot 7 — Output of `docker network inspect mynetwork`

[Output of `docker network inspect mynetwork`](screenshots/task-30-diagram.png)

---

#### Screenshot 8 — Successful `curl http://<Public-IP>` showing "Hello from Frontend"

[Successful `curl http://<Public-IP>` showing "Hello from Frontend"](screenshots/task-31-diagram.png)

---

#### Screenshot 9 — Successful `curl backend` output from the frontend container showing the Nginx Welcome Page

[Successful `curl backend` output from the frontend container showing the Nginx Welcome Page](screenshots/task-32-diagram.png)

---

# Task 3 — Deploy a Multi-Tier Application Using Multiple Docker Networks

## Goal

Build a three-tier app (frontend, backend, MongoDB) across `backend-network` (backend ↔ database) and `frontend-network` (frontend ↔ backend), and verify data flows end to end.

### Evidence

#### Screenshot 1 — Creation of `backend-network`

[Creation of `backend-network`](screenshots/task-33-diagram.png)

---

#### Screenshot 2 — Creation of `frontend-network`

[Creation of `frontend-network`](screenshots/task-34-diagram.png)

---

#### Screenshot 3 — Project folder structure

[Project folder structure](screenshots/task-35-diagram.png)

---

#### Screenshot 4 — Database Dockerfile

[Database Dockerfile](screenshots/task-36-diagram.png)

---

#### Screenshot 5 — Backend Dockerfile

[Backend Dockerfile](screenshots/task-37-diagram.png)

---

#### Screenshot 6 — Frontend Dockerfile

[Frontend Dockerfile](screenshots/task-38-diagram.png)

---

#### Screenshot 7 — Successful Docker image builds (database, backend, frontend)

[Successful Docker image builds (database, backend, frontend)](screenshots/task-39-diagram.png)

---

#### Screenshot 8 — Running containers (`docker ps`)

[Running containers (`docker ps`)](screenshots/task-40-diagram.png)

---

#### Screenshot 9 — Output of `docker network inspect backend-network`

[Output of `docker network inspect backend-network`](screenshots/task-41-diagram.png)

---

#### Screenshot 10 — Output of `docker network inspect frontend-network`

[Output of `docker network inspect frontend-network`](screenshots/task-42-diagram.png)

---

#### Screenshot 11 — Browser showing the frontend application

[Browser showing the frontend application](screenshots/task-43-diagram.png)

---

#### Screenshot 12 — Successful `curl api` from the frontend container

[Successful `curl api` from the frontend container](screenshots/task-44-diagram.png)

---

#### Screenshot 13 — MongoDB connection using `mongosh`

[MongoDB connection using `mongosh`](screenshots/task-45-diagram.png)

---

#### Screenshot 14 — Successful document insertion

[Successful document insertion](screenshots/task-46-diagram.png)

---

#### Screenshot 15 — Successful retrieval of the inserted document

[Successful retrieval of the inserted document](screenshots/task-47-diagram.png)

---

# Task 4 — Deploy an Application Using Docker Host Network Mode

## Goal

Deploy an Nginx container (`fastapp`) using Host Network Mode and verify it's reachable without explicit port mapping, then confirm the `NetworkMode` and clean up.

### Evidence

#### Screenshot 1 — Output of `docker run --network host`

[Output of `docker run --network host`](screenshots/task-48-diagram.png)

---

#### Screenshot 2 — Output of `docker ps` showing the running `fastapp` container

[Output of `docker ps` showing the running `fastapp` container](screenshots/task-49-diagram.png)

---

#### Screenshot 3 — Browser or terminal displaying the Nginx Welcome Page

[Browser or terminal displaying the Nginx Welcome Page](screenshots/task-50-diagram.png)

---

#### Screenshot 4 — Output of `docker inspect fastapp | grep "NetworkMode"`

[Output of `docker inspect fastapp | grep "NetworkMode"`](screenshots/task-51-diagram.png)

---

#### Screenshot 5 — Successful cleanup showing `docker stop fastapp` and `docker rm fastapp`

[Successful cleanup showing `docker stop fastapp` and `docker rm fastapp`](screenshots/task-52-diagram.png)

---

# LinkedIn Post (Optional)

## Goal

Create a LinkedIn post covering the assignment objective, networking modes explored, key learning outcomes, and a short reflection on Docker networking concepts.

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/`

---

#### Screenshot — Published LinkedIn post

[Published LinkedIn post](screenshots/task-10-diagram.png)

---

# Submission Instructions

- Add all required screenshots in your submission
- Full name must be visible in required screenshots
- Do not expose sensitive information

---

# Completion Checklist

- [ ] Task 1: Standalone app on default bridge network deployed and verified (Screenshots 1–6)
- [ ] Task 2: Custom bridge network with frontend/backend communication verified (Screenshots 1–9)
- [ ] Task 3: Multi-tier app across two networks deployed and verified end to end (Screenshots 1–15)
- [ ] Task 4: Host network mode deployment verified and cleaned up (Screenshots 1–5)
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
