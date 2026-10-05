# Assignment 5 — Deploy a Highly Available Two-Tier Application on AWS (VPC + ALB + ASG + Multi-AZ RDS)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will design and deploy a highly available two-tier web application on AWS: highly available networking across two Availability Zones, an Application Load Balancer, an Auto Scaling Group for the web tier, and a private Multi-AZ RDS database. You must prove high availability with real failure tests.

---

# Task 1 — Create HA Networking (VPC + 4 Subnets + IGW + NAT + Route Tables)

## Goal

Build a VPC (10.0.0.0/16) with two public and two private subnets across two Availability Zones, an Internet Gateway, a NAT Gateway, and the matching public/private route tables.

### Evidence

#### Screenshot 1 — VPC details showing CIDR 10.0.0.0/16

![VPC details showing CIDR 10.0.0.0/16](screenshots/task-30-diagram.png)

#### Screenshot 2 — Subnets list showing four subnets and their Availability Zones

![Subnets list showing four subnets and their Availability Zones](screenshots/task-31-diagram.png)

---

#### Screenshot 3 — Public route table showing the Internet Gateway route and both public-subnet associations

![Public route table showing the Internet Gateway route and both public-subnet associations](screenshots/task-33-diagram.png)

---

#### Screenshot 4 — Private route table showing the NAT Gateway route and both private-subnet associations

![Private route table showing the NAT Gateway route and both private-subnet associations](screenshots/task-34-diagram.png)

---

#### Screenshot 5 — NAT Gateway status showing Available and the Elastic IP

![NAT Gateway status showing Available and the Elastic IP](screenshots/task-32-diagram.png)

---

# Task 2 — Create Security Groups (ALB, EC2, RDS) with Least Privilege

## Goal

Create `ha-alb-sg` (HTTP public), `ha-web-sg` (HTTP only from `ha-alb-sg`, SSH from your IP), and `ha-db-sg` (database port only from `ha-web-sg`).

### Evidence

#### Screenshot 6 — ALB Security Group inbound rules

![ALB Security Group inbound rules](screenshots/task-35-diagram.png)

---

#### Screenshot 7 — EC2 Security Group inbound rules showing the ALB Security Group reference and SSH from your IP

![EC2 Security Group inbound rules showing the ALB Security Group reference and SSH from your IP](screenshots/task-36-diagram.png)

---

#### Screenshot 8 — RDS Security Group inbound rule showing the database port allowed only from the EC2 Security Group

![RDS Security Group inbound rule showing the database port allowed only from the EC2 Security Group](screenshots/task-37-diagram.png)

---

# Task 3 — Deploy Database Tier (RDS Multi-AZ in Private Subnets)

## Goal

Launch a private, Multi-AZ RDS database (MySQL or PostgreSQL) using the private DB Subnet Group and `ha-db-sg`.

### Evidence

#### Screenshot 9 — RDS summary showing Multi-AZ = Yes and Publicly accessible = No

![RDS summary showing Multi-AZ = Yes and Publicly accessible = No](screenshots/task-39-diagram.png)

---

#### Screenshot 10 — RDS connectivity section showing the DB Subnet Group and Security Group

![RDS connectivity section showing the DB Subnet Group and Security Group](screenshots/task-38-diagram.png)

---

# Task 4 — Build a Launch Template (User Data Installs App + Connects to DB)

## Goal

Create a Launch Template whose user data installs the web-server runtime, deploys the application, configures the database connection, and starts the required services.

### Evidence

#### Screenshot 11 — Launch Template details showing that user data exists, including a visible snippet

![Launch Template details showing that user data exists, including a visible snippet](screenshots/task-40-diagram.png)

---

#### Screenshot 12 — A running instance created from the template showing that the application responds on port 80 through a local test or browser using its public IP

![Launch Template details showing that user data exists, including a visible snippet](screenshots/task-41-diagram.png)

---

# Task 5 — Create an Application Load Balancer (ALB) Across 2 Public Subnets

## Goal

Create an internet-facing ALB across both public subnets with an HTTP listener and a healthy instance target group.

### Evidence

#### Screenshot 13 — ALB details showing two public subnets in two Availability Zones

![ALB details showing two public subnets in two Availability Zones](screenshots/task-42-diagram.png)

---

#### Screenshot 14 — Target group showing at least one healthy target

![Target group showing at least one healthy target](screenshots/task-45-diagram.png)

---

# Task 6 — Create Auto Scaling Group (ASG) in 2 Public Subnets

## Goal

Create an Auto Scaling Group from the Launch Template across both public subnets, with desired capacity 2, minimum 2, and maximum 4, registered to the ALB target group.

### Evidence

#### Screenshot 15 — Auto Scaling Group showing desired, minimum, and maximum capacity and the selected subnet Availability Zones

![Auto Scaling Group showing desired, minimum, and maximum capacity and the selected subnet Availability Zones](screenshots/task-43-diagram.png)

---

#### Screenshot 16 — EC2 instances list showing two running instances in different Availability Zones

![EC2 instances list showing two running instances in different Availability Zones](screenshots/task-44-diagram.png)

---

# Task 7 — Configure App to Use RDS + Validate Read/Write

## Goal

Confirm the application communicates with the RDS database through the ALB DNS name with at least one read and one write operation.

### Evidence

#### Screenshot 17 — Browser showing the application loaded through the ALB DNS name with the URL visible

![Browser showing the application loaded through the ALB DNS name with the URL visible](screenshots/task-46-diagram.png)

---

#### Screenshot 18 — Proof of a database write through a UI message or database query output

![Proof of a database write through a UI message or database query output](screenshots/task-47-diagram.png)

---

# Task 8 — High Availability Tests (Must Do Both)

## Goal

Test A: terminate one web instance and confirm the Auto Scaling Group replaces it automatically without interrupting the ALB.

Test B: simulate an Availability Zone impact (stop, detach, or reduce desired capacity in one AZ) and confirm the application stays available.

### Evidence

#### Screenshot 19 — EC2 showing the terminated instance and the newly launched instance; timestamps are helpful

![EC2 showing the terminated instance and the newly launched instance; timestamps are helpful](screenshots/task-48-diagram.png)

---

#### Screenshot 20 — Target group showing healthy targets after replacement

![Target group showing healthy targets after replacement](screenshots/task-49-diagram.png)

---

#### Screenshot 21 — Evidence that an instance was removed, detached, placed in Standby, or stopped in one Availability Zone

![Evidence that an instance was removed, detached, placed in Standby, or stopped in one Availability Zone](screenshots/task-50-diagram.png)

---

#### Screenshot 22 — Browser showing that the ALB DNS endpoint still works during the change

![Browser showing that the ALB DNS endpoint still works during the change](screenshots/task-51-diagram.png)

---

# Task 9 — Architecture and Test-Results Summary

## Goal

Summarize the VPC/subnet layout, the ALB and Auto Scaling Group setup, the private Multi-AZ RDS setup, and the results of both high-availability tests.

### Evidence

#### Screenshot 23 — A simple architecture diagram, which may be hand-drawn, or an AWS console overview showing the components

![ A simple architecture diagram, which may be hand-drawn, or an AWS console overview showing the components](screenshots/task-52-diagram.png)

---

### Notes

Summarize the VPC and subnets across the two Availability Zones.

A custom VPC (ha-vpc) was created with CIDR 10.0.0.0/16 spanning two Availability Zones (us-east-1a and us-east-1b). Four subnets were provisioned: two public subnets (10.0.1.0/24 and 10.0.2.0/24) with auto-assign public IPv4 enabled, and two private subnets (10.0.11.0/24 and 10.0.12.0/24) for backend isolation. An Internet Gateway (ha-igw) was attached to the VPC with a default route (0.0.0.0/0) linked to the public route table (ha-public-rt). An Elastic IP-backed NAT Gateway (ha-nat-gw) was deployed in ha-public-subnet-1, providing outbound internet access to the private subnets via the private route table (ha-private-rt).

Summarize the ALB and Auto Scaling Group setup.

An internet-facing Application Load Balancer (ha-web-alb) was deployed across both public subnets with security group ha-alb-sg accepting inbound HTTP traffic on port 80. An Auto Scaling Group (ha-web-asg) was created across both public subnets using a launch template (ha-web-template) configured with desired capacity 2, minimum 2, and maximum 4. The launch template automated the bootstrap process (Node.js runtime, EpicBook application code, database configuration, PM2 process management, and Nginx reverse proxy routing port 80 to 8080). Web instances were assigned security group ha-web-sg, which restricts HTTP port 80 traffic exclusively to incoming requests from ha-alb-sg. The ASG automatically registers instances into a target group (ha-web-tg) monitored by ALB health checks.

Summarize the private Multi-AZ RDS setup.

An Amazon RDS MySQL 8.0 instance (ha-mysql-db) was deployed in Multi-AZ configuration with public accessibility disabled. It utilizes a dedicated DB Subnet Group (ha-db-subnet-group) spanning the two private subnets (10.0.11.0/24 and 10.0.12.0/24). High availability is maintained through a synchronous standby replica in the secondary AZ (us-east-1b) with automated failover support. Access is guarded by security group ha-db-sg, which strictly limits inbound MySQL traffic on port 3306 to instances associated with ha-web-sg.

Summarize the results of both high-availability tests.

Test A (Instance Termination & Self-Healing): One active web instance in the Auto Scaling Group was terminated. The ASG detected the degraded capacity, marked the target unhealthy on the ALB target group, and automatically provisioned a replacement instance within ~60 seconds from the launch template without dropping client sessions or causing application downtime.

Test B (Availability Zone Impact Simulation): An instance residing in us-east-1a was set to Standby to simulate an AZ degradation. The ALB immediately routed all incoming HTTP requests to the healthy instance operating in us-east-1b. Continuous browser requests to the ALB DNS endpoint confirmed zero downtime, and end-to-end database connectivity remained intact throughout the shift.

---

# LinkedIn Post (Required)

## Goal

Publish a LinkedIn post about the high-availability build, including the ALB URL (or a redacted screenshot), three to five lines on what you built and how you tested high availability, and one proof screenshot.

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-ugcPost-7512882293045125120-usfO/`

---

#### Screenshot of LinkedIn post

![Screenshot of LinkedIn post](screenshots/task-53-diagram.png)

---

# Submission Instructions

- Add all required screenshots in your submission
- Do not expose passwords, connection strings, private keys, or account IDs

---

# Completion Checklist

- [ ] Task 1: VPC, four subnets, IGW, NAT Gateway, and route tables created (Screenshots 1–5)
- [ ] Task 2: Least-privilege ALB, EC2, and RDS security groups created (Screenshots 6–8)
- [ ] Task 3: Private Multi-AZ RDS created (Screenshots 9–10)
- [ ] Task 4: Self-configuring Launch Template created and tested (Screenshots 11–12)
- [ ] Task 5: ALB created across both public subnets (Screenshots 13–14)
- [ ] Task 6: Auto Scaling Group running two instances across two AZs (Screenshots 15–16)
- [ ] Task 7: Application verified through the ALB with a database read and write (Screenshots 17–18)
- [ ] Task 8: Both high-availability tests completed (Screenshots 19–22)
- [ ] Task 9: Architecture and test-results summary completed (Screenshot 23 & Notes)
- [ ] LinkedIn post published and URL submitted
- [ ] No sensitive data exposed

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
