# Assignment 6 — AI-Assisted Ansible Change Risk Review

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In this assignment, you will build an AI-assisted Ansible risk-review workflow using `ansible-playbook --check --diff`, Bash scripting, and Claude Code.

You will review possible server changes before applying them, classify risky tasks, and keep the final apply decision under human control.

---

# Task 1 — Confirm EpicBook Connectivity and Create the Workspace

## Goal

Confirm that your previous EpicBook Ansible project is working before creating the risk-review automation.

### Evidence

#### Screenshot 1 — Output of `ansible web -i inventory.ini -m ping`

[Output of `ansible web -i inventory.ini -m ping`](screenshots/task-71-diagram.png)

---

#### Screenshot 2 — Output of `ansible-playbook -i inventory.ini site.yml --syntax-check`

[Output of `ansible-playbook -i inventory.ini site.yml --syntax-check`](screenshots/task-72-diagram.png)

---

#### Screenshot 3 — Output of `pwd` and `find . -maxdepth 4 -type d | sort`

[Output of `pwd` and `find . -maxdepth 4 -type d | sort`](screenshots/task-73-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What proves that Ansible can reach your EpicBook VM?**

Executing ansible web -i inventory.ini -m ping returned a SUCCESS response with "ping": "pong" over SSH, confirming active network reachability, key authentication, and functional Python execution on the target node 3.80.215.0.

---

**2. Why should you confirm playbook syntax before building a risk-review script?**

Verifying playbook syntax with --syntax-check ensures that all YAML structures, task definitions, and role references are syntactically valid before performing dry runs. This prevents parsing errors from breaking the automated risk-review parser.

---

# Task 2 — Create Project Context and Safety Rules in CLAUDE.md

## Goal

Create a `CLAUDE.md` file that tells Claude Code how this project must behave.

### Evidence

#### Screenshot 4 — `CLAUDE.md` open in VS Code or terminal showing the safety rules

[`CLAUDE.md` open in VS Code or terminal showing the safety rules](screenshots/task-74-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Why should Claude Code have project-specific safety rules?**

Project-specific safety rules establish clear boundaries for AI tools, preventing autonomous execution of privileged or state-altering commands that could degrade production services, leak secrets, or make unintended infrastructure changes.

---

**2. Why should the human run the real Ansible playbook manually?**

Keeping the final execution under human control preserves accountability and implements a "Human-in-the-Loop" safety pattern. The operator evaluates the AI-generated risk report, verifies safety, and makes the conscious decision to apply changes.

---

**3. Which rule prevents Claude Code from applying changes automatically?**

The rule: "NO AUTOMATED APPLY: NEVER run ansible-playbook site.yml without --check. Real infrastructure changes must be executed by the human operator."

---

# Task 3 — Ask Claude Code to Plan the Risk Review

## Goal

Use Claude Code to produce a read-only plan before writing the Bash script.

### Evidence

#### Screenshot 5 — Claude Code showing the four-category risk-classification plan

[Claude Code showing the four-category risk-classification plan](screenshots/task-75-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Which part of this task represents the Gather phase?**

The Gather phase is performed when Ansible executes ansible-playbook --check --diff, capturing the raw standard output, task execution status, and configuration file diffs without applying any changes to the target host.

---

**2. Which part represents the Analyze phase?**

The Analyze phase takes place when the script parses the collected task diffs and matches detected changes against rule patterns to classify them into Low, Medium, High, or Critical risk categories.

---

**3. How did you verify Claude Code did not create or edit files?**

I verified this by checking the terminal execution logs and checking git status, confirming that Claude Code only provided read-only analytical responses without invoking any file-modification tools or writing changes to disk.

---

# Task 4 — Build the Ansible Risk Review Script

## Goal

Create a Bash script that runs an Ansible dry run and classifies risky changes.

### Evidence

#### Screenshot 6 — Top section of `ansible-check-review.sh` showing `full_name`, `playbook_path`, `inventory_path`, and the `checks` array

[Top section of `ansible-check-review.sh` showing `full_name`, `playbook_path`, `inventory_path`, and the `checks` array](screenshots/task-76-diagram.png)

---

#### Screenshot 7 — Middle section showing `extract_changed_tasks` and `check_tasks_matching_pattern`

[Middle section showing `extract_changed_tasks` and `check_tasks_matching_pattern`](screenshots/task-77-diagram.png)

---

#### Screenshot 8 — Bottom section showing the loop, summary, and exit behavior

[Bottom section showing the loop, summary, and exit behavior](screenshots/task-78-diagram.png)

---

#### Screenshot 9 — Output of `bash -n ansible-check-review.sh` and `ls -l ansible-check-review.sh`

[Output of `bash -n ansible-check-review.sh` and `ls -l ansible-check-review.sh`](screenshots/task-78-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What is stored in the `changed_tasks` array?**

The changed_tasks array stores the names of all Ansible tasks that reported a state change (changed: [web1]) during the --check --diff dry-run execution.

---

**2. Which function finds changed tasks from the Ansible output?**

The extract_changed_tasks function extracts changed tasks by using grep to filter task names followed immediately by changed: [ in the dry-run output log.

---

**3. Why does the script use `--check --diff`?**

--check performs a dry run without applying any actual changes to the managed node, while --diff outputs the exact file/template differences that would occur. This combination allows for comprehensive pre-flight risk evaluation without altering live production state.

---

**4. Why does the script use different exit codes for healthy, warning, and failed results?**

Exit codes allow automated pipelines and wrapper tools (like CI/CD runners or AI agent skills) to programmatically interpret execution outcomes without parsing text:

0: Clean / No changes required.

1: Low-risk changes present (safe to proceed under human supervision).

2: High-risk/Critical changes detected (requires explicit human review and approval).

---

# Task 5 — Run the Baseline Dry-Run Review

## Goal

Run the script against your current EpicBook playbook and confirm the baseline risk status.

### Evidence

#### Screenshot 10 — Output of `./ansible-check-review.sh`

[Output of `./ansible-check-review.sh`](screenshots/task-79-diagram.png)

---

#### Screenshot 11 — Output of `echo "Captured Exit Code: $script_exit_code"` and `cat reports/ansible-risk-report.txt`

[Output of `./ansible-check-review.sh`](screenshots/task-80-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What was the overall status of your baseline run?**

RISKY CHANGES DETECTED (Exit code 2).

---

**2. Did any tasks report `changed`?**

Yes, 2 tasks reported changed:

TASK [nginx : Restart Nginx to force new configuration]

TASK [epicbook : Add Node.js 20.x GPG key and APT repository]

---

**3. Were any changed tasks flagged as risky?**

Yes, 1 task was flagged as a Medium Risk finding: [MEDIUM] Service restart (Pattern: 'Restart') due to the Nginx restart task.

---

**4. What does the script exit code mean?**

An exit code of 2 indicates that at least one changed task matched a predefined risk rule (service restart), requiring human review before applying the playbook to live infrastructure.

---

# Task 6 — Create and Run the Claude Code Skill

## Goal

Turn the Bash script into a reusable Claude Code skill called `/ansible-risk-review`.

### Evidence

#### Screenshot 12 — `SKILL.md` showing the frontmatter, allowed tools, and safety rules

[`SKILL.md` showing the frontmatter, allowed tools, and safety rules](screenshots/task-81-diagram.png)

---

#### Screenshot 13 — Claude Code output after running `/ansible-risk-review`

[Claude Code output after running `/ansible-risk-review`](screenshots/task-82-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Why does this skill allow `Bash`, `Read`, and `Grep`?**

Bash is required to run the read-only script (./ansible-check-review.sh), while Read and Grep allow the AI to inspect and parse the generated report (reports/ansible-risk-report.txt) and playbook files without modifying anything.

---

**2. Why does this skill not allow file editing?**

Excluding file-editing tools (Edit, Write) prevents the AI agent from accidentally altering playbooks, modifying configuration settings, or bypassing safety guardrails during a risk assessment.

---

**3. What part is handled by Bash?**

Bash handles running ansible-playbook --check --diff, executing string pattern matching against task diffs, and outputting the raw report to disk.

---

**4. What part is handled by Claude Code?**

Claude Code interprets the generated report, translates technical log findings into clear executive risk summaries, and alerts the human operator whether it is safe to apply or if manual review is required.

---

**5. Why is this better than asking Claude Code if the playbook is safe without giving it evidence?**

Asking an AI agent without execution evidence leads to speculative assumptions or hallucinations. Combining actual Ansible dry-run diffs (--check --diff) with structured Bash pattern checks provides concrete empirical evidence for the AI to analyze accurately.

---

# Task 7 — Introduce a Controlled Risky Change and Let the Skill Catch It

## Goal

Add a small controlled risky change in your lab playbook and confirm the script and Claude Code catch it before applying.

### Evidence

#### Screenshot 14 — The added risky task inside the role file

[The added risky task inside the role file](screenshots/task-83-diagram.png)

---

#### Screenshot 15 — Output of `./ansible-check-review.sh`

[Output of `./ansible-check-review.sh`](screenshots/task-84-diagram.png)

---

#### Screenshot 16 — Claude Code `/ansible-risk-review` output showing the risky finding

[Claude Code `/ansible-risk-review` output showing the risky finding](screenshots/task-82-diagram.png)

---

#### Screenshot 17 — Output of `cat reports/risky-change-report.txt`

[Output of `cat reports/risky-change-report.txt`](screenshots/task-85-diagram.png)

---

### Notes

Answer the following in your own words:

**1. Which risk category did the added task fall into?**

It fell into the CRITICAL risk category because it used state: absent to perform a file/directory deletion.

---

**2. What evidence proves the task would change something?**

The --check --diff dry-run output listed the task TASK [common : CRITICAL: Remove legacy configuration backup directory] as changed: [web1].

---

**3. Did Claude Code apply the playbook?**

No. Claude Code only analyzed the dry-run output and generated the report, abiding by the CLAUDE.md read-only guardrails.

---

**4. Why is it important that Claude Code only analyzed the risk?**

Keeping the agent in a read-only analysis role prevents automated destructive actions on live servers, enforcing the "Human-in-the-Loop" paradigm where critical changes require explicit human approval.

---

**5. Which phase of the Agentic Loop is represented by the Bash report?**

The Bash report represents the Observe/Gather and Analyze phases of the Agentic Loop, collecting state diffs and evaluating them against rules before any action step.

---

# Task 8 — Apply as the Human, Verify, and Write the Change Summary

## Goal

Review the risky-change report, apply the playbook manually as the human operator, and verify the result.

### Evidence

#### Screenshot 18 — Output of the real playbook run showing the final recap with `failed=0`

[Output of the real playbook run showing the final recap with `failed=0`](screenshots/task-86-diagram.png)

---

#### Screenshot 19 — Output of `ansible web -i inventory.ini -m ping`

[Output of `ansible web -i inventory.ini -m ping`](screenshots/task-87-diagram.png)

---

#### Screenshot 20 — Second `/ansible-risk-review` output after applying the change

[Second `/ansible-risk-review` output after applying the change](screenshots/task-88-diagram.png)

---

#### Screenshot 21 — Output of `ls -lah reports`

[Output of `ls -lah reports`](screenshots/task-89-diagram.png)

---

#### Screenshot 22 — `change-summary.md` showing all required sections and your Full Name

[`change-summary.md` showing all required sections and your Full Name](screenshots/task-90-diagram.png)

---

### Notes

Answer the following in your own words:

**1. What command did you run to apply the change for real?**

ansible-playbook -i inventory.ini site.yml

---

**2. Who made the final decision to apply the playbook?**

The human operator (Cho Kar Hin) made the decision after reviewing the risk report generated during the dry run.

---

**3. What evidence proves the VM is still reachable?**

Executing ansible web -i inventory.ini -m ping post-apply returned a SUCCESS status with a "ping": "pong" JSON response over SSH.

---

**4. Why should the risk review be run again after applying?**

Running the risk review post-apply verifies idempotency. It confirms that all intended changes were successfully applied and that subsequent dry runs yield 0 changed tasks and exit code 0.

---

**5. What could go wrong if an AI agent applied Ansible changes automatically?**

An autonomous AI agent could execute destructive tasks, delete critical database volumes or configuration files, cause unintended service downtime, or apply unverified changes without human oversight or fallback control.

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

# Required Files

Confirm that the following files are included in your GitHub repository or assignment folder:

- [ ] `CLAUDE.md`
- [ ] `ansible-check-review.sh`
- [ ] `.claude/skills/ansible-risk-review/SKILL.md`
- [ ] `reports/risky-change-report.txt`
- [ ] `reports/post-apply-report.txt`
- [ ] `change-summary.md`

---

# Submission Instructions

- Add all required screenshots in your submission.
- Full Name must be visible in required screenshots and reports.
- All required notes must be answered clearly.
- Do not expose SSH private keys, passwords, cloud credentials, database credentials, or secret environment variables.
- Add your GitHub repository or folder URL inside this document.
- Submit only your Google Doc link.

---

# Completion Checklist

- [ ] Task 1: EpicBook connectivity confirmed and workspace created
- [ ] Task 2: `CLAUDE.md` created with safety rules
- [ ] Task 3: Claude Code produced a read-only risk-review plan
- [ ] Task 4: `ansible-check-review.sh` created and syntax checked
- [ ] Task 5: Baseline dry-run review completed
- [ ] Task 6: Claude Code `/ansible-risk-review` skill created and tested
- [ ] Task 7: Controlled risky change introduced and detected
- [ ] Task 8: Human applied the change and verified the result
- [ ] Risky-change report saved
- [ ] Post-apply report saved
- [ ] Change summary completed
- [ ] All screenshots added
- [ ] All notes answered
- [ ] LinkedIn post published
- [ ] LinkedIn post URL added
- [ ] No sensitive information exposed
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
