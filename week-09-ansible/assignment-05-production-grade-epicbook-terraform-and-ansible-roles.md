# Assignment — Deploy EpicBook with Terraform and Ansible Roles

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will deploy the EpicBook web application using Terraform and Ansible roles.

Terraform provisions the cloud infrastructure, including one Ubuntu VM and one managed MySQL database. Ansible roles configure the VM, install required software, deploy the EpicBook application, configure Nginx, connect the app to the managed MySQL database, and verify the deployment.

---

# Task 1 — Set Up the Project Folder Layout

## Goal

Create the project folder structure for Terraform and Ansible roles.

Terraform will be used to provision the cloud infrastructure. Ansible roles will be used to configure the VM and deploy the EpicBook application.

### Evidence

#### Screenshot 1 — Terminal showing the completed `epicbook-prod` project structure

[Terminal showing the completed `epicbook-prod` project structure](screenshots/task-45-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Which cloud provider did you choose for this assignment?**

AWS (Amazon Web Services), utilizing EC2 for compute and Amazon RDS for managed MySQL.

---

**2. Why is it useful to keep Terraform files and Ansible files in separate folders?**

Decoupling infrastructure provisioning (terraform/) from configuration management (ansible/) maintains strict separation of concerns. This allows infrastructure engineers to modify compute/network topologies without touching application playbooks, and enables configuration code to remain portable across different cloud providers.

---

**3. What is the purpose of the `roles` directory in Ansible?**

The roles directory organizes tasks, templates, handlers, and variables into modular, reusable units. Instead of placing hundreds of lines of code into a single monolithic playbook, roles break down logic into self-contained service components (common, nginx, epicbook) that can be individually tested, maintained, and reused across different projects.

---

# Task 2 — Provision the Infrastructure with Terraform

## Goal

Run Terraform to provision the cloud infrastructure for the EpicBook deployment.

Terraform will create the VM, managed MySQL database, networking, security rules, and required outputs.

### Evidence

#### Screenshot 2 — `terraform apply` completed successfully

[`terraform apply` completed successfully](screenshots/task-46-diagram.png)

---

#### Screenshot 3 — Output of `terraform output`

[Output of `terraform output`](screenshots/task-47-diagram.png)

---

#### Screenshot 4 — Azure Portal or AWS Console showing the VM running

[Azure Portal or AWS Console showing the VM running](screenshots/task-48-diagram.png)

---

#### Screenshot 5 — Azure Portal or AWS Console showing the managed MySQL database created

[Azure Portal or AWS Console showing the managed MySQL database created](screenshots/task-49-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What resources did Terraform create for this assignment?**

Terraform created an AWS EC2 t3.micro instance (vm-epicbook), an Amazon RDS MySQL 8.0 instance (rds-epicbook), an SSH Key Pair (epicbook-key), two Security Groups (sg-epicbook-web allowing ports 22, 80, and 8080, and sg-epicbook-rds restricting port 3306 access exclusively to the web VM), and an RDS DB Subnet Group.

---

**2. Why should you review `terraform plan` before running `terraform apply`?**

Reviewing terraform plan allows developers and SREs to dry-run changes before modifying cloud infrastructure. It acts as a safety gate to verify exactly which resources will be created, updated, or destroyed, preventing unintentional resource deletions or misconfigurations.

---

**3. Why should database passwords not be shown in Terraform output?**

Database passwords are sensitive credentials. Marking variables or outputs as sensitive = true prevents clear-text passwords from leaking into CI/CD build logs, terminal screens, or stdout recordings, keeping access controlled.

---

# Task 3 — Verify SSH Key-Based Access

## Goal

Verify that the cloud VM can be accessed from the Ansible controller using SSH key-based authentication.

### Evidence

#### Screenshot 6 — Successful SSH hostname check from the Ansible controller

[Successful SSH hostname check from the Ansible controller](screenshots/task-50-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What command did you use to verify SSH access?**

ssh -o StrictHostKeyChecking=accept-new ubuntu@<public_ip> "hostname"

---

**2. What proves that SSH key-based access worked successfully?**

The terminal returned the remote host's internal hostname (e.g., ip-172-31-xx-xx) without prompting for an SSH password or failing with an authentication error.

---

**3. What would you check if SSH returned `Permission denied (publickey)`?**

That the correct private key (~/.ssh/id_ed25519) is active in the ssh-agent session.

That the public key (id_ed25519.pub) was correctly injected into the EC2 instance via the aws_key_pair resource in Terraform.

That the correct default remote username (ubuntu for Ubuntu AMIs) is being used.

That file permissions on ~/.ssh/id_ed25519 are properly restricted (chmod 600).

---

# Task 4 — Create the Ansible Inventory and Configuration

## Goal

Create the Ansible inventory file and local Ansible configuration for the EpicBook VM.

The inventory tells Ansible which VM to manage and which SSH user to use.

### Evidence

#### Screenshot 7 — `inventory.ini` showing the VM under the `web` group

[`inventory.ini` showing the VM under the `web` group](screenshots/task-51-diagram.png)

---

#### Screenshot 8 — Output of `ansible-inventory -i inventory.ini --graph`

[Output of `ansible-inventory -i inventory.ini --graph](screenshots/task-52-diagram.png)

---

#### Screenshot 9 — Output of `ansible web -i inventory.ini -m ping`

[Output of `ansible-inventory -i inventory.ini --graph](screenshots/task-53-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is the purpose of `inventory.ini`?**

inventory.ini defines the managed nodes that Ansible controls, organizes them into logical role-based groups (such as [web]), and declares connection parameters required to reach each host over SSH.

---

**2. What does `ansible_host` store?**

ansible_host stores the actual IPv4 address or FQDN that Ansible uses to open the SSH connection to the managed host, decoupling the human-readable inventory alias (web1) from the underlying server IP.

---

**3. What does `ansible_ssh_private_key_file` tell Ansible?**

It specifies the exact path on the controller filesystem to the SSH private key (~/.ssh/id_ed25519) used for public key authentication on the target host.

---

**4. Why is `host_key_checking = False` used only for this temporary lab?**

Setting host_key_checking = False disables host key verification against known_hosts, allowing automated playbooks to connect to dynamically provisioned, short-lived VMs without manual interactive prompts. In production, host key checking is kept enabled to protect against Man-In-The-Middle (MITM) attacks.

---

# Task 5 — Create the Main Ansible Playbook

## Goal

Create the main Ansible playbook that runs the required roles in the correct order.

The `site.yml` file will call the `common`, `nginx`, and `epicbook` roles.

### Evidence

#### Screenshot 10 — `site.yml` showing the roles in the correct order

[`site.yml` showing the roles in the correct order](screenshots/task-54-diagram.png)

---

#### Screenshot 11 — Output of `ansible-playbook -i inventory.ini site.yml --syntax-check`

[Output of `ansible-playbook -i inventory.ini site.yml --syntax-check`](screenshots/task-55-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is the purpose of `site.yml`?**

site.yml is the master orchestration playbook. It acts as the central entry point that ties target host groups (web) to execution roles (common, nginx, epicbook), defining execution order, privilege settings, and global play parameters.

---

**2. Why should the roles run in the order `common`, `nginx`, and `epicbook`?**

Running roles in this sequence respects application dependencies:

common prepares system prerequisites, base packages (curl, git, mysql-client), and environment dependencies.

nginx installs the web server and configures reverse proxy rules listening on port 80.

epicbook deploys the Node.js application codebase, manages environment configuration, and starts the process on port 8080 under PM2—allowing Nginx to immediately begin proxying traffic.

---

**3. What does `become: true` allow Ansible to do?**

become: true instructs Ansible to escalate user privileges (typically via sudo) on the target host, permitting tasks to perform administrative actions such as installing system packages, modifying protected configuration files in /etc/, and managing systemd services.

---

# Task 6 — Create the `common` Role

## Goal

Create the `common` role to prepare the Ubuntu VM with the basic packages required for the EpicBook deployment.

This role handles the common server setup before Nginx and the application are configured.

### Evidence

#### Screenshot 12 — `roles/common/tasks/main.yml` showing the common setup tasks

[`roles/common/tasks/main.yml` showing the common setup tasks](screenshots/task-56-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is the responsibility of the `common` role?**

The common role handles foundational operating system setup. It updates package repositories and installs essential utilities (git, curl, mysql-client) required across all managed servers regardless of their application tier.

---

**2. Why should Nginx installation not be placed inside the `common` role?**

Placing Nginx inside the common role breaks the principle of modularity. The common role applies universally to all server types (including database or backend nodes that may not run web servers). Nginx belongs in its dedicated nginx role so web proxy services are installed only on designated web hosts.

---

**3. Why is `mysql-client` useful in this deployment?**

mysql-client provides CLI binaries (like mysql and mysqldump) on the web server. This allows administrators or deployment scripts to test direct database connectivity, execute migrations, or run database seed scripts against the remote Amazon RDS MySQL instance over port 3306.

---

# Task 7 — Create the `nginx` Role

## Goal

Create the `nginx` role to install Nginx and configure it as a reverse proxy for the EpicBook application.

Nginx will receive browser traffic on port `80` and forward it to the EpicBook Node.js application running on the VM.

### Evidence

#### Screenshot 13 — `roles/nginx/tasks/main.yml` showing Nginx installation and site configuration tasks

[`roles/nginx/tasks/main.yml` showing Nginx installation and site configuration tasks](screenshots/task-57-diagram.png)

---

#### Screenshot 14 — `roles/nginx/templates/epicbook.conf.j2` showing the reverse proxy configuration

[`roles/nginx/templates/epicbook.conf.j2` showing the reverse proxy configuration](screenshots/task-58-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is the responsibility of the `nginx` role?**

The nginx role installs and manages the Nginx web server daemon, configures site routing parameters, sets up reverse proxy headers, and ensures Nginx automatically starts on system boot.

---

**2. Why is Nginx configured as a reverse proxy in this deployment?**

Running Node.js application servers directly on privileged port 80 requires elevated root permissions, exposing security risks. Nginx sits in front on port 80 to handle client SSL/TLS termination, static asset caching, request buffering, and rate limiting—proxying clean HTTP requests internally to the unprivileged Node.js application running on port 8080.

---

**3. Why should the application port come from `group_vars/web.yml` instead of being hard-coded?**

Referencing {{ app_port }} via group_vars/web.yml decouples configuration logic from template definitions. If the application port changes in the future (e.g., from 8080 to 3000), updating a single variable updates all associated task templates without modifying individual role files.

---

# Task 8 — Create the `epicbook` Role

## Goal

Create the `epicbook` role to deploy the EpicBook application, connect it to the managed MySQL database, and run the application on port `8080` using PM2.

### Evidence

#### Screenshot 15 — `roles/epicbook/tasks/main.yml` showing application deployment tasks

[`roles/epicbook/tasks/main.yml` showing application deployment tasks](screenshots/task-59-diagram.png)

---

#### Screenshot 16 — Task or file showing how the database connection is configured, with secrets hidden

[Task or file showing how the database connection is configured, with secrets hidden](screenshots/task-60-diagram.png)

---

#### Screenshot 17 — Task or output showing the EpicBook application managed by PM2

[Task or output showing the EpicBook application managed by PM2](screenshots/task-60-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is the responsibility of the `epicbook` role?**

The epicbook role installs runtime execution dependencies (Node.js and PM2), clones the web application repository, renders environment configuration variables (.env), installs npm package dependencies, initializes database schema tables on RDS, and manages the daemon execution lifecycle of the Node.js app using PM2.

---

**2. Why is PM2 used for the EpicBook Node.js application?**

Node.js by default runs single-threaded in the foreground. PM2 acts as a production process manager that daemonizes application processes in the background, enables automatic process restarts upon unhandled crashes or system reboots, and provides live logging and process monitoring.

---

**3. Why should database passwords not be hard-coded in public files?**

Hard-coding plain-text database credentials into source code or public playbooks exposes critical infrastructure to credential theft, unauthorized database dumps, or malicious data corruption when code is committed to version control systems like GitHub.

---

**4. What does it mean for the application to run on port `8080` while Nginx listens on port `80`?**

It represents a reverse-proxy architecture: Nginx acts as the public-facing HTTP gateway on standard web port 80. When external clients send requests to port 80, Nginx proxies those incoming requests internally to the Node.js application listening locally on port 8080 (127.0.0.1:8080), isolating the application execution layer from direct internet exposure.

---

# Task 9 — Create Group Variables

## Goal

Create reusable variables for the EpicBook deployment.

The `group_vars/web.yml` file stores values that can be reused across the Ansible roles.

### Evidence

#### Screenshot 18 — `group_vars/web.yml` showing the application, PM2, and database variables, with passwords hidden or masked

[`group_vars/web.yml` showing the application, PM2, and database variables, with passwords hidden or masked](screenshots/task-61-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is the purpose of `group_vars/web.yml`?**

group_vars/web.yml centralizes configuration variables for all target hosts belonging to the web inventory group. It separates data/variables from code/tasks, keeping playbooks clean and reusable across different environments (development, staging, production).

---

**2. Which values did you store in `group_vars/web.yml`?**

I stored application and database runtime variables: app_port (8080), db_host (Amazon RDS endpoint), db_user (epicbookadmin), db_pass (master database password), and db_name (epicbookdb).

---

**3. How did you handle the database password securely?**

The database password was declared as a variable in group_vars/web.yml rather than hard-coded into playbooks or source code files. For production deployments, this file can be encrypted using Ansible Vault (ansible-vault encrypt group_vars/web.yml) to prevent plaintext credential leaks in git repositories.

---

# Task 10 — Run the Ansible Playbook

## Goal

Run the Ansible playbook to configure the VM and deploy the EpicBook application.

The playbook should run the roles in this order:

1. `common`
2. `nginx`
3. `epicbook`

### Evidence

#### Screenshot 19 — Ansible playbook output showing the roles running

[Ansible playbook output showing the roles running](screenshots/task-62-diagram.png)

---

#### Screenshot 20 — Final Ansible recap showing `failed=0`

[Final Ansible recap showing `failed=0`](screenshots/task-63-diagram.png)

---

#### Screenshot 21 — Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx" --become`

[Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx" --become`](screenshots/task-64-diagram.png)

---

#### Screenshot 22 — Output of `ansible web -i inventory.ini -m command -a "pm2 status"`

[Output of `ansible web -i inventory.ini -m command -a "pm2 status"`](screenshots/task-65-diagram.png)

---

#### Screenshot 23 — Output of `ansible web -i inventory.ini -m command -a "curl -I http://localhost:8080"`

[Output of `ansible web -i inventory.ini -m command -a "curl -I http://localhost:8080"](screenshots/task-66-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What command did you run to execute the Ansible playbook?**

ansible-playbook -i inventory.ini site.yml

---

**2. How do you know all roles completed successfully?**

The final PLAY RECAP output at the end of the playbook execution showed failed=0 and unreachable=0 for all target hosts, indicating every task across common, nginx, and epicbook finished with status ok or changed.

---

**3. What proves that Nginx is active?**

Running the ad-hoc Ansible command ansible web -i inventory.ini -m command -a "systemctl is-active nginx" --become

---

**4. What proves that PM2 is managing the EpicBook application?**

Running ansible web -i inventory.ini -m shell -a "pm2 status" --become showed the epicbook process listed with a status of online.

---

**5. What proves that the EpicBook application responds on port `8080`?**

Executing ansible web -i inventory.ini -m command -a "curl -I http://localhost:8080" returned an HTTP/1.1 200 OK header response directly from the Node.js application server.

---

# Task 11 — Verify the EpicBook Deployment

## Goal

Verify that the EpicBook application is running, accessible in the browser, and connected to the managed MySQL database.

### Evidence

#### Screenshot 24 — Output of `curl -I http://<public_ip>`

[Output of `curl -I http://<public_ip>`](screenshots/task-67-diagram.png)

---

#### Screenshot 25 — Output of the cart API test command

[Output of the cart API test command](screenshots/task-68-diagram.png)

---

#### Screenshot 26 — Output of the `/cart` HTTP status check

[Output of the `/cart` HTTP status check](screenshots/task-69-diagram.png)

---

#### Screenshot 27 — Browser showing the EpicBook application loaded from `http://<public_ip>`

[Output of the `/cart` HTTP status check](screenshots/task-70-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What HTTP response did you receive from the public application URL?**

HTTP/1.1 200 OK

---

**2. What did the cart API test prove?**

Querying curl -s http://<public_ip>/api/cart returned a valid JSON response populated from the database, proving that the Node.js backend successfully authenticated with and retrieved data from the Amazon RDS MySQL instance over port 3306.

---

**3. What did the `/cart` status check return?**

HTTP/1.1 200 OK

---

**4. What issue did you face during verification, and how did you fix it?**

Initial requests to the public IP returned the default Welcome to nginx! landing page and 404 Not Found errors for /cart because Nginx's default site configuration (/etc/nginx/sites-enabled/default) was taking precedence. I resolved this by updating roles/nginx/tasks/main.yml to explicitly remove the default configuration file, ensure epicbook.conf was properly symlinked, and restart the Nginx daemon.

---

# LinkedIn Post Required

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/`

---

#### Screenshot — Published LinkedIn post

[ Published LinkedIn post](screenshots/task-29-diagram.png)

---

# Assignment Questions

Answer the following in your own words:

**1. Why is Terraform used for infrastructure provisioning?**

Terraform uses declarative Infrastructure as Code (IaC) to automate the creation, modification, and destruction of cloud resources across providers like AWS. It tracks state, calculates resource dependencies, and ensures repeatable, audit-ready deployments without manual web console intervention.

---

**2. Why are Ansible roles useful for production-style deployments?**

Ansible roles structure playbooks into modular, self-contained directories (tasks, templates, handlers, vars). This separation prevents monolithic code, allows individual components (like nginx or database setups) to be reused across projects, and makes complex configuration management easier to test and maintain.

---

**3. What is the purpose of `group_vars/web.yml`?**

configuration parameters and environment variables (such as application ports, database hostnames, and credentials) for all target nodes in the web inventory group. This decouples variable declarations from playbook task execution logic.

---

**4. Why should database passwords not be committed to GitHub?**

Committing plaintext credentials to version control exposes private infrastructure to public indexing, unauthorized database access, data theft, and automated abuse. Sensitive values should be injected via environment variables or encrypted using tools like Ansible Vault.

---

**5. What is the purpose of Nginx in this deployment?**

Nginx serves as a reverse proxy web server listening on public port 80. It handles incoming HTTP requests from users, terminates connections, manages headers, and routes traffic internally to the unprivileged Node.js application running on port 8080.

---

**6. Why should the managed MySQL database not be publicly accessible?**

Setting publicly_accessible = false isolates the Amazon RDS instance inside private network boundaries. Restricting inbound traffic exclusively to the web server's security group over port 3306 prevents public port scans and brute-force attacks from the open internet.

---

**7. Why is PM2 used for the EpicBook Node.js application?**

PM2 is a production process manager that daemonizes the Node.js application in the background, keeps it running across terminal sessions, automatically restarts it if it crashes, manages process logs, and enables automatic application startup on server reboot.

---

**8. What does idempotency mean in Ansible?**

Idempotency means that running a playbook multiple times against a system will produce the exact same end state. If a system is already in the desired state, Ansible detects this and makes no changes, preventing unintended side effects.

---

**9. What issue did you face during the deployment, and how did you fix it?**

The EpicBook application initially failed to connect to the database (ECONNREFUSED 127.0.0.1:3306) because Sequelize was looking for config/config.json. I created a config.json.j2 template mapped to {{ db_host }} and updated roles/epicbook/tasks/main.yml to deploy this file, allowing the application to successfully connect to Amazon RDS.

---

**10. What security improvement would you make before using this setup in production?**

I would configure SSL/TLS encryption via Let's Encrypt (Certbot) on Nginx to enforce HTTPS, encrypt group_vars/web.yml using Ansible Vault, restrict SSH access (port 22) to a specific VPN or bastion host IP address, and place the web EC2 instance behind an Application Load Balancer (ALB) inside a private subnet.

---

# Required Files

Confirm that the following files are included in your GitHub repository or assignment folder:

- [ ] `README.md`
- [ ] Terraform files under either `terraform/azure/` or `terraform/aws/`
- [ ] `ansible/ansible.cfg`
- [ ] `ansible/inventory.ini`
- [ ] `ansible/site.yml`
- [ ] `ansible/group_vars/web.yml`
- [ ] `ansible/roles/common/tasks/main.yml`
- [ ] `ansible/roles/nginx/tasks/main.yml`
- [ ] `ansible/roles/nginx/templates/epicbook.conf.j2`
- [ ] `ansible/roles/epicbook/tasks/main.yml`

---

# Submission Instructions

- Add all required screenshots in your submission.
- Full Name must be visible in required screenshots.
- Mention the cloud provider used: Azure or AWS.
- Add the VM public IP address.
- Add the final application URL.
- Add Terraform output proof.
- Add Ansible role tree proof.
- Add all required notes and assignment question answers.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, passwords, cloud credentials, database credentials, Terraform state files, subscription IDs, or account IDs.
- Submit only your Google Doc link.

---

# Completion Checklist

- [ ] Task 1: Project folder layout created
- [ ] Task 2: Terraform infrastructure provisioned
- [ ] Task 3: SSH key-based access verified
- [ ] Task 4: Ansible inventory and configuration created
- [ ] Task 5: Main Ansible playbook created
- [ ] Task 6: `common` role created
- [ ] Task 7: `nginx` role created
- [ ] Task 8: `epicbook` role created
- [ ] Task 9: Group variables created
- [ ] Task 10: Ansible playbook run completed
- [ ] Task 11: EpicBook deployment verified
- [ ] Terraform files created under only one cloud provider folder
- [ ] One Ubuntu VM was created
- [ ] One managed MySQL database was created
- [ ] SSH port `22` is restricted to the controller public IP
- [ ] HTTP port `80` is accessible
- [ ] MySQL port `3306` is not publicly open
- [ ] `ansible web -i inventory.ini -m ping` returns `SUCCESS`
- [ ] `site.yml` calls the roles in the correct order
- [ ] Database secrets are hidden or handled securely
- [ ] Nginx is active
- [ ] PM2 shows the EpicBook application running
- [ ] EpicBook responds on port `8080`
- [ ] Public URL loads in the browser
- [ ] Cart API verification works
- [ ] Playbook completes with `failed=0`
- [ ] Screenshots 1–27 are included
- [ ] Assignment questions are answered
- [ ] LinkedIn post published
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
