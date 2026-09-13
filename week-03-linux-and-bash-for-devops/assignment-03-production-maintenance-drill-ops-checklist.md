# Assignment 3 — Production Maintenance Drill (OPS Checklist)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will treat your already deployed React application (on Ubuntu VM with Nginx) as a live production system. You will perform structured operational checks covering network validation, service health, log analysis, resource monitoring, configuration verification, and incident simulation with recovery — mirroring real on-call DevOps responsibilities.

---

# Task 1 — Server Access & Networking Validation

## Goal

Verify that the deployed React application is reachable from the browser and confirm basic network connectivity of the Ubuntu VM.

### Evidence

#### Screenshot 1 — Browser showing the React app with your Full Name visible on the UI

![Browser showing the React app with your Full Name visible on the UI](screenshots/task-11-diagram.png)

---

#### Screenshot 2 — Output of `ip a`

![Output of `ip a`](screenshots/task-12-diagram.png)

---

#### Screenshot 3 — Output of `sudo ss -tulpen`

![Output of `sudo ss -tulpen`](screenshots/task-13-diagram.png)

---

#### Screenshot 4 — Output of `sudo ufw status`

![Output of `sudo ufw status`](screenshots/task-14-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What proves Nginx is listening on 0.0.0.0:80?**

The output of sudo ss -tulpen shows an entry with state LISTEN under the Local Address:Port column as 0.0.0.0:80 (and [::]:80 for IPv6), with the users column explicitly displaying users:(("nginx",pid=...,fd=...)). This confirms the Nginx master and worker processes are bound to port 80 across all available network interfaces.

---

**2. What proves SSH is active on port 22?**

In the sudo ss -tulpen output, there is a socket listening on 0.0.0.0:22 and [::]:22 associated with sshd (or systemd socket activation for ssh). Additionally, our active terminal session itself is an authenticated, established TCP connection over port 22.

---

**3. Did you find any unexpected open ports? Explain briefly.**

No unexpected public ports were discovered. The scan only revealed standard management and web services: port 22 for OpenSSH, port 80 for Nginx, and local loopback resolver services such as 127.0.0.53:53 used internally by systemd-resolved for local DNS queries.

---

# Task 2 — Service Health & Systemd Validation (Nginx)

## Goal

Verify that Nginx is properly installed, running, enabled at boot, and safely configured.

### Evidence

#### Screenshot 1 — Output of `systemctl status nginx --no-pager`

![Output of `systemctl status nginx --no-pager`](screenshots/task-15-diagram.png)

---

#### Screenshot 2 — Output of `sudo nginx -t`

![Output of `sudo nginx -t`](screenshots/task-16-diagram.png)

---

#### Screenshot 3 — Output of `sudo ss -lptn '( sport = :80 )'`

![Output of `sudo ss -lptn '( sport = :80 )'`](screenshots/task-17-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What happens if Nginx fails to restart in production?**

If Nginx fails to restart in production, the web server process terminates and port 80/443 sockets close immediately. Any incoming HTTP/HTTPS traffic from end users will be dropped, resulting in browser connection timeout or ERR_CONNECTION_REFUSED errors. If running behind a cloud Application Load Balancer (ALB), health checks will fail and the instance will be marked unhealthy and pulled out of the routing pool.

---

**2. What's your basic rollback plan?**

Configuration Versioning & Backups: Always create a timestamped backup before touching configuration files (e.g., sudo cp default default.bak.$(date +%F)), or track all configurations in a Git repository.Pre-Restart Validation: Never restart without testing syntax using sudo nginx -t. If errors are reported, abort the restart immediately.Reversion & Reload: If an invalid change was already applied, immediately restore the backup configuration file (sudo cp default.bak /etc/nginx/sites-available/default) and issue a non-disruptive reload (sudo systemctl reload nginx) to restore stable service without terminating active connections.

---

# Task 3 — Logs & Request Trace

## Goal

Verify real traffic flow and analyze logs to understand system behavior and errors.

### Evidence

#### Screenshot 1 — Output of `sudo tail -n 30 /var/log/nginx/access.log`

![Output of `sudo tail -n 30 /var/log/nginx/access.log`](screenshots/task-18-diagram.png)

---

#### Screenshot 2 — Output of `sudo tail -n 30 /var/log/nginx/error.log`

![Output of `sudo tail -n 30 /var/log/nginx/error.log`](screenshots/task-19-diagram.png)

---

#### Screenshot 3 — Output of `sudo journalctl -u nginx --no-pager -n 50`

![Output of `sudo journalctl -u nginx --no-pager -n 50`](screenshots/task-20-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Were there any errors in the logs?**

- If yes, mention 1–2 example error lines from the logs and explain what each one means in simple terms.
- If no, explain what it means if the error log is empty or shows no recent errors during your check.

Yes, earlier entries in the error log showed the configuration parsing failure:

[emerg] ...: "server_name" directive is not allowed here in /etc/nginx/sites-enabled/default:56

Explanation: This error indicates an Nginx directive syntax violation—specifically that a server_name directive was placed outside of a valid server { ... } block due to an unclosed curly brace or partial overwrite in the default site configuration. Once the configuration file was replaced with the clean SPA block and validated with nginx -t, no further errors were recorded.

---

**2. If there were no errors, what does that indicate about the system?**

If the error log shows no recent runtime errors after the fix, it indicates that the Nginx worker processes are running cleanly without operational bottlenecks. It proves that file paths referenced in requests exist on disk, file permissions for www-data are correct, socket connections are stable, and the reverse proxy/SPA rewriting rules are functioning as designed.

---

**3. Based on the access logs, were your curl requests visible in the log entries? What does that prove about traffic flow?**

Yes, the access log clearly shows records with IP 127.0.0.1 and User-Agent curl/... issuing HEAD / HTTP/1.1 and GET / HTTP/1.1 requests returning status 200 OK. This proves that incoming HTTP traffic successfully traverses the TCP socket, reaches the Nginx master/worker process, matches the virtual host configuration, and returns the requested resource correctly without dropping packets.

---

# Task 4 — System Resource Health Check (Capacity Red Flags)

## Goal

Assess server capacity and detect potential performance or failure risks.

### Evidence

#### Screenshot 1 — Output of `uptime`

![Output of `uptime`](screenshots/task-21-diagram.png)

---

#### Screenshot 2 — Output of `free -h`

![Output of `free -h`](screenshots/task-22-diagram.png)

---

#### Screenshot 3 — Output of `df -h`

![Output of `df -h`](screenshots/task-23-diagram.png)

---

#### Screenshot 4 — Output of `sudo du -sh /var/* | sort -h`

![Output of `sudo du -sh /var/* | sort -h`](screenshots/task-24-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Which resource looks most critical right now? (CPU/load, memory, or disk) Explain why.**

Memory (RAM) is the most critical resource on this system. Because this is a t2.micro instance with only 1 GB of physical RAM, baseline operating system daemons, systemd services, and Nginx consume approximately 25%–35% of total memory even when idle. During heavy workloads like compiling React builds or handling traffic spikes, RAM exhaustion occurs rapidly. While the 1 GB swap file prevents immediate system lockups, excessive swapping degrades I/O performance, making RAM the primary operational constraint compared to CPU and disk capacity.

---

**2. What happens if disk becomes 100% full in a production server?**

Process Crashes: Daemons like Nginx fail because they cannot write access or error logs, handle temporary buffering, or write PID lockfiles.
Authentication Lockouts: New SSH connections fail because the system cannot write session entries or update authentication journals.
Application Outages: Applications fail during database transactions or cache creation when write calls (ENOSPC: no space left on device) throw fatal uncaught exceptions.
System Freezes: Core OS maintenance tasks like cron and journald fail, requiring emergency out-of-band volume expansion or recovery in single-user mode.

---

# Task 5 — Configuration & Deployment Verification

## Goal

Ensure the correct React build is deployed and Nginx is serving it properly.

### Evidence

#### Screenshot 1 — Output of `ls -lah /var/www/html | head -n 20`

![Output of `ls -lah /var/www/html | head -n 20`](screenshots/task-25-diagram.png)

---

#### Screenshot 2 — Output of `grep -R "Deployed by" -n /var/www/html 2>/dev/null | head`

![`grep -R "Deployed by" -n /var/www/html 2>/dev/null | head`](screenshots/task-26-diagram.png)

---

#### Screenshot 3 — Output of `grep -n "try_files" /etc/nginx/sites-available/default`

![`grep -n "try_files" /etc/nginx/sites-available/default`](screenshots/task-27-diagram.png)

---

### Notes

Answer the following in your own words:

**1. How do you confirm that the correct version of the application is deployed?**

Filesystem & Timestamp Inspection: Running ls -lah /var/www/html verifies that the asset bundle modification timestamps match the most recent deployment execution and that bundle hashes in the static/js/ directory match the build artifacts generated by npm run build.
Content Verification (grep): Running grep -R "Deployed by" -n /var/www/html searches the deployed bundles directly on disk to confirm that personalized commit text, version tags, or build signatures are physically present.
End-to-End HTTP Validation: Using curl -I http://localhost and inspecting live browser DOM rendering confirms that Nginx is actively reading from the correct root path and returning the verified bundle with an HTTP 200 status code.

---

# Task 6 — Nginx Configuration Failure Simulation

## Goal

Simulate a real-world Nginx misconfiguration and recover the service safely.

### Evidence

#### Screenshot 1 — Output of `sudo nginx -t` showing the syntax error (broken config)

![Output of `sudo nginx -t` showing the syntax error (broken config)](screenshots/task-28-diagram.png)

---

#### Screenshot 2 — Output of `sudo nginx -t` showing syntax ok (fixed config)

![Output of `sudo nginx -t` showing syntax ok (fixed config)](screenshots/task-29-diagram.png)

---

#### Screenshot 3 — Output of `curl -I http://<public-ip>` confirming recovery (200 OK)

![Output of `curl -I http://<public-ip>` confirming recovery (200 OK)](screenshots/task-30-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What caused the configuration failure?**

The configuration failure was intentionally simulated by omitting the required terminating semicolon ; from the try_files $uri $uri/ /index.html directive in /etc/nginx/sites-available/default. When Nginx parsed the file, the absence of the delimiter caused the parser to interpret the closing curly brace } as an argument, resulting in a fatal syntax parsing error during nginx -t.

---

**2. How did you fix the issue?**

The issue was corrected by reopening the configuration file, appending the missing semicolon to terminate the directive properly, and verifying the syntax with sudo nginx -t. Once the test returned syntax is ok and test is successful, the changes were safely applied to the running web server using sudo systemctl reload nginx.

---

**3. How can you avoid this kind of issue in real production systems?**

Automated CI/CD Validation: Incorporate nginx -t or a containerized linter (nginx -t inside a GitHub Actions test runner) into the deployment pipeline so broken configs cannot be deployed to servers.Pre-commit Hooks & Linters: Enforce syntax linters and formatters in the version-controlled repository to catch syntax oversights prior to commit.Non-Disruptive Reloads over Restarts: Always execute sudo nginx -t as a prerequisite command in deployment scripts, followed by systemctl reload nginx rather than systemctl restart nginx. If the syntax test fails, the script immediately aborts without terminating the currently active, healthy worker processes.

---

# Task 7 — Web Application Failure Simulation

## Goal

Simulate missing deployment content and recover the application safely.

### Evidence

#### Screenshot 1 — Output of `curl -I http://<public-ip>` showing failure (non-200 response)

![Output of `curl -I http://<public-ip>` showing failure (non-200 response)](screenshots/task-31-diagram.png)

---

#### Screenshot 2 — Output of `curl -I http://<public-ip>` confirming recovery (200 OK)

![Output of `curl -I http://<public-ip>` confirming recovery (200 OK)](screenshots/task-32-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What caused the application to break in this scenario?**

The application failure was caused by simulating missing deployment content—specifically moving /var/www/html/index.html out of the web root. Although the Nginx service was running normally, the Nginx try_files routing rule could not locate index.html as the fallback resource. Because directory indexing is disabled by default for security, Nginx returned an HTTP/1.1 403 Forbidden (or 404 Not Found) response instead of the React application.

---

**2. How did you fix the issue and restore the application?**

The issue was resolved by restoring the missing entrypoint file back to its designated location at /var/www/html/index.html and verifying that the www-data user had read access. Running curl -I [http://34.229.158.21](http://34.229.158.21) confirmed immediate recovery with an HTTP/1.1 200 OK status without needing to restart the Nginx service.

---

**3. What steps would you take to prevent this kind of issue in real production systems?**

Atomic Deployments / Symlinking: Never wipe a live production folder directly in-place. Instead, deploy new builds to timestamped release folders (e.g., /var/www/releases/v1.0.2/) and atomically swap a symbolic link (ln -sfn) pointing /var/www/html to the new release only after verifying build integrity.Pre-Deployment Artifact Verification: Add pipeline sanity checks that verify key assets (e.g., test -f /path/to/build/index.html) before initiating the deployment step. Blue-Green / Canary Deployments: Deploy new builds to a standby environment or behind a load balancer, run synthetic health checks, and shift production user traffic only once the application endpoint returns 200 OK.

---

# Task 8 — Security & Reliability Review

## Goal

Review and reflect on the security and reliability practices applied during this assignment.

### Security & Reliability Notes

Answer the following in your own words:

**1. Why is SSH key-based authentication more secure than sharing passwords?**

SSH key pairs use asymmetric cryptography (such as ED25519 or 2048/4096-bit RSA). The private key remains secure on the client machine and is never transmitted over the wire, while the server verifies signatures using the public key.

---

**2. Why should only required ports be open on a production server?**

Restricting inbound network access to only essential ports adheres to the Principle of Least Privilege and minimizes the server's attack surface. To Prevents Exploitation of Unintended Services, Reduces Reconnaissance and Simplifies Defense-in-Depth.

---

**3. Why is it important for Nginx to be enabled on boot?**

Enabling Nginx via systemd (sudo systemctl enable nginx) creates symlinks in systemd target runlevels (such as multi-user.target.wants/). This guarantees that:Automatic Service Recovery: If the underlying virtual machine undergoes an unexpected reboot—such as during AWS hypervisor maintenance, host hardware migration, or an automated OS kernel update—Nginx launches immediately upon system startup without requiring manual engineer intervention. Minimizes Mean Time to Recovery (MTTR): Without boot-level enablement, a transient server reboot results in extended application downtime until an on-call engineer notices failed health checks, connects via SSH, and manually starts the daemon.

---

**4. What are the risks of sharing secrets, keys, or credentials publicly?**

Accidentally committing secrets (like .pem private keys, AWS access tokens, API secrets, or database credentials) to public repositories or shared chat channels leads to immediate compromise:Automated Exploitation within Minutes: Public repositories are continuously scraped by automated scanner bots. Leaked cloud credentials are often weaponized within seconds to launch unauthorized cryptomining clusters, exfiltrate private datasets, or pivot deeper into cloud infrastructure.Data Breaches & Legal Liability: Compromised SSH keys grant direct root access to servers, exposing customer data, proprietary code, and internal networks, which can trigger severe regulatory penalties (such as GDPR violations) and reputational damage. Cost Spikes: Compromised AWS API keys often lead to massive unauthorized resource provisioning, generating thousands of dollars in unexpected cloud charges before detection.

---

**5. Why should cloud resources be stopped or terminated when they are no longer needed?**

Cost Optimization (FinOps): Running EC2 instances, attached EBS storage volumes, and allocated Elastic IPs accrue hourly charges regardless of whether they are actively serving traffic. Terminating or stopping idle lab instances prevents ongoing infrastructure costs.

---

# LinkedIn Post (Required)

## Evidence

#### LinkedIn Post URL

Paste your LinkedIn post URL here:

`https://www.linkedin.com/feed/update/urn:li:share:7503814774439239680/`

---

#### Screenshot — Published LinkedIn post

![LinkedIn post showing the deployed application](screenshots/task-11-diagram.png)

---

# Submission Instructions

- Add all required screenshots in your submission
- Full name must be visible in required screenshots
- Do not expose sensitive information (keys, passwords, account IDs)

---

# Completion Checklist

- [ ] Task 1: Screenshots (browser, ip a, ss -tulpen, ufw status) + Notes answered
- [ ] Task 2: Screenshots (nginx status, nginx -t, ss port 80) + Notes answered
- [ ] Task 3: Screenshots (access log, error log, journalctl) + Notes answered
- [ ] Task 4: Screenshots (uptime, free -h, df -h, du -sh) + Notes answered
- [ ] Task 5: Screenshots (ls html, grep deployed by, grep try_files) + Notes answered
- [ ] Task 6: Screenshots (nginx -t fail, nginx -t pass, curl recovery) + Notes answered
- [ ] Task 7: Screenshots (curl failure, curl recovery) + Notes answered
- [ ] Task 8: Security & Reliability Notes answered
- [ ] LinkedIn post published and URL submitted
- [ ] Full Name visible in all required screenshots
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
