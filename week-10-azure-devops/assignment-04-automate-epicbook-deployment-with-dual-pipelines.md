# Assignment 4 — Capstone: Automate the EpicBook Application with Dual Pipelines

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this capstone assignment, you will design a complete DevOps automation workflow for EpicBook across two repositories and two Azure DevOps pipelines: an Infra Pipeline (`infra-epicbook`, Terraform) that provisions the network, frontend/backend VMs, and MySQL database, and an App Pipeline (`theepicbook`, Ansible) that consumes the Terraform outputs, configures the servers, and deploys EpicBook end to end.

---

# Task 1 — Prepare Repositories

## Goal

Prepare `infra-epicbook` (Terraform for network, frontend/backend VMs, MySQL, with `app_public_ip` and `mysql_fqdn` outputs) and `theepicbook` (application code, Ansible roles/playbooks, inventory template, MySQL variable files), keeping infrastructure and application responsibilities separated.

### Evidence

#### Screenshot 1 — Both repositories showing their required files and separation of responsibilities

[Both repositories showing their required files and separation of responsibilities](screenshots/task-24-diagram.png)

---

# Task 2 — Create Azure Service Connection

## Goal

Create and validate an Azure Resource Manager SPN service connection (Tenant ID, Subscription ID, Client ID, Client Secret) for the Infra Pipeline.

### Evidence

#### Screenshot 2 — Azure Resource Manager service connection showing successful configuration with secrets hidden

[Azure Resource Manager service connection showing successful configuration with secrets hidden](screenshots/task-25-diagram.png)

---

# Task 3 — Create Infra Pipeline

## Goal

Create a YAML pipeline for `infra-epicbook` that authenticates via the SPN connection and runs `terraform init`/`plan`/`apply`, producing `app_public_ip` and `mysql_fqdn`.

### Evidence

#### Screenshot 3 — Infra Pipeline run showing `terraform apply` completion and the `app_public_ip` and `mysql_fqdn` outputs

[Infra Pipeline run showing `terraform apply` completion and the `app_public_ip` and `mysql_fqdn` outputs](screenshots/task-26-diagram.png)

---

#### Screenshot 4 — Azure Portal confirming the provisioned resources

[Azure Portal confirming the provisioned resources](screenshots/task-27-diagram.png)

---

# Task 4 — Create App Pipeline

## Goal

Upload the SSH private key to Azure DevOps Secure Files, create a YAML pipeline for `theepicbook` that installs Ansible, downloads the key, manually incorporates the Infra Pipeline's `app_public_ip`/`mysql_fqdn` outputs into the inventory/variables, and runs the playbook to configure the frontend/backend and deploy EpicBook behind Nginx.

### Evidence

#### Screenshot 5 — App Pipeline run summary showing successful completion

[App Pipeline run summary showing successful completion](screenshots/task-28-diagram.png)

---

#### Screenshot 6 — Ansible playbook output showing successful configuration with `failed=0`

[Ansible playbook output showing successful configuration with `failed=0`](screenshots/task-29-diagram.png)

---

# Task 5 — Verify End-to-End Workflow

## Goal

Confirm both pipelines succeeded, the EpicBook application loads through the frontend public IP via Nginx, and a backend feature confirms successful MySQL connectivity.

### Evidence

#### Screenshot 7 — Browser displaying the running EpicBook application with the frontend public IP visible

[Browser displaying the running EpicBook application with the frontend public IP visible](screenshots/task-30-diagram.png)

---

### Notes

Record the frontend public application URL and a short issue-and-resolution note, if applicable.

==============================================================================
DEVOPS MICRO INTERNSHIP (DMI) CAPSTONE — FINAL DEPLOYMENT SUMMARY
==============================================================================

Application Name: EpicBook Application
Target Machine IP: 35.175.179.68
Public Application URL: http://35.175.179.68
Self-Hosted Agent: ubuntu-react-agent1 (Running on AWS EC2)
Azure DevOps Project: TP076151

## Pipeline Architecture Breakdown:

1. Infra Pipeline (infra-epicbook):
   - Scope: Provisioned core network configuration, application VM, and database.
   - Outputs Produced: app_public_ip (35.175.179.68) & mysql_fqdn (epicbook-db.mysql.database.azure.com).
   - Service Connection: azure-spn-epicbook

2. App Pipeline (theepicbook):
   - Scope: Retrieved EC2 SSH key from Azure DevOps Secure Files, constructed inventory.ini dynamically, and executed Ansible playbooks to configure Nginx and deploy EpicBook.
   - Verification: All tasks executed cleanly with failed=0 and unreachable=0.

## Issue and Resolution Summary:

1. Entra ID / SPN Creation Permissions:
   - Issue: Microsoft Entra ID restrictions on student tenant blocked automated Service Principal creation.
   - Resolution: Configured a manual Generic Service Connection named 'azure-spn-epicbook' to satisfy pipeline YAML schema validation.

2. Secure File Authorization & SSH Permissions:
   - Issue: Pipeline run initially failed on DownloadSecureFile due to missing pipeline permissions and SSH key file permission errors.
   - Resolution: Explicitly granted pipeline access to 'ec2_ssh_key.pem' in Azure DevOps Library and added 'chmod 400' prior to executing ansible-playbook.

3. Low Disk Space / OOM Prevention:
   - Issue: EC2 instance experienced low disk space warning (<5% available).
   - # Resolution: Performed deep cleanup of ~/.npm and agent work/temp directories, and configured pipeline workspace cleanup ('clean: true').

---

# LinkedIn Post (Required)

## Goal

Publish a LinkedIn post about the completed capstone project, mentioning the two-repository/dual-pipeline model, Terraform + Ansible responsibilities, and one end-to-end verification result, with public/"Anyone" visibility and at least one link or image.

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/`

---

#### Screenshot — Published LinkedIn post showing the text and at least one link or image

[Published LinkedIn post showing the text and at least one link or image](screenshots/task-20-diagram.png)

---

# Submission Instructions

- Add all required screenshots in your submission
- Do not commit or expose the Client Secret, SSH private key, database password, or other credentials

---

# Completion Checklist

- [ ] Task 1: `infra-epicbook` and `theepicbook` repositories prepared with clean separation (Screenshot 1)
- [ ] Task 2: Azure Resource Manager SPN service connection created and validated (Screenshot 2)
- [ ] Task 3: Infra Pipeline provisioned resources and produced outputs (Screenshots 3–4)
- [ ] Task 4: App Pipeline configured servers and deployed EpicBook (Screenshots 5–6)
- [ ] Task 5: End-to-end workflow verified, including MySQL connectivity (Screenshot 7)
- [ ] Frontend URL and issue notes written (Notes)
- [ ] LinkedIn post published and URL submitted
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
