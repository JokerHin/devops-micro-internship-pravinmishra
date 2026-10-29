# Assignment 7 — Kubernetes Services (ClusterIP)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this guided lab, you will create an internal ClusterIP Service for NGINX, call it by DNS and virtual IP, break and fix its selector, and prove readiness-aware endpoint routing.

---

# Task 1 — Deploy the Probed NGINX Workload

## Goal

Create two healthy, labeled NGINX Pods (readiness + liveness probes) as Service backends.

### Evidence

#### Screenshot 1 — Two Ready Pods with labels and IPs

[Two Ready Pods with labels and IPs](screenshots/task-29-diagram.png)

---

# Task 2 — Create and Inspect the ClusterIP Service

## Goal

Create `nginx-svc` (type `ClusterIP`, selector `app: nginx`, port 80) and inspect the Service, Endpoints, and EndpointSlices.

### Evidence

#### Screenshot 2 — Service ClusterIP plus populated Endpoints and EndpointSlices

[Service ClusterIP plus populated Endpoints and EndpointSlice](screenshots/task-30-diagram.png)

---

# Task 3 — Call the Service from a Client Pod

## Goal

Create a BusyBox `tester` Pod and call `nginx-svc` by short name, ClusterIP, and both short/FQDN via `nslookup`.

### Evidence

#### Screenshot 3 — Successful `wget` responses and `nslookup` output

[Successful `wget` responses and `nslookup` output](screenshots/task-31-diagram.png)

---

# Task 4 — Break and Fix the Selector Contract

## Goal

Change the Service selector to `app: does-not-match`, confirm endpoints become empty and requests fail, then restore `app: nginx`.

### Evidence

#### Screenshot 4 — Empty endpoints during failure and restored endpoints after the fix

[Empty endpoints during failure and restored endpoints after the fix](screenshots/task-32-diagram.png)

---

# Task 5 — Prove Readiness-Aware Routing

## Goal

Scale to one replica, apply a broken readiness patch, confirm the NotReady Pod is excluded from Service endpoints, then restore the healthy Deployment.

### Evidence

#### Screenshot 5 — NotReady Pod with excluded endpoint, followed by restored endpoint membership

[NotReady Pod with excluded endpoint, followed by restored endpoint membership](screenshots/task-33-diagram.png)

---

# Task 6 — Troubleshoot and Optionally Clean Up

## Goal

Verify the Service path, then optionally delete `tester` and `nginx-svc`.

### Evidence

#### Screenshot 6 — Final verification or optional cleanup output

[Final verification or optional cleanup output](screenshots/task-34-diagram.png)

---

### Notes

Write a short note describing what the lab demonstrated.

This lab demonstrated how Kubernetes ClusterIP Services provide stable internal load balancing and service discovery for microservices. Rather than coupling client applications directly to volatile Pod IP addresses, a ClusterIP Service provides a fixed Virtual IP and internal DNS name (<service-name>.<namespace>.svc.cluster.local). The Service controller dynamically tracks backend Pods using label selectors (spec.selector), automatically populating Endpoints and EndpointSlices. Crucially, Tasks 4 and 5 proved the strict contract between Health Probes and Service routing: Kubernetes dynamically excludes any Pod failing its readinessProbe from the Service Endpoints list. This guarantees that internal traffic is routed only to healthy, ready Pods, eliminating traffic blackholing during rolling updates or application degradation.

# Submission Instructions

- Add all required screenshots in your submission
- Include the completed YAML manifests used in the lab

---

# Completion Checklist

- [ ] Task 1: Probed NGINX Deployment applied (Screenshot 1)
- [ ] Task 2: ClusterIP Service created and inspected (Screenshot 2)
- [ ] Task 3: Service reached by DNS and ClusterIP (Screenshot 3)
- [ ] Task 4: Selector broken and fixed (Screenshot 4)
- [ ] Task 5: Readiness-aware routing proven (Screenshot 5)
- [ ] Task 6: Verified / cleaned up (Screenshot 6)
- [ ] Reflection notes written (Notes)

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
