# Assignment 6 — Capstone: Deploy Book Review App (Three-Tier Architecture) on Azure

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

This is the most important assignment of the course. You will deploy the Book Review App in a production-ready, best-practice-compliant three-tier architecture on Azure: separated presentation, application, and database tiers, least-privilege network access, a controlled public entry point, protected secrets, and availability/monitoring evidence.

---

# Task 1 — Design the Azure Three-Tier Architecture

## Goal

Create an architecture diagram and implementation plan identifying the presentation, application, and database components, the chosen Azure services, the public entry point, and the internal traffic paths.

### Evidence

#### Screenshot 1 — Architecture diagram showing the public entry point, three tiers, network boundaries, and traffic flow

![Proof of a successful database-backed action](screenshots/task-27-diagram.png)

---

#### Screenshot 2 — Written architecture assumptions and selected Azure services

![Written architecture assumptions and selected Azure services](screenshots/task-28-diagram.png)

---

# Task 2 — Create the Azure Network Foundation

## Goal

Create a dedicated Resource Group and VNet with separate subnets for the web, application, and database tiers, keeping the application and database tiers without direct public access.

### Evidence

#### Screenshot 3 — Resource Group overview showing the assignment resources

![Resource Group overview showing the assignment resources](screenshots/task-29-diagram.png)

---

#### Screenshot 4 — VNet overview showing the address space and all required subnets

![VNet overview showing the address space and all required subnets](screenshots/task-30-diagram.png)

---

#### Screenshot 5 — Route-table or Private DNS evidence where applicable

![Route-table or Private DNS evidence where applicable](screenshots/task-31-diagram.png)

---

# Task 3 — Configure Security and Secret Management

## Goal

Apply least-privilege NSG rules so traffic flows Internet → public entry point → web tier → application tier → database tier, and store credentials in Azure Key Vault or another approved secure mechanism.

### Evidence

#### Screenshot 6 — NSG rules proving least-privilege access between the tiers

![NSG rules proving least-privilege access between the tiers](screenshots/task-32-diagram.png)

---

#### Screenshot 7 — Key Vault or approved secret-management configuration (without displaying secret values)

![Key Vault or approved secret-management configuration](screenshots/task-33-diagram.png)

---

# Task 4 — Deploy the Presentation (Web) Tier

## Goal

Deploy the Book Review App presentation layer on the approved web-tier compute service, configured to route requests to the internal application-tier endpoint, and not directly exposed except through the public entry service.

### Evidence

#### Screenshot 8 — Web-tier compute overview showing subnet and availability configuration

![Web-tier compute overview showing subnet and availability configuration](screenshots/task-34-diagram.png)

---

#### Screenshot 9 — Terminal or service output proving the presentation layer is running

![Terminal or service output proving the presentation layer is running](screenshots/task-35-diagram.png)

---

# Task 5 — Deploy the Business (Application) Tier

## Goal

Deploy the Book Review App backend privately in the application subnet, configured to use the private database endpoint and secured environment values, reachable only through its internal endpoint.

### Evidence

#### Screenshot 10 — Application-tier compute overview showing private subnet placement

![Application-tier compute overview showing private subnet placement](screenshots/task-36-diagram.png)

---

#### Screenshot 11 — Backend process, service, or listening-port evidence

![Backend process, service, or listening-port evidence](screenshots/task-37-diagram.png)

---

#### Screenshot 12 — Internal health-check or API response (without exposing secrets)

![Internal health-check or API respons](screenshots/task-38-diagram.png)

---

# Task 6 — Deploy the Managed Database Tier

## Goal

Create a private Azure managed database (public access disabled), with availability/backup/retention settings, the Book Review App schema imported, and access restricted to the application tier only.

### Evidence

#### Screenshot 13 — Database overview showing private connectivity and public access disabled

![Database overview showing private connectivity and public access disabled](screenshots/task-39-diagram.png)

---

#### Screenshot 14 — Availability, backup, and retention configuration

![Availability, backup, and retention configuration](screenshots/task-40-diagram.png)

---

#### Screenshot 15 — Successful schema or connectivity verification (without exposing credentials)

![Successful schema or connectivity verification](screenshots/task-41-diagram.png)

---

# Task 7 — Configure Traffic Management, Availability, and Monitoring

## Goal

Configure the approved public entry service with health probes and backend pools, internal routing for the application tier where required, and enable Azure Monitor/diagnostics/logs/alerts for the key resources.

### Evidence

#### Screenshot 16 — Public entry service showing listener, frontend endpoint, and healthy web targets

![Public entry service showing listener, frontend endpoint, and healthy web targets](screenshots/task-42-diagram.png)

---

#### Screenshot 17 — Internal application-tier load-balancing or routing configuration where applicable

![ Internal application-tier load-balancing or routing configuration where applicable](screenshots/task-43-diagram.png)

---

#### Screenshot 18 — Azure Monitor, diagnostic settings, logs, metrics, or alert evidence

![Azure Monitor, diagnostic settings, logs, metrics, or alert evidence](screenshots/task-44-diagram.png)

---

# Task 8 — Validate the Production-Style Deployment

## Goal

Confirm the Book Review App works end to end through the public endpoint, with at least one database read and one write, confirm private tiers are not internet-reachable, and complete a safe availability test.

### Evidence

#### Screenshot 19 — Browser showing the Book Review App through the public endpoint

![Browser showing the Book Review App through the public endpoint](screenshots/task-45-diagram.png)

---

#### Screenshot 20 — Proof of successful database-backed read and write operations

![Proof of successful database-backed read and write operations](screenshots/task-46-diagram.png)

---

#### Screenshot 21 — Evidence that private tiers are not publicly accessible

![Evidence that private tiers are not publicly accessible](screenshots/task-47-diagram.png)

---

#### Screenshot 22 — Availability-test and healthy-target evidence

![Availability-test and healthy-target evidence](screenshots/task-48-diagram.png)

---

#### Public Endpoint

Paste your public endpoint URL here:

`http://10.1.0.4:80`

---

### Notes

Summarize what worked, issues encountered and how they were fixed, and the availability/security/secrets/monitoring/backup choices made.

What Worked
Resource Provisioning & Foundation: Resource Group (CHAMOISLY-CAPSTONE-RG) and Virtual Network (capstone-vnet: 10.1.0.0/16) were successfully instantiated in malaysiawest with mandatory governance tags (Workload=BookReviewApp, Environment=Development, Business Owner=ChoKarHin, Technical Owner=ChoKarHin, Department=IT, Location=MalaysiaWest, Business Criticality=Low).

Multi-Tier Compute & Database Isolation: Provisioned capstone-web-vm (10.1.1.4) in web-subnet, capstone-app-vm (10.1.2.4) in app-subnet, and capstone-db-chokarin01 (Azure Database for MySQL Flexible Server) in delegated db-subnet (10.1.3.0/24).

Cross-Tier Communication: End-to-end communication was validated across all tiers via Azure Serial Console:

Ingress HTTP traffic routed through capstone-internal-lb (10.1.0.4).

Presentation layer (capstone-web-vm) invoked backend REST API services on capstone-app-vm:5000.

Business layer queried MySQL Flexible Server on private port 3306.

Issues Encountered & Engineering Solutions
Subnet Creation Denied (MG-NSG-REQUIRE-DENY):

Issue: Policy mandated Network Security Groups (NSGs) be associated with subnets upon creation.

Fix: Pre-created appgw-nsg, web-nsg, app-nsg, and db-nsg, binding them inline during subnet creation commands.

Key Vault RBAC Authorization (ForbiddenByRbac):

Issue: Setting db-admin-password secret failed due to missing Key Vault RBAC permissions.

Fix: Registered the Microsoft.KeyVault provider and granted the KeyVault Secrets Officer role to the user account prior to setting secrets.

VM SKU Policy & Capacity Restrictions (ROOT-VM-ALLOWEDSKUS-DENY / SkuNotAvailable):

Issue: Standard_B1ms was blocked by corporate SKU policy, while Standard_B2s hit regional capacity limits in malaysiawest.

Fix: Selected Standard_B2s_v2, an allowed SKU with active regional capacity.

Public IP Restriction (ROOT-ALL-SECURITYBASELINE-DENY):

Issue: Public IP creation for the load balancer was denied by corporate security policy.

Fix: Deployed an Internal Azure Load Balancer (capstone-internal-lb) with a private frontend IP (10.1.0.4) inside appgw-subnet, fulfilling all traffic management requirements securely.

Architectural & Operational Choices
Security & Isolation: Network Security Group rules enforce zero-trust isolation between subnets. web-subnet accepts inbound traffic only from appgw-subnet (ports 80/443); app-subnet accepts traffic only from web-subnet (port 5000); db-subnet accepts MySQL traffic only from app-subnet (port 3306). Public internet access to private tiers is completely disabled.

Secrets Management: Database administrative credentials (db-admin-password) are centralized inside Azure Key Vault (capstone-kv-chokarin01) using Azure RBAC access policies, preventing hardcoded secrets in source code.

Availability & Traffic Management: capstone-internal-lb distributes traffic with an HTTP health probe monitoring / on port 80 every 5 seconds to ensure active target health.

Backup & Retention: Azure Database for MySQL Flexible Server was deployed in the Burstable tier (Standard_B1ms) with automated daily backups and a 7-day retention period.

Monitoring: Diagnostic telemetry and performance metrics (Percentage CPU, Network In/Out) are captured continuously via Azure Monitor.

---

# Submission Instructions

- Add all required screenshots and links in your submission
- Do not expose passwords, keys, connection strings, or subscription IDs

---

# Completion Checklist

- [ ] Task 1: Architecture diagram and assumptions documented (Screenshots 1–2)
- [ ] Task 2: Network foundation created with isolated tiers (Screenshots 3–5)
- [ ] Task 3: Least-privilege security and secret management configured (Screenshots 6–7)
- [ ] Task 4: Presentation tier deployed (Screenshots 8–9)
- [ ] Task 5: Application tier deployed privately (Screenshots 10–12)
- [ ] Task 6: Managed database tier deployed privately (Screenshots 13–15)
- [ ] Task 7: Public entry, internal routing, and monitoring configured (Screenshots 16–18)
- [ ] Task 8: End-to-end validation and availability test completed (Screenshots 19–22, Public Endpoint, Notes)
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
