# Assignment 4 — Docker Volumes

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will learn how Docker Volumes and Bind Mounts provide persistent storage for containers, deploying applications that retain logs and data even after containers are stopped or removed.

---

# Task 1 — Deploy a Standalone Application with Persistent Logs Using Bind Mounts

## Goal

Run an Nginx container (`myweb`) with a Bind Mount from `~/nginx-logs` to `/var/log/nginx`, verify the site loads, confirm logs are written, remove the container, and confirm the logs persist on the host.

### Evidence

#### Screenshot 1 — Output of `docker images`

[Output of `docker images`](screenshots/task-53-diagram.png)

---

#### Screenshot 2 — Output of `docker search nginx`

[Output of `docker search nginx`](screenshots/task-54-diagram.png)

---

#### Screenshot 3 — Successful `docker pull nginx` (if applicable)

[Successful `docker pull nginx`](screenshots/task-55-diagram.png)

---

#### Screenshot 4 — Creation of the `~/nginx-logs` directory

[Creation of the `~/nginx-logs` directory](screenshots/task-56-diagram.png)

---

#### Screenshot 5 — Output of `docker run` with the Bind Mount

[Output of `docker run` with the Bind Mount](screenshots/task-57-diagram.png)

---

#### Screenshot 6 — Output of `docker ps` showing the running `myweb` container

[Output of `docker ps` showing the running `myweb` container](screenshots/task-58-diagram.png)

---

#### Screenshot 7 — Browser displaying the Nginx Welcome Page

[Browser displaying the Nginx Welcome Page](screenshots/task-59-diagram.png)

---

#### Screenshot 8 — Output of `ls ~/nginx-logs` showing `access.log` and `error.log`

[Output of `ls ~/nginx-logs` showing `access.log` and `error.log`](screenshots/task-60-diagram.png)

---

#### Screenshot 9 — Successful removal of the container

[Successful removal of the container](screenshots/task-61-diagram.png)

---

#### Screenshot 10 — Output of `ls ~/nginx-logs` confirming the log files remain after the container has been removed

[Output of `ls ~/nginx-logs` confirming the log files remain after the container has been removed](screenshots/task-62-diagram.png)

---

# Task 2 — Deploy Two Containers with Persistent Data Using Docker Volumes

## Goal

Create a custom network `mynetwork` and a Docker volume `shared-data`, build and run a `backend` container that writes to the shared volume and a `frontend` container that reads from it, and confirm updates are reflected immediately.

### Evidence

#### Screenshot 1 — Project folder structure

[Project folder structure](screenshots/task-63-diagram.png)

---

#### Screenshot 2 — Output of `docker network create mynetwork`

[Output of `docker network create mynetwork`](screenshots/task-64-diagram.png)

---

#### Screenshot 3 — Output of `docker volume create shared-data`

[Output of `docker volume create shared-data`](screenshots/task-65-diagram.png)

---

#### Screenshot 4 — Backend Dockerfile

[Backend Dockerfile](screenshots/task-66-diagram.png)

---

#### Screenshot 5 — Successful backend image build

[Successful backend image build](screenshots/task-67-diagram.png)

---

#### Screenshot 6 — Frontend Dockerfile

[Successful backend image build](screenshots/task-68-diagram.png)

---

#### Screenshot 7 — Successful frontend image build

[Successful frontend image build](screenshots/task-69-diagram.png)

---

#### Screenshot 8 — Output of `docker ps` showing both containers

[Output of `docker ps` showing both containers](screenshots/task-70-diagram.png)

---

#### Screenshot 9 — Successful execution of `docker exec backend curl http://localhost/write`

[Successful execution of `docker exec backend curl http://localhost/write`](screenshots/task-71-diagram.png)

---

#### Screenshot 10 — Browser displaying "Hello from Backend!"

[Browser displaying "Hello from Backend!"](screenshots/task-71-diagram.png)

---

#### Screenshot 11 — Browser displaying "Test Data 1" after the first update

[Browser displaying "Test Data 1" after the first update](screenshots/task-71-diagram.png)

---

#### Screenshot 12 — Browser displaying "Test Data 2 - New Update" after the second update

[Browser displaying "Test Data 2 - New Update" after the second update](screenshots/task-72-diagram.png)

---

# LinkedIn Post (Optional)

## Goal

Create a LinkedIn post covering the assignment, Docker Hub repository, steps performed, and key learning outcomes.

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

- [ ] Task 1: Bind-mounted persistent logs verified before and after container removal (Screenshots 1–10)
- [ ] Task 2: Docker volume shared between frontend and backend verified (Screenshots 1–12)
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
