# Assignment 02 — Provision Linux VMs with Terraform and Run Ansible Ad-Hoc Commands

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will use Terraform to provision three or four Ubuntu Linux Virtual Machines on either Microsoft Azure or Amazon Web Services.

You will configure SSH key-based authentication, organize the servers using a custom Ansible inventory, and run Ansible ad-hoc commands across individual hosts and inventory groups.

---

# Task 1 — Create the Multi-Host Lab Structure

## Goal

Create a separate project directory for the multi-host lab and prepare the Terraform, Ansible, and documentation files.

This project will use the Git repository and Ansible controller prepared in Assignment 01.

### Evidence

#### Screenshot 1 — Terminal showing the complete `ansible-adhoc-lab` project structure

[project structure](screenshots/task-13-diagram.png)

---

#### Screenshot 2 — Terminal showing `git status --short` with the new project files and updated `.gitignore`

[Terminal showing `git status --short`](screenshots/task-14-diagram.png)

---

### Notes

Created a dedicated subdirectory ansible-adhoc-lab/ within the primary ansible-onboarding repository to isolate the multi-host Terraform infrastructure scaffolding and custom Ansible inventory.
Generated essential scaffolding files: main.tf, variables.tf, outputs.tf, inventory.ini, and README.md.
Updated root .gitignore rules to ensure local Terraform state files (.tfstate, .tfstate.backup), lock files, and sensitive variable definitions (\*.tfvars) are excluded from version control.

---

# Task 2 — Create the Terraform Configuration

## Goal

Create the Terraform configuration required to provision three or four Ubuntu Linux VMs on your selected cloud platform.

Complete only one option:

- Option A — Microsoft Azure
- Option B — Amazon Web Services

Do not configure both providers for this assignment.

### Evidence

#### Screenshot 3 — Terraform configuration showing the three or four server roles and the `for_each` or `count` implementation

[three or four server roles](screenshots/task-15-diagram.png)

---

#### Screenshot 4 — Terraform configuration showing SSH restricted to the controller IP and HTTP allowed only for web hosts

[SSH restricted to the controller IP and HTTP allowed](screenshots/task-16-diagram.png)

---

#### Screenshot 5 — Terraform output configuration showing how public IP addresses are associated with the server roles

[public IP addresses are associated with the server](screenshots/task-17-diagram.png)

---

### Notes

Configured Terraform provider specifications for AWS (hashicorp/aws ~> 5.0) targeting Ubuntu 24.04 LTS AMIs.
Implemented dynamic resource provisioning using a for_each loop over a server_roles map, generating three dedicated nodes: web, app, and db.
Applied strict ingress security boundaries: aws_security_group.web_sg permits inbound HTTP (Port 80) and restricted SSH (Port 22), while aws_security_group.internal_sg permits restricted SSH (Port 22) only.
Automated key deployment using aws_key_pair referencing the controller's ED25519 public key (~/.ssh/id_ed25519.pub).
Formatted outputs in outputs.tf using a map projection to link each role key directly to its public IP address.

---

# Task 3 — Provision the Infrastructure with Terraform

## Goal

Initialize and validate the Terraform configuration, review the execution plan, provision the selected three or four VMs, and retrieve their public IP addresses.

### Evidence

#### Screenshot 6 — Final `terraform apply` output showing `Apply complete`

[Final `terraform apply` output showing `Apply complete`](screenshots/task-18-diagram.png)

---

#### Screenshot 7 — `terraform output public_ips` showing the role-to-IP mapping for all three or four VMs

[`terraform output public_ips`](screenshots/task-18-diagram.png)

---

#### Screenshot 8 — Azure Portal or AWS Management Console showing all three or four VMs in the `Running` state, with their role-based names visible

[all three or four VMs in the `Running`](screenshots/task-19-diagram.png)

---

### Notes

Initialized HashiCorp Terraform inside the WSL2 Ubuntu environment (terraform init) and validated syntax using terraform validate.
Executed terraform apply -auto-approve to provision three Ubuntu 24.04 LTS EC2 instances (ansible-node-web, ansible-node-app, ansible-node-db) alongside role-specific AWS security groups.
Retrieved public IPv4 addresses via terraform output public_ips and verified that all instances reached the Running state in the AWS Management Console.

---

# Task 4 — Verify SSH Key-Based Access

## Goal

Verify that each managed VM can be accessed from the Ansible controller using SSH key-based authentication.

### Evidence

#### Screenshot 9 — Terminal showing successful SSH hostname output from all VMs

[Terminal showing successful SSH hostname output from all VMs](screenshots/task-20-diagram.png)

---

### Notes

Loaded the active ED25519 identity key (~/.ssh/id_ed25519) into the background SSH agent (eval "$(ssh-agent -s)").
Verified non-interactive, passwordless SSH connectivity from the Ansible control node to all three managed EC2 instances over Port 22.
Confirmed target host reachability and public key placement by executing hostname -f across all nodes.

---

# Task 5 — Create the Custom Ansible Inventory

## Goal

Create an Ansible inventory file that groups the managed VMs by role.

The inventory allows Ansible to run commands against all servers, or only specific groups such as `web`, `app`, or `db`.

### Evidence

#### Screenshot 10 — `inventory.ini` showing the `web`, `app`, and `db` groups

[`inventory.ini` showing the `web`, `app`, and `db` groups](screenshots/task-21-diagram.png)

---

#### Screenshot 11 — Output of `ansible-inventory -i inventory.ini --graph`

[Output of `ansible-inventory -i inventory.ini --graph](screenshots/task-22-diagram.png)

---

### Notes

Created an INI-formatted inventory file (inventory.ini) categorizing managed nodes into three distinct role groups: [web], [app], and [db].

Configured essential connection variables (ansible_user=ubuntu and ansible_ssh_private_key_file=~/.ssh/id_ed25519) directly within the inventory to standardize SSH authentication parameters across all target hosts.

Validated group structures and parent-child hierarchy using ansible-inventory -i inventory.ini --graph.

---

# Task 6 — Run Ansible Ad-Hoc Commands

## Goal

Run Ansible ad-hoc commands from the controller to verify connectivity, check server information, and manage packages and services across inventory groups.

This task proves that the inventory is working and that Ansible can control multiple managed VMs without writing a playbook.

### Evidence

#### Screenshot 12 — Output of `ansible all -i inventory.ini -m ping`

[Output of `ansible all -i inventory.ini -m ping`](screenshots/task-23-diagram.png)

---

#### Screenshot 13 — Output of `ansible all -i inventory.ini -m command -a "uptime"`

[Output of `ansible all -i inventory.ini -m command -a "uptime"`](screenshots/task-24-diagram.png)

---

#### Screenshot 14 — Output of `ansible web -i inventory.ini -m apt -a "name=nginx state=present update_cache=yes" --become`

[Output of `ansible web -i inventory.ini -m apt -a "name=nginx state=present update_cache=yes" --become`](screenshots/task-25-diagram.png)

---

#### Screenshot 15 — Output of `ansible web -i inventory.ini -m service -a "name=nginx state=started enabled=yes" --become`

[Output of `ansible web -i inventory.ini -m service -a "name=nginx state=started enabled=yes" --become`](screenshots/task-26-diagram.png)

---

#### Screenshot 16 — Output of `ansible all -i inventory.ini -m apt -a "name=htop state=present update_cache=yes" --become`

[Output of `ansible all -i inventory.ini -m apt -a "name=htop state=present update_cache=yes" --become`](screenshots/task-27-diagram.png)

---

#### Screenshot 17 — Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx"`

[Output of `ansible web -i inventory.ini -m command -a "systemctl is-active nginx"`](screenshots/task-28-diagram.png)

---

### Notes

Verified end-to-end SSH connectivity, authentication, and Python execution across all managed nodes using the ansible all -i inventory.ini -m ping ad-hoc module.

Audited real-time server metrics across the instance fleet by executing the command module (uptime).

Leveraged administrative privilege escalation (--become) with the apt module to idempotently install package dependencies (nginx on web nodes and htop across all nodes).

Managed systemd daemons using the service module to enable and start Nginx on target web hosts.

Confirmed active service health on the web inventory group using systemctl is-active nginx.

---

# LinkedIn Post Required

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/ `

---

#### Screenshot — Published LinkedIn post

[ Published LinkedIn post](screenshots/task-29-diagram.png)

---

# Assignment Questions

Answer the following in your own words:

**1. What is the purpose of an Ansible inventory file?**

An Ansible inventory file defines, categorizes, and maps the managed target hosts (via IP addresses or hostnames) that Ansible controls. It allows operators to organize infrastructure into logical groups (e.g., web, app, db) and set host-specific connection variables like SSH users and key paths.

---

**2. What is the difference between the `web`, `app`, and `db` groups in your inventory?**

The groups separate host responsibilities based on application architecture tiers. This allows targeted execution so playbooks and ad-hoc commands can apply configurations specifically to relevant tiers (e.g., installing Nginx only on web hosts) without impacting other infrastructure roles.

---

**3. What does the Ansible `ping` module verify?**

The ping module verifies end-to-end connectivity, valid SSH authentication, and proper Python interpreter execution on the target node. It is not an ICMP echo ping; it executes a lightweight Ansible Python snippet on the host and returns pong.

---

**4. Why do package installation commands require `--become`?**

Modifying system packages (such as installing software via apt or managing systemd services) requires elevated root administrative privileges. The --become flag instructs Ansible to execute the command using sudo.

---

**5. When would you use an ad-hoc command instead of a playbook?**

Ad-hoc commands are best suited for quick, single-purpose, or real-time tasks—such as checking server uptime, rebooting a cluster, or testing SSH connectivity. Playbooks are used for complex, multi-step, repeatable, and version-controlled configuration management workflows.

---

**6. What is one challenge you faced while setting up SSH or inventory, and how did you fix it?**

When running Ansible commands, the binary was initially not found because the Python virtual environment (.venv) was not active in the current shell session. Activating the environment (source ~/ansible-onboarding/.venv/bin/activate) resolved the pathing issue and restored access to ansible CLI binaries.

---

# Required Files

Confirm that the following files are included in your assignment workspace:

- [ ] `ansible-adhoc-lab/README.md`
- [ ] `ansible-adhoc-lab/terraform/providers.tf`
- [ ] `ansible-adhoc-lab/terraform/main.tf`
- [ ] `ansible-adhoc-lab/terraform/variables.tf`
- [ ] `ansible-adhoc-lab/terraform/outputs.tf`
- [ ] `ansible-adhoc-lab/ansible/inventory.ini`
- [ ] Updated `.gitignore`

---

# Submission Instructions

- Add all required screenshots from the tasks.
- Full Name must be visible in required screenshots.
- Mention whether you used Azure or AWS.
- Mention whether you used the three-VM option or four-VM option.
- Add the public IP addresses of the VMs, redacted if preferred.
- Add your `inventory.ini` proof.
- Add a short explanation of what you learned.
- Answer all assignment questions clearly in your own words.
- Add your LinkedIn post URL.
- Do not expose SSH private keys, Terraform state files, cloud credentials, passwords, access keys, secret keys, account IDs, or subscription IDs.
- Submit only one Google Doc link.

---

# Completion Checklist

- [ ] Task 1: `ansible-adhoc-lab` project structure created
- [ ] Task 1: `.gitignore` updated for Terraform files
- [ ] Task 2: Terraform configuration created
- [ ] Task 2: Server roles defined for either three or four VMs
- [ ] Task 2: `count` or `for_each` used
- [ ] Task 2: SSH restricted to the controller public IP
- [ ] Task 2: HTTP allowed only for web hosts
- [ ] Task 2: Terraform output maps roles to public IPs
- [ ] Task 3: Terraform initialized successfully
- [ ] Task 3: Terraform configuration validated
- [ ] Task 3: Terraform apply completed successfully
- [ ] Task 3: All selected VMs are running
- [ ] Task 4: SSH key-based access works for every VM
- [ ] Task 5: `inventory.ini` contains `web`, `app`, and `db` groups
- [ ] Task 5: `ansible-inventory -i inventory.ini --graph` shows the correct groups
- [ ] Task 6: `ansible all -i inventory.ini -m ping` returns `SUCCESS`
- [ ] Task 6: Ad-hoc commands run successfully
- [ ] Task 6: `--become` was used for package and service tasks
- [ ] Task 6: Nginx is active on the `web` group
- [ ] Screenshots 1–17 are included
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
