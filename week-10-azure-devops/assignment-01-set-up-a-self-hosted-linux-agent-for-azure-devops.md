# Assignment 1 — Set Up a Self-Hosted Linux Agent for Azure DevOps (Ubuntu + PAT)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will set up a self-hosted Azure DevOps build agent on an Ubuntu VM (AWS or Azure), registering it with a Personal Access Token in a dedicated agent pool, running it as a system service, and verifying it by running a test pipeline.

---

# Task 1 — Create a Personal Access Token (PAT)

## Goal

Create a PAT with Agent Pools (Read & Manage) and Build (Read & Execute) scopes, and store it securely.

> No PAT value screenshot required. If you capture the token settings page, ensure the secret value is not visible.

---

# Task 2 — Create an Agent Pool

## Goal

Create a self-hosted agent pool (e.g. `SelfHostedPool`) in Azure DevOps Organization Settings.

### Evidence

#### Screenshot 1 — Azure DevOps Agent Pools page showing the newly created pool

[Azure DevOps Agent Pools page showing the newly created pool](screenshots/task-1-diagram.png)

---

# Task 3 — Provision the Ubuntu VM

## Goal

Create an Ubuntu 22.04 (or latest) VM in AWS or Azure with SSH access, and confirm connectivity.

### Evidence

#### Screenshot 2 — Cloud console showing the running Ubuntu VM and its public IP or DNS name

[Cloud console showing the running Ubuntu VM and its public IP or DNS name](screenshots/task-2-diagram.png)

---

#### Screenshot 3 — Terminal showing a successful SSH login and Ubuntu version details

[Terminal showing a successful SSH login and Ubuntu version details](screenshots/task-3-diagram.png)

---

# Task 4 — Install and Configure the Agent

## Goal

Download the Linux agent package, register it with your organization/pool/PAT via `config.sh`, and install/start it as a system service.

### Evidence

#### Screenshot 4 — Terminal showing successful agent configuration without exposing the PAT

[Terminal showing successful agent configuration without exposing the PAT](screenshots/task-4-diagram.png)

---

#### Screenshot 5 — Terminal showing the agent service running successfully

[Terminal showing the agent service running successfully](screenshots/task-5-diagram.png)

---

# Task 5 — Verify the Setup

## Goal

Confirm the agent service is running and the agent shows as Online in the Azure DevOps agent pool.

### Evidence

#### Screenshot 6 — Agent Pool listing showing the registered agent online

[Agent Pool listing showing the registered agent online](screenshots/task-6-diagram.png)

---

# Task 6 — Run a Test Pipeline

## Goal

Create and run a YAML pipeline targeting the self-hosted pool, running `uname -a`, `whoami`, and `df -h` on the VM.

### Evidence

#### Screenshot 7 — Successful test pipeline run output in Azure DevOps showing the Linux commands

[Successful test pipeline run output in Azure DevOps showing the Linux commands](screenshots/task-7-diagram.png)

---

### Notes

Note the cloud platform used, your Azure DevOps organization/project name, and the agent pool name. Describe any issue you faced and how you resolved it.

Infrastructure & Environment Details:

- Cloud Platform: Amazon Web Services (AWS EC2 - Ubuntu 24.04 LTS)
- Public IP Address: 54.221.23.46
- Azure DevOps Organization: TP076151
- Agent Pool Name: SelfHostedPool
- Agent Name: ubuntu-aws-agent1
- Agent Version: v5.281.1

Issues Faced & Resolution:

1. Deprecated Agent Package Mirror:
   Attempts to download the agent package using legacy endpoints (vstsagentpackage.azureedge.net) failed with DNS resolution errors (NXDOMAIN). The issue was resolved by obtaining the official download URL from the Azure DevOps Agent Pools configuration UI using the active CDN domain (download.agent.dev.azure.com).

2. Prompt Misconfiguration During Agent Registration:
   During the interactive execution of ./config.sh, entering the secret Personal Access Token (PAT) string at the "authentication type" prompt triggered an invalid value error. The issue was resolved by pressing Enter at the authentication type prompt to accept the default PAT option before pasting the token string at the subsequent prompt.

3. Background Daemon Persistence:
   Executing ./svc.sh install and ./svc.sh start registered the agent as a systemd background service on Ubuntu, ensuring continuous polling and automatic recovery across system reboots.

---

# Submission Instructions

- Add all required screenshots in your submission
- Do not display the PAT, SSH private key, or other secrets in screenshots or logs

---

# Completion Checklist

- [ ] Task 1: PAT created with required scopes and stored securely
- [ ] Task 2: Self-hosted agent pool created (Screenshot 1)
- [ ] Task 3: Ubuntu VM provisioned and SSH verified (Screenshots 2–3)
- [ ] Task 4: Agent installed, registered, and running as a service (Screenshots 4–5)
- [ ] Task 5: Agent verified Online (Screenshot 6)
- [ ] Task 6: Test pipeline run successfully (Screenshot 7)
- [ ] Platform/org/pool details and issue notes written (Notes)
- [ ] No secrets exposed

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
