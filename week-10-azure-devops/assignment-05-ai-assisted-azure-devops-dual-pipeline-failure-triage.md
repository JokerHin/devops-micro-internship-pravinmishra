# Assignment 5 — AI-Assisted CI/CD Pipeline Failure Triage

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build a read-only Bash script that fetches the latest run of your dual-pipeline EpicBook project (Azure DevOps and/or GitHub Actions) and categorizes any failure it finds — dependency, build, test, authentication, or agent/runner availability. You will then connect that script to Claude Code as a reusable `/pipeline-triage` skill, deliberately break your pipeline in a safe and obvious way, use the skill to diagnose the break from evidence alone, fix it yourself, and verify recovery with a second run of the skill.

---

# Task 1 — Confirm the Healthy Baseline and Create the Workspace

## Goal

Confirm the latest run on both Azure DevOps and GitHub Actions currently succeeds, then create the workspace folders for this assignment.

### Evidence

#### Screenshot 1 — Latest run status on Azure DevOps and/or GitHub Actions showing a successful run

[Latest run status on Azure DevOps and/or GitHub Actions showing a successful run](screenshots/task-31-diagram.png)

---

# Task 2 — Define the Read-Only Workflow in CLAUDE.md

## Goal

Create `CLAUDE.md` describing the pipeline-triage workflow (gather → analyze → human applies the fix → verify) and the safety rules: never re-trigger, retry, cancel, or approve a pipeline run; never modify pipeline YAML; never read or print a secret, token, or service connection credential.

### Evidence

#### Screenshot 2 — `CLAUDE.md` showing the workflow and safety rules

[`CLAUDE.md` showing the workflow and safety rules](screenshots/task-32-diagram.png)

---

# Task 3 — Build the Pipeline Triage Script

## Goal

Build `pipeline-triage.sh`, a read-only Bash script that fetches the latest run's status/log using `az pipelines runs list`/`az pipelines runs show` and/or `gh run list`/`gh run view --log-failed`, and classifies any failure it finds into one of five categories using pattern matching against the log evidence. The script must only ever read run status and logs — it must never trigger, retry, cancel, or approve a run.

### Evidence

#### Screenshot 3 — `pipeline-triage.sh` showing the check functions and their pattern-matching conditionals

[`pipeline-triage.sh` showing the check functions and their pattern-matching conditionals](screenshots/task-33-diagram.png)

---

# Task 4 — Run the Script Against the Healthy Pipeline

## Goal

Run the script against your current, passing pipeline and confirm it produces a clean report with no failure detected.

### Evidence

#### Screenshot 4 — Script output and report showing a healthy result with no failure category triggered

[Script output and report showing a healthy result with no failure category triggered](screenshots/task-34-diagram.png)

---

# Task 5 — Build and Run the /pipeline-triage Skill

## Goal

Create a Claude Code skill restricted to read-only tools (no `Write`) that runs the script, reads the report, and explains the result with evidence — and confirm it correctly reports the healthy baseline without re-running, cancelling, or modifying anything.

### Evidence

#### Screenshot 5 — `SKILL.md` frontmatter showing the tool restrictions and safety rules

[`SKILL.md` frontmatter showing the tool restrictions and safety rules](screenshots/task-35-diagram.png)

---

#### Screenshot 6 — `/pipeline-triage` output for the healthy pipeline

[`/pipeline-triage` output for the healthy pipeline](screenshots/task-36-diagram.png)

---

# Task 6 — Deliberately Break the Pipeline and Diagnose It

## Goal

Introduce one safe, obvious, and easily reversible failure (for example, an intentionally wrong test assertion or a typo'd dependency name), push it so the pipeline fails, then run `/pipeline-triage` and confirm it correctly names the failure category, quotes the exact log evidence, and recommends a specific fix — without taking any action itself.

### Evidence

#### Screenshot 7 — The failed pipeline run showing the red/failed status

[The failed pipeline run showing the red/failed status](screenshots/task-37-diagram.png)

---

#### Screenshot 8 — `/pipeline-triage` output showing the diagnosed failure category, the quoted log evidence, and the recommended fix

[`/pipeline-triage` output showing the diagnosed failure category, the quoted log evidence, and the recommended fix](screenshots/task-38-diagram.png)

---

# Task 7 — Fix, Push, and Verify Recovery

## Goal

Apply the recommended fix yourself, push it, confirm the pipeline succeeds again on both providers, and re-run `/pipeline-triage` to confirm it now reports a healthy result.

### Evidence

#### Screenshot 9 — The pipeline run succeeding after your fix

[The pipeline run succeeding after your fix](screenshots/task-39-diagram.png)

---

#### Screenshot 10 — Second `/pipeline-triage` output confirming the pipeline is healthy again

[Second `/pipeline-triage` output confirming the pipeline is healthy again](screenshots/task-40-diagram.png)

---

### Notes

Explain, in your own words, why the skill was allowed to gather evidence and diagnose the failure but was never allowed to re-trigger the pipeline or apply the fix itself.

==============================================================================
DEVOPS MICRO INTERNSHIP (DMI) ASSIGNMENT 5 — WRITTEN ANSWER
==============================================================================

Why the AI Triage Skill is Restricted to Read-Only Operations:

The /pipeline-triage skill is deliberately constrained to read-only tools
(Gather and Analyze) without granting permissions to write code, modify
pipeline definitions, or re-trigger pipeline executions due to three core
DevOps and security principles:

1. Prevention of Recursive Infinite Loops:
   If an AI skill is permitted to automatically modify code and trigger pipeline
   runs upon diagnosing a failure, an incorrect or incomplete diagnosis could
   cause a continuous loop of broken commits and pipeline executions, consuming
   compute resources and cluttering the Git commit history.

2. Blast Radius Mitigation & Principle of Least Privilege:
   Automated remediation scripts executing in CI/CD environments could
   inadvertently apply unintended changes to production code, infrastructure
   manifests, or secret configurations. Restricting the AI to evidence gathering
   and diagnostic recommendations ensures that a human engineer remains the
   authoritative decision-maker (Human-in-the-Loop) before any state-changing
   action is taken.

3. Credential and Secret Protection:
   CI/CD logs and agent execution environments handle sensitive service connection
   tokens and credentials. By strictly enforcing read-only behavior and prohibiting
   write or execution privileges over pipeline state, we prevent accidental
   exposures or unintended configuration drift.
   ==============================================================================

---

# Submission Instructions

Complete all tasks in sequence.

Your submission must include:

- All 10 required screenshots
- Never expose a Personal Access Token, service connection credential, or GitHub token in a screenshot

---

# Completion Checklist

- [ ] Task 1: Healthy baseline confirmed on both providers before starting (Screenshot 1)
- [ ] Task 2: `CLAUDE.md` created with the workflow and safety rules (Screenshot 2)
- [ ] Task 3: `pipeline-triage.sh` built with all five failure-category checks (Screenshot 3)
- [ ] Task 4: Script run against the healthy pipeline showing a clean result (Screenshot 4)
- [ ] Task 5: `/pipeline-triage` skill created and run successfully (Screenshots 5–6)
- [ ] Task 6: Pipeline deliberately broken and correctly diagnosed (Screenshots 7–8)
- [ ] Task 7: Fix applied, pushed, and recovery verified (Screenshots 9–10)
- [ ] Reflection answer written (Notes)
- [ ] No secrets or tokens exposed

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
