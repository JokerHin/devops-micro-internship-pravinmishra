# Assignment 6 — Building an AI-Assisted Git Safety Net (PR Ready Check)

Part of the DevOps Micro Internship (DMI) Cohort 3 with Agentic AI

---

## Purpose

In Week 2 you built Claude Code hooks that block a dangerous action _before_ it happens (`PreToolUse`), and a restricted skill that could look but not touch (`allowed-tools` without `Write`). In this assignment you will discover that Git has the exact same idea, decades older: a **pre-commit hook** that blocks a commit before it's created.

You will build both halves of a real "PR Ready" workflow:

1. A **Git hook that follows fixed rules** — scans staged changes for hardcoded secrets and oversized files and refuses the commit. No AI involved, no guessing, just a rule that gives the same answer every time.
2. A **restricted Claude Code skill** (`/pr-ready`) that reads your staged diff and drafts a Pull Request title, description, and a short list of things worth a second look — the kind of judgment a fixed rule can't make (mixed changes, missing context, unclear intent). The skill never commits, pushes, or opens the PR. You do that yourself, using its draft as a starting point.

This mirrors the Agentic Loop from Week 3's Linux triage assignment: **Gather → Analyze → Human Act → Verify**. The hook and the skill both gather and analyze; only you act.

---

# Task 0 — Confirm Your Fork and Create a Feature Branch

## Goal

Confirm you are working in your own fork, then create a dedicated branch for this assignment.

### Evidence

#### Screenshot 1 — Output of git remote -v and git branch showing the new branch

![Output of git remote -v and git branch showing the new branch](screenshots/task-47-diagram.png)

---

### Notes

**1. Why create a dedicated branch instead of doing this work on main?**

A dedicated branch isolates work-in-progress experiments from the stable default branch (main). This prevents broken code, incomplete features, or unverified hook experiments from polluting the production baseline, enables clean peer reviews through Pull Requests, and makes rollbacks trivial if an approach is abandoned.

---

# Task 1 — Stage a Change With Realistic Risk

## Goal

On your own fork of this repository (the one you've been submitting your DMI work in since onboarding), create a new branch and stage a change that a real reviewer should catch: a hardcoded-looking secret and a leftover debug statement.

### Evidence

#### Screenshot 1 — Output of `git status` showing the staged file on feature/ai-pr-ready

![Output of `git status` showing the staged file on feature/ai-pr-ready](screenshots/task-48-diagram.png)

---

### Notes

**1. Why does this assignment use an obviously fake key instead of a real one?**

Real secrets must never touch version control. Even if a commit is amended or deleted locally, unencrypted credentials staged or pushed to remotes can leak into git reflogs, caching proxies, and public scrapers. Using an industry-standard fake key (like AWS's official documentation dummy key AKIAIOSFODNN7EXAMPLE) ensures that detection rules can trigger reliably without introducing actual security vulnerability or leaking valid infrastructure credentials.

---

# Task 2 — Write a Real Git Pre-Commit Hook

## Goal

Create a tracked, shareable pre-commit hook that blocks a commit containing secret-like patterns or files over 1MB.

### Evidence

#### Screenshot 2 — `hooks/pre-commit` open in VS Code showing the full script

![`hooks/pre-commit` open in VS Code showing the full script](screenshots/task-49-diagram.png)

---

#### Screenshot 3 — Output of `git config core.hooksPath` confirming it points to `hooks`

![Output of `git config core.hooksPath` confirming it points to `hooks`](screenshots/task-50-diagram.png)

---

### Notes

**1. Why is `hooks/pre-commit` tracked in the repo instead of living only in `.git/hooks/`?**

The .git/hooks directory is ignored by Git and never pushed to remotes, meaning hooks saved there only protect the local clone and cannot be shared with team members. Placing the script inside a tracked directory (hooks/) and setting core.hooksPath hooks allows the pre-commit rules to be version-controlled, reviewed, and uniformly adopted by everyone who clones the repository.

---

**2. Compare this to `PreToolUse` from Week 2 Assignment 6. What does each one intercept, and what do they have in common?**

Git pre-commit hook: Intercepts git commit commands at the shell level, evaluating staged diffs before the commit object is written to the Git object database.
Claude Code PreToolUse hook: Intercepts an AI agent's tool invocation request (e.g., executing Bash or Write tools) before the action runs in the environment.
Commonality: Both serve as shift-left deterministic guardrails. They intercept actions at execution boundaries and enforce non-negotiable safety rules before permanent state modifications occur.

---

# Task 3 — Prove the Hook Blocks the Risky Commit

## Goal

Attempt to commit the staged file from Task 1 and show the hook rejecting it.

### Evidence

#### Screenshot 4 — Terminal showing `git commit` rejected with the hook's "BLOCKED" message naming the exact file

![Terminal showing `git commit` rejected with the hook's "BLOCKED" message naming the exact file](screenshots/task-51-diagram.png)

---

### Notes

**1. Which line in `hooks/pre-commit` matched your fake key, and why did it match?**

The regular expression (AKIA[0-9A-Z]{16}|BEGIN PRIVATE KEY|ghp\_[0-9a-zA-Z]{36}) evaluated against the added lines (^\+[^+]) matched the fake key. It matched because AKIAIOSFODNN7EXAMPLE starts with the literal string AKIA followed by exactly 16 uppercase alphanumeric characters (IOSFODNN7EXAMPLE), satisfying the standard AWS Access Key ID format pattern.

---

**2. Could this hook have caught a poorly-named variable that stores a secret without the `AKIA` prefix? What does that tell you about the limits of a fixed rule like this?**

No. A fixed regex scanner only detects specific, hardcoded syntactic tokens (such as known vendor prefixes or key banners). If a credential is named my_token = "9f83a..." or lacks a recognizable prefix, a static regex will pass it without warning. This demonstrates that fixed deterministic rules excel at precision for known patterns, but are blind to semantic context, obfuscation, or unconventional variable declarations.

---

# Task 4 — Build the `/pr-ready` Skill

## Goal

Create a manually invoked Claude Code skill that reads your staged changes and produces a PR-readiness report and a draft PR description — without writing, committing, or pushing anything itself.

### Evidence

#### Screenshot 5 — `SKILL.md` frontmatter showing `allowed-tools: Bash, Read, Grep` (no `Write`) and `disable-model-invocation: true`

![Terminal showing `git commit` rejected with the hook's "BLOCKED" message naming the exact file](screenshots/task-52-diagram.png)

---

#### Screenshot 6 — `/pr-ready` output while the risky file is still staged, showing it flagged the secret and/or debug statement

![`/pr-ready` output while the risky file is still staged, showing it flagged the secret and/or debug statement](screenshots/task-53-diagram.png)

---

### Notes

**1. Why does `/pr-ready` have `Bash` and `Read` but not `Write`?**

Restricting /pr-ready to Bash and Read enforces a strict read-only boundary. The skill's sole responsibility is reconnaissance, telemetry gathering, and semantic reasoning. Omitting Write prevents the AI from altering code, overwriting configuration, or mutating repo state without human sign-off.

---

**2. The pre-commit hook and `/pr-ready` both looked at the same staged diff. Did they flag the same things? What did one catch that the other didn't?**

Both tools successfully flagged the hardcoded AKIA secret. However:
The pre-commit hook caught only the exact regex pattern match and enforced a hard exit code block, completely ignoring the console.log("DEBUG...") statement.
The /pr-ready skill understood semantic intent: it identified the console.log statement as residual development artifact that degrades code hygiene, and contextualized how the changes impact overall PR quality.

---

# Task 5 — Fix the Issues and Re-Verify

## Goal

Remove the secret and debug statement, then prove both gates now pass clean.

### Evidence

#### Screenshot 7 — `git commit` succeeding after the fix (no BLOCKED message)

![`git commit` succeeding after the fix (no BLOCKED message)](screenshots/task-54-diagram.png)

---

#### Screenshot 8 — Second `/pr-ready` run showing a clean risk report and a drafted PR title + description

![Second `/pr-ready` run showing a clean risk report and a drafted PR title + description](screenshots/task-55-diagram.png)

---

### Notes

**1. What exactly did you change to satisfy the pre-commit hook?**

Replaced the literal string AKIAIOSFODNN7EXAMPLE with process.env.AWS_ACCESS_KEY_ID || "", eliminating hardcoded credential patterns from the diff, and removed the console.log("DEBUG...") statement.

---

# Task 6 — Push and Open a Pull Request Using the AI Draft

## Goal

Push your branch and open a real Pull Request, using `/pr-ready`'s drafted title and description as your starting point — read it critically and edit before you use it.

**Important:** Open this Pull Request with base repository set to **your own fork** — not the shared upstream `pravinmishraaws/devops-micro-internship-pravinmishra` repository. This assignment's hook and skill files are your own practice work, not a change meant for the shared class repo.

### Evidence

#### Screenshot 9 — Your Pull Request showing the base repository is your own fork, plus the title and description, with the `/pr-ready` draft visible for comparison (paste it in the PR conversation or your notes below)

![Evidence](screenshots/task-56-diagram.png)

---

#### PR Link

`https://github.com/pravinmishraaws/devops-micro-internship-pravinmishra/pull/253`

---

### Notes

**1. What, if anything, did you edit in the AI's drafted PR description before using it? Why?**

Refined the testing and verification bullet points to reference the exact scripts and commands tested (hooks/pre-commit and core.hooksPath). While the AI drafted a strong conceptual summary, human operators must ensure testing details match actual terminal verification steps.

---

**2. If you had blindly copy-pasted the AI's draft without reading it, what could go wrong?**

Blindly pasting AI drafts risks publishing hallucinated test results, inaccurate technical claims, or missing edge cases. If the model assumed tools or dependencies were added that weren't part of the diff, the Pull Request becomes misleading and fails peer audit.

---

**3. Why does this PR need to target your own fork instead of the shared upstream repository?**

This assignment involves personalized configuration, custom hooks, and student-specific experimentation. Submitting these changes to the upstream class repository would clutter shared course infrastructure with individual practice code. Opening the PR against your own fork simulates the complete PR review lifecycle in an isolated sandbox.

---

# Task 7 — Map the Workflow to the Agentic Loop

## Goal

Explain this assignment's workflow using the same Gather → Analyze → Human Act → Verify structure from Week 3.

### Notes

**1. Which step(s) represent Gather?**

The pre-commit hook executing git diff --cached --name-only and the /pr-ready skill reading git diff --cached represent the Gather phase. Both tools extract staged delta telemetry directly from the Git index without altering state.

---

**2. Which step(s) represent Analyze?**

The regex matching engine in hooks/pre-commit evaluating byte sizes and patterns, alongside Claude Code evaluating code semantics, detecting leftover debug statements, and assessing overall PR readiness represent the Analyze phase.

---

**3. Which step is Human Act, and why must a human — not Claude — run `git commit`, `git push`, and open the PR?**

Removing the secret from test-config.js, running git commit, executing git push, and clicking "Create pull request" represent the Human Act phase. A human must execute these commands because code authoring and deployment commit authorization carry legal, security, and operational accountability that cannot be delegated to an automated agent.

---

**4. Which step is Verify?**

Re-attempting git commit (confirming the pre-commit hook runs and exits with status 0) and running the second /pr-ready review (confirming a clean risk report and READY verdict) represent the Verify phase.

---

**5. In one or two sentences: why do you need _both_ the fixed-rule pre-commit hook and the AI skill? Isn't one enough?**

A fixed-rule hook provides deterministic, zero-tolerance enforcement for known syntactic hazards (like regex patterns and file sizes), while the AI skill provides contextual, semantic judgment on code hygiene, debug logs, and intent that static regex cannot evaluate. Together, they form defense-in-depth: absolute enforcement at the gate plus intelligent analysis before submission.

---

# Task 8 — LinkedIn Post

## Goal

Publish a LinkedIn post summarizing what you built and what you learned about combining fixed-rule safety checks with AI-assisted review.

### Evidence

#### LinkedIn Post URL

`https://www.linkedin.com/posts/kar-hin-cho_devops-dmi-devopsmicrointernship-share-7507360155022565376-Ayat/`

---

## Key Learnings

Add 3-5 bullet points on what you learned this week.

- Tracked vs Untracked Hooks: Moving hooks from .git/hooks/ to a tracked hooks/ directory paired with git config core.hooksPath hooks makes client-side security policies shareable across team clones.
- Deterministic vs Semantic Auditing: Regex patterns deliver immediate, binary enforcement against known credential signatures, whereas agentic tools analyze semantic intent, finding subtle hygiene issues like debug calls.
- Read-Only Agent Boundaries: Setting disable-model-invocation: true and omitting Write permissions keeps AI agents in an advisory capacity, preserving human accountability over production commits.

# Submission Instructions

- Ensure `hooks/pre-commit` and `.claude/skills/pr-ready/SKILL.md` are committed to your GitHub repository
- Add all required screenshots to your submission
- All written answers must be in your own words
- Do not use a real secret or credential anywhere in your submission — the fake key in Task 1 is intentional and must stay clearly fake
- Open your Pull Request against your own fork, not the shared upstream repository
- Push your final changes to your forked repository
- Include your PR link and LinkedIn post URL

---

## GitHub Repository URL

Paste your forked repository URL here:

`https://github.com/JokerHin/devops-micro-internship-pravinmishra`

---

# Completion Checklist

- [ ] Branch `feature/ai-pr-ready` created with a staged file containing a fake secret and a debug statement
- [ ] `hooks/pre-commit` created and tracked in the repo (not only in `.git/hooks/`)
- [ ] `core.hooksPath` configured to point at `hooks/`
- [ ] Pre-commit hook shown blocking the risky commit
- [ ] `.claude/skills/pr-ready/SKILL.md` created with correct `allowed-tools` (no `Write`) and `disable-model-invocation: true`
- [ ] `/pr-ready` run against the risky diff and shown flagging issues
- [ ] Risky file fixed; `git commit` succeeds cleanly
- [ ] `/pr-ready` re-run showing a clean report and drafted PR title/description
- [ ] Pull Request opened using the AI draft as a starting point, with your own fork as the base repository (not upstream), PR link included
- [ ] Agentic Loop mapping (Task 7) completed in your own words
- [ ] LinkedIn post published and URL submitted
- [ ] All required screenshots added
- [ ] GitHub repository URL provided

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
