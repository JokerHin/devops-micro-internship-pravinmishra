# Assignment 2 — Deploy Mini Finance Project via Azure DevOps Pipeline

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build an Azure DevOps CI/CD pipeline that deploys the Mini Finance static website to an Ubuntu VM running Nginx: importing the repo into Azure Repos, provisioning the VM with Terraform and Ansible, connecting via an SSH Service Connection, and deploying on every commit to `main`.

---

# Task 1 — Import the Repository

## Goal

Import `https://github.com/pravinmishraaws/Azure-Static-Website` into Azure Repos and confirm `index.html` is present.

### Evidence

#### Screenshot 1 — Azure Repos showing the imported repository files with `index.html` visible

[Azure Repos showing the imported repository files with `index.html` visible](screenshots/task-8-diagram.png)

---

# Task 2 — Prepare the Target VM

## Goal

Provision a Linux VM with Terraform (ports 22/80 open), then use Ansible to install and start Nginx and prepare `/var/www/html`.

### Evidence

#### Screenshot 2 — Terraform output or cloud console showing the running VM and public IP

[Terraform output or cloud console showing the running VM and public IP](screenshots/task-9-diagram.png)

---

#### Screenshot 3 — Terminal showing Ansible completed successfully and Nginx is active

[Terminal showing Ansible completed successfully and Nginx is active](screenshots/task-10-diagram.png)

---

# Task 3 — Create an SSH Service Connection

## Goal

Create the password-based SSH Service Connection `ubuntu-nginx-ssh` pointing to the VM, and validate it.

### Evidence

#### Screenshot 4 — SSH Service Connection configuration page showing the connection details and successful validation, with the password hidden

[SSH Service Connection configuration page showing the connection details and successful validation, with the password hidden](screenshots/task-11-diagram.png)

---

# Task 4 — Author the YAML Pipeline

## Goal

Write a pipeline triggered on `main` that checks out the repo, copies files to `/var/www/html` via `CopyFilesOverSSH@0`, and verifies the deployment directory via an `SSH@0` task, using `ubuntu-nginx-ssh` and the self-hosted (or available Microsoft-hosted) pool.

### Evidence

#### Screenshot 5 — Pipeline YAML definition open in the Azure DevOps editor

[Pipeline YAML definition open in the Azure DevOps editor](screenshots/task-12-diagram.png)

---

# Task 5 — Verify Deployment

## Goal

Confirm the pipeline run succeeded (checkout, SSH connection, file transfer, remote verification) and the Mini Finance website is live at the VM's public IP.

### Evidence

#### Screenshot 6 — Successful Azure DevOps pipeline run log summary

[Successful Azure DevOps pipeline run log summary](screenshots/task-13-diagram.png)

---

#### Screenshot 7 — Browser showing the deployed website with the VM public IP visible

[Browser showing the deployed website with the VM public IP visible](screenshots/task-14-diagram.png)

---

### Notes

Include the VM public URL. Describe any issue you faced and how you fixed it (e.g. parallelism/agent-pool issues).

Target Environment & Deployment Details:

- Target Cloud Platform: AWS EC2 (Ubuntu 24.04 LTS)
- Target VM Public IP: 54.221.23.46
- Target Application URL: http://54.221.23.46
- Web Server: Nginx 1.24+
- Deployment Directory: /var/www/html
- Azure DevOps Agent Pool: Self-hosted
- Service Connection Name: ubuntu-nginx-ssh

Issues Faced & Resolution:

1. SSH Destination Directory Permission Denied:
   When executing CopyFilesOverSSH@0, initial deployment attempts failed because the default owner of /var/www/html on Ubuntu is root (755 permissions), which prevented the non-root 'ubuntu' SSH user from writing files.
   Resolution: Executed `sudo chown -R ubuntu:ubuntu /var/www/html` and `sudo chmod -R 755 /var/www/html` on the target VM to grant write permissions to the deployment user account.

2. Agent Pool Naming Mismatch:
   Referencing 'SelfHostedPool' in the pipeline YAML triggered a "pool does not exist" validation error because the registered pool name in Organization Settings contained a hyphen ('Self-hosted').
   Resolution: Updated the pool definition attribute in azure-pipelines.yml to `name: 'Self-hosted'` to match the exact pool configuration.

---

# Submission Instructions

- Add all required screenshots in your submission
- Do not commit the VM password to the repository or write it directly in YAML

---

# Completion Checklist

- [ ] Task 1: Repository imported into Azure Repos (Screenshot 1)
- [ ] Task 2: VM provisioned and Nginx configured (Screenshots 2–3)
- [ ] Task 3: SSH Service Connection created and validated (Screenshot 4)
- [ ] Task 4: YAML pipeline authored (Screenshot 5)
- [ ] Task 5: Pipeline run succeeded and site verified (Screenshots 6–7)
- [ ] VM URL and issue notes written (Notes)
- [ ] No passwords, tokens, or credentials exposed

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
