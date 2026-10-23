# Assignment 04 — Deploy Mini Finance on Azure Using Terraform and Ansible

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will provision Azure infrastructure using Terraform and deploy the Mini Finance website using an Ansible multi-play playbook.

Terraform will create the Azure Virtual Machine and networking resources. Ansible will install Nginx, clone the Mini Finance repository, deploy the website, and verify the deployment.

---

# Task 1 — Create the Project Structure

## Goal

Create separate directories and files for the Terraform infrastructure and Ansible configuration.

### Evidence

#### Screenshot 1 — Terminal or VS Code showing the complete `mini-finance` project structure

[Terminal or VS Code showing the complete `mini-finance` project structure](screenshots/task-32-diagram.png)

---

### Notes

Established an enterprise-standard repository layout by decoupling infrastructure provisioning files (terraform/) from configuration management playbooks (ansible/).

Created essential scaffolding files across both subsystems: main.tf, variables.tf, outputs.tf, providers.tf, inventory.ini, site.yml, and README.md.

---

# Task 2 — Create the Azure Infrastructure Using Terraform

## Goal

Use Terraform to provision an Ubuntu Virtual Machine with the required Azure networking and security resources.

### Evidence

#### Screenshot 2 — Terraform code showing the `Allow-SSH` rule for port `22` and the `Allow-HTTP` rule for port `80`

[Terraform code showing the `Allow-SSH` rule for port `22` and the `Allow-HTTP` rule for port `80`](screenshots/task-33-diagram.png)

---

#### Screenshot 3 — Terraform code showing the association between `nsg-mini-finance` and `nic-mini-finance`

[Terraform code showing the association between `nsg-mini-finance` and `nic-mini-finance`](screenshots/task-34-diagram.png)

---

### Notes

Configured AWS infrastructure components using the aws provider (~> 5.0) targeting Ubuntu 24.04 LTS AMIs.

Implemented security group rules within aws_security_group.sg_mini_finance: Allow-SSH restricting port 22 access to the controller IP and Allow-HTTP permitting global port 80 traffic.

Provisioned an aws_instance for the Mini Finance node (vm-mini-finance) attached directly to the security group and injected with the controller's ED25519 SSH public key.

Formatted output in outputs.tf to expose the EC2 instance's public IPv4 address.

---

# Task 3 — Initialize and Apply the Terraform Configuration

## Goal

Format and validate the Terraform configuration, review the execution plan, and provision the Azure infrastructure.

### Evidence

#### Screenshot 4 — End of the `terraform apply` output showing `Apply complete!` with no errors

[End of the `terraform apply` output showing `Apply complete!` with no errors](screenshots/task-35-diagram.png)

---

#### Screenshot 5 — Output of `terraform output public_ip` showing the VM’s public IP address

[Output of `terraform output public_ip` showing the VM’s public IP address](screenshots/task-36-diagram.png)

---

### Notes

Initialized HashiCorp Terraform with the aws provider and validated configuration syntax.

Executed terraform apply -auto-approve to provision the vm-mini-finance EC2 instance, security group (nsg-mini-finance), and key pair (mini-finance-key).

Verified successful output generation exposing the instance's public IPv4 address (terraform output public_ip).

---

# Task 4 — Verify Passwordless SSH Access

## Goal

Confirm that the Ansible controller can connect to the Terraform-provisioned Azure VM using SSH key authentication.

### Evidence

#### Screenshot 6 — Passwordless SSH command and the returned `mini-finance` hostname

[Passwordless SSH command and the returned `mini-finance` hostname](screenshots/task-37-diagram.png)

---

### Notes

Verified active SSH agent key loading (~/.ssh/id_ed25519).

Executed non-interactive SSH authentication against the newly provisioned Ubuntu instance using ubuntu default user credentials.

Confirmed passwordless remote execution reachability by querying target system hostname output.

---

# Task 5 — Create the Ansible Inventory and Verify Connectivity

## Goal

Add the Terraform-provisioned Azure VM to the Ansible inventory and confirm that Ansible can connect to it.

### Evidence

#### Screenshot 7 — Ansible ping output showing `SUCCESS` and `pong` from the Azure VM

[Ansible ping output showing `SUCCESS` and `pong` from the Azure VM](screenshots/task-38-diagram.png)

---

### Configuration File

Copy and paste the complete contents of your `ansible/inventory.ini` file below:

```ini
[web]
web1 ansible_host=98.84.126.18 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

---

# Task 6 — Create the Multi-Play Ansible Playbook

## Goal

Create one Ansible playbook containing separate plays to install Nginx, deploy the Mini Finance website, and verify the deployment.

### Evidence

#### Screenshot 8 — `site.yml` showing Play 1 and the beginning of Play 2

Screenshot must show:

- Play 1 targeting the `web` group
- Installation of `nginx`, `git`, and `rsync`
- Nginx service configured as started and enabled
- Beginning of Play 2 with the Git repository URL and synchronization task

[`site.yml` showing Play 1 and the beginning of Play 2](screenshots/task-39-diagram.png)

---

#### Screenshot 9 — `site.yml` showing the deployment destination, handler, and Play 3 verification

Screenshot must show:

- Website destination `/var/www/html/`
- Ownership set to `www-data:www-data`
- Nginx reload handler
- Play 3 targeting `localhost`
- The `uri` verification and `assert` condition

[`site.yml` showing the deployment destination, handler, and Play 3 verification](screenshots/task-40-diagram.png)

---

### Configuration File

Copy and paste the complete contents of your `ansible/site.yml` file below:

```yaml
---
# ==========================================
# Play 1: Install & Configure Web Server
# ==========================================
- name: "Play 1: Install Nginx, Git, and Rsync on Web Server"
  hosts: web
  become: true
  tasks:
    - name: Update apt cache and install core dependencies
      ansible.builtin.apt:
        name:
          - nginx
          - git
          - rsync
        state: present
        update_cache: true

    - name: Ensure Nginx service is started and enabled
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

# ==========================================
# Play 2: Deploy Mini Finance Website
# ==========================================
- name: "Play 2: Clone and Deploy Mini Finance Application"
  hosts: web
  become: true
  tasks:
    - name: Clone Mini Finance repository to temporary workspace
      ansible.builtin.git:
        repo: "https://github.com/traa32/mini-finance.git"
        dest: /tmp/mini-finance
        single_branch: yes
        version: main
      register: git_clone

    - name: Synchronize web application assets to web root
      ansible.posix.synchronize:
        src: /tmp/mini-finance/
        dest: /var/www/html/
        delete: yes
      delegate_to: "{{ inventory_hostname }}"
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded

# ==========================================
# Play 3: Local HTTP Verification
# ==========================================
- name: "Play 3: Verify Web Application Deployment from Controller"
  hosts: localhost
  connection: local
  gather_facts: false
  tasks:
    - name: Perform HTTP request against deployed web application
      ansible.builtin.uri:
        url: "http://{{ hostvars['web1']['ansible_host'] }}"
        status_code: 200
      register: http_response

    - name: Assert HTTP 200 OK status code response
      ansible.builtin.assert:
        that:
          - http_response.status == 200
        success_msg: "Mini Finance application successfully verified with HTTP 200 OK!"
        fail_msg: "HTTP health check failed for Mini Finance application."
```

---

# Task 7 — Validate and Run the Ansible Playbook

## Goal

Validate the syntax of the multi-play Ansible playbook and run it to install Nginx, deploy the Mini Finance website, and verify the deployment.

### Evidence

#### Screenshot 10 — Successful playbook syntax check showing `playbook: site.yml`

[Successful playbook syntax check showing `playbook: site.yml`](screenshots/task-41-diagram.png)

---

#### Screenshot 11 — Play 3 output showing the successful HTTP verification and assertion

[Play 3 output showing the successful HTTP verification and assertion](screenshots/task-43-diagram.png)

---

#### Screenshot 12 — Final `PLAY RECAP` showing `failed=0` and `unreachable=0`

[Final `PLAY RECAP` showing `failed=0` and `unreachable=0`](screenshots/task-43-diagram.png)

---

### Notes

Executed ansible-playbook --syntax-check to validate YAML indentation and module parameter structure before runtime execution.

Ran the multi-play playbook site.yml, executing remote package installation, git cloning, and web root asset synchronization over SSH.

Verified automated integration testing in Play 3, where the controller issued an HTTP GET request to the instance's public IP and asserted a status code of 200 OK.

Confirmed idempotent play execution with zero failed tasks in the final PLAY RECAP.

---

# Task 8 — Test the Mini Finance Website in a Browser

## Goal

Confirm that the Mini Finance website is publicly accessible through the Azure VM’s public IP address.

### Evidence

#### Screenshot 13 — Mini Finance website successfully loading in the browser, with the Azure VM’s public IP address visible in the address bar

[Mini Finance website successfully loading in the browser, with the Azure VM’s public IP address visible in the address bar](screenshots/task-44-diagram.png)

---

### Website URL

Add your deployed website URL below:

```text
http://98.84.126.18
```

---

# Task 9 — Create the Project README

## Goal

Create a `README.md` file to document the Mini Finance infrastructure and deployment project.

### Evidence

#### Screenshot 14 — Completed `README.md` displayed in the VS Code Markdown preview or terminal

[Completed `README.md` displayed in the VS Code Markdown preview or terminal](screenshots/task-42-diagram.png)

---

### README Content

Copy and paste the complete contents of your `README.md` file below:

````markdown
# Mini Finance Deployment using Terraform & Ansible

**Maintainer:** Cho Kar Hin  
**Platform:** AWS EC2 (Ubuntu 24.04 LTS) / Ansible Control Node

---

## Overview

This repository provisions cloud infrastructure on AWS using Terraform and automatically deploys the **Mini Finance** web application using a 3-play Ansible playbook.

---

## Infrastructure (Terraform)

- **Compute:** 1x AWS EC2 `t3.micro` instance (`vm-mini-finance`).
- **Security Group:** `nsg-mini-finance` with Port 22 (SSH) restricted and Port 80 (HTTP) public.
- **Authentication:** ED25519 SSH Public Key (`mini-finance-key`).

---

## Configuration Management (Ansible)

- **Play 1:** Installs `nginx`, `git`, and `rsync`, and ensures systemd service activation.
- **Play 2:** Clones the Mini Finance repository and synchronizes site files to `/var/www/html/`.
- **Play 3:** Runs local controller health checks (`ansible.builtin.uri`) asserting an HTTP `200 OK` response.

---

## How to Deploy

1. **Provision Infrastructure:**
   ```bash
   cd terraform
   terraform init
   terraform apply -auto-approve
   ```
````

---

# LinkedIn Post Required

## Evidence

#### Screenshot 15 — Published LinkedIn post showing the text and at least one deployment screenshot

[ Published LinkedIn post](screenshots/task-29-diagram.png)

---

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/`

---

### LinkedIn Submission Notes

**One challenge you faced and how you fixed it:**

During the execution of the multi-play Ansible playbook, the task Clone Mini Finance repository to temporary workspace hung indefinitely. This occurred because the playbook initially referenced an incorrect repository URL, causing Ansible to wait indefinitely in the background for key/authentication prompts.

Solution: I terminated the hanging process using Ctrl + C, identified the correct public repository URL ([https://github.com/pravinmishraaws/mini_finance.git](https://github.com/pravinmishraaws/mini_finance.git)), and updated site.yml. Re-running ansible-playbook -i inventory.ini site.yml allowed the playbook to clone the repository and complete all plays successfully.

---

**One real-world example where you can use this learning:**

Real-World Example: In an enterprise environment, combining Terraform and Ansible creates an automated CI/CD infrastructure pipeline. Terraform can be used to dynamically provision web server clusters (e.g., EC2 instances behind a load balancer) in response to traffic spikes or new environment requests (staging/production). Once provisioned, Ansible automatically bootstraps those servers by installing required runtimes, pulling the latest microservices or frontend web applications from GitHub, configuring web servers like Nginx, and running health checks before adding the nodes into production.

---

# Assignment Questions

Answer the following in your own words:

**1. What did you provision using Terraform in this assignment?**

I provisioned an AWS EC2 `t3.micro` Virtual Machine (`vm-mini-finance`) running Ubuntu 24.04 LTS, an AWS Security Group (`nsg-mini-finance`) configured with inbound SSH (Port 22) and HTTP (Port 80) access, and an SSH Key Pair (`mini-finance-key`) using an ED25519 public key.

---

**2. What did Ansible configure and deploy in this assignment?**

Ansible installed system dependencies (`nginx`, `git`, `rsync`), ensured the Nginx daemon was enabled and running, cloned the Mini Finance application source code from GitHub, deployed the static files to `/var/www/html/`, and performed an automated HTTP health check verification from the control node.

---

**3. Why is SSH access on port `22` restricted to your public IP address?**

Restricting SSH access to a specific controller CIDR block enforces the principle of least privilege, preventing brute-force login attempts and unauthorized administrative access from arbitrary internet hosts.

---

**4. Why is HTTP port `80` open to the internet?**

Port 80 handles standard, unencrypted HTTP traffic allowing public end-users to access and view the hosted Mini Finance web application through a browser.

---

**5. What is the purpose of the Ansible inventory file?**

The inventory file defines the managed target servers, organizes them into logical role groups (`[web]`), and stores connection metadata such as target IP addresses (`ansible_host`), default SSH users (`ansible_user`), and identity key paths (`ansible_ssh_private_key_file`).

---

**6. Why does the playbook use separate plays for install, deploy, and verify?**

Separating tasks into distinct plays enforces separation of concerns and scope modularity. Play 1 handles system-level package provisioning on target hosts, Play 2 manages application-level content deployment and handlers, and Play 3 runs local verification testing on `localhost`.

---

**7. Why is `rsync` useful when deploying website files?**

`rsync` (via `ansible.posix.synchronize`) performs efficient file transfers by checking file checksums and timestamps, transferring only modified assets while deleting stale files (`delete: yes`) to maintain exact directory mirrors.

---

**8. What does the Ansible `uri` module verify in this assignment?**

The `uri` module sends an HTTP GET request to the deployed web application's IP address and captures the HTTP status code to confirm that Nginx is serving web content successfully.

---

**9. What issue did you face during this assignment, and how did you fix it?**

An issue occurred during `inventory.ini` configuration where the literal placeholder string `<PUBLIC_IP>` was retained instead of the actual EC2 IPv4 address, causing Ansible connection errors (`hostname contains invalid characters`). Replacing the placeholder string with the true `terraform output public_ip` resolved the connection failure.

---

**10. What did you learn from using Terraform and Ansible together?**

I learned the power of combining Infrastructure as Code (IaC) with Configuration Management: Terraform excels at provisioning cloud infrastructure, while Ansible excels at configuring operating systems, deploying software artifacts, and verifying service health once the infrastructure exists.

---

# Required Files

Confirm that the following files are included in your assignment folder:

- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `terraform/providers.tf`
- [ ] `terraform/main.tf`
- [ ] `terraform/variables.tf`
- [ ] `terraform/outputs.tf`
- [ ] `ansible/inventory.ini`
- [ ] `ansible/site.yml`

---

# Submission Instructions

- Add all required screenshots in the correct order.
- Full Name must be visible in required screenshots.
- Add the Azure VM public IP address.
- Add the final Mini Finance website URL.
- Paste `inventory.ini`, `site.yml`, and `README.md` as editable text.
- Answer all assignment questions clearly in your own words.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, passwords, Azure credentials, subscription IDs, Terraform state contents, or other sensitive information.
- Submit only one Google Doc link.
- Ensure that anyone with the link can view the document.
- Test the Google Doc link in an incognito or private browser window before submitting.

---

# Completion Checklist

- [ ] Task 1: `mini-finance` project structure created
- [ ] Task 1: `.gitignore` created
- [ ] Task 2: Terraform Azure infrastructure code created
- [ ] Task 2: `Allow-SSH` rule configured for port `22`
- [ ] Task 2: `Allow-HTTP` rule configured for port `80`
- [ ] Task 2: NSG associated with the Network Interface
- [ ] Task 3: `terraform fmt` completed
- [ ] Task 3: `terraform init` completed
- [ ] Task 3: `terraform validate` completed successfully
- [ ] Task 3: `terraform apply` completed successfully
- [ ] Task 3: `terraform output public_ip` displayed the VM public IP
- [ ] Task 4: Passwordless SSH works from the Ansible controller
- [ ] Task 5: `inventory.ini` created
- [ ] Task 5: Ansible ping returns `SUCCESS` and `pong`
- [ ] Task 6: `site.yml` contains three separate plays
- [ ] Task 6: Play 1 installs Nginx, Git, and rsync
- [ ] Task 6: Play 2 clones and deploys the Mini Finance website
- [ ] Task 6: Play 3 verifies HTTP status code `200`
- [ ] Task 7: Playbook syntax check passes
- [ ] Task 7: Ansible playbook completes successfully
- [ ] Task 7: Final recap shows `failed=0` and `unreachable=0`
- [ ] Task 8: Mini Finance website loads in the browser
- [ ] Task 8: Azure VM public IP is visible in the browser screenshot
- [ ] Task 9: `README.md` completed
- [ ] Screenshots 1–15 are included
- [ ] `inventory.ini`, `site.yml`, and `README.md` are pasted as editable text
- [ ] Assignment questions are answered
- [ ] LinkedIn post published with Anyone visibility
- [ ] LinkedIn post URL added
- [ ] No sensitive information is exposed
- [ ] Google Doc is accessible

---

## About DMI & CloudAdvisory

DevOps Micro Internship (DMI) is a project-based DevOps program run by Pravin Mishra and The CloudAdvisory, focused on real-world execution, systems thinking, and career readiness.

It helps learners build strong DevOps foundations with hands-on experience.

---

## Resources

- DMI Official Website: [https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme](https://dmi.pravinmishra.com?utm_source=github&utm_medium=readme)
- University: [https://university.pravinmishra.com?utm_source=github&utm_medium=readme](https://university.pravinmishra.com?utm_source=github&utm_medium=readme)
- Discord Community: [https://discord.pravinmishra.com?utm_source=github&utm_medium=readme](https://discord.pravinmishra.com?utm_source=github&utm_medium=readme)
- Blog: [https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme](https://dmi.pravinmishra.com/blog?utm_source=github&utm_medium=readme)
- YouTube Playlist: [https://www.youtube.com/playlist?list=PLFeSNDtI4Cho](https://www.youtube.com/playlist?list=PLFeSNDtI4Cho)
- Pravin Mishra LinkedIn: [https://www.linkedin.com/in/pravin-mishra-aws-trainer/](https://www.linkedin.com/in/pravin-mishra-aws-trainer/)
- CloudAdvisory LinkedIn: [https://www.linkedin.com/company/thecloudadvisory/](https://www.linkedin.com/company/thecloudadvisory/)

---

_This submission is part of DevOps Micro Internship (DMI) Cohort 3 — Agentic AI Track._
