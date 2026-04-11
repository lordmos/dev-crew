# Guide

## How to Work with DevCrew

The core of DevCrew is **INSTRUCTIONS.md** — it turns any AI into a dev team that follows a structured workflow. After installation, there are two ways to invoke Skills:

### 1. Natural Language (Recommended)

Describe what you need in AI chat. The AI automatically follows the PDEVI workflow:

```
You: I need to add auth middleware to the API
AI:  [PdM] Creating change add-api-auth, mode: Standard …
```

Common natural language triggers:

| What you say | Skill triggered |
|-------------|----------------|
| "Let's make a plan" / "I want to add a feature" | plan |
| "What's the status?" / "Show progress" | status |
| "Run a checkpoint" / "Audit this" | checkpoint |
| "Archive it" / "This one's done" | release |

### 2. Skill Commands

Use skill commands directly in your AI chat:

```
/crew.plan        # Create a change plan
/crew.status      # Check progress
/crew.checkpoint  # Phase audit
/crew.release     # Archive changes
```

> **Mix and match**: Use natural language for daily collaboration, skill commands for quick operations.

---

## Skills Reference

Use these skill commands in your AI chat after installation:

| Skill | Command | Purpose |
|-------|---------|---------|
| **init** | `/crew.init` | Initialize workspace + agent memory files |
| **plan** | `/crew.plan` | Create a change and start working |
| **status** | `/crew.status` | Check current progress |
| **checkpoint** | `/crew.checkpoint` | Phase audit + consistency check + memory sync |
| **release** | `/crew.release` | Archive changes + consolidate memory |
| **agents** | `/crew.agents` | List available specialists |

> Natural language works too — "run a checkpoint" triggers the checkpoint skill

---

## Three Work Modes

| Mode | Flow | Best For |
|------|------|----------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | New features, refactoring |
| **Express** | Plan → Execute → Verify | Bug fixes |
| **Prototype** | Plan → Design → Execute | Quick prototyping |

---

## What You Need to Do

During the workflow, the AI only needs your input at two points:

| When | What you do | Why |
|------|------------|-----|
| **Plan confirmation** | Review AI's requirements summary, say "confirmed" or suggest edits | Ensure correct understanding |
| **Verify confirmation** | Review test results, say "confirmed" or point out issues | Ensure quality |

> Prototype mode has no Verify step, so you only confirm once. The rest of the time, AI progresses automatically.

---

## Built-in Team

PjM assembles the team on demand based on your needs. Common roles:

| Agent | Responsibility |
|-------|---------------|
| <i class="fas fa-bullseye"></i> **PjM** Project Manager | Task decomposition, agent coordination, progress tracking |
| <i class="fas fa-clipboard-list"></i> **PdM** Product Manager | Requirements analysis, PRD import, acceptance criteria |
| <i class="fas fa-drafting-compass"></i> **Architect** | Tech decisions, task decomposition, dependency analysis |
| <i class="fas fa-code"></i> **Implementer** | Code generation, refactoring, dependency management |
| <i class="fas fa-vial"></i> **Tester** | Test execution, acceptance checks, coverage |
| <i class="fas fa-magnifying-glass"></i> **Reviewer** | Code review, security scanning, best practices |

> Team size is dynamic — PjM creates additional agents (DBA, tech writer, ops) as needed. No manual assignment required.

## Agent Memory

Each agent maintains a long-term memory file in `dev-crew/memory/`, accumulating project knowledge, patterns, and preferences across changes. Memory is consolidated on release and auto-loaded on new sessions — the team gets better the more you use it.

---

## File Structure

The AI creates the following files in your project (all under `dev-crew/`, excluded by .gitignore by default):

```
project-root/
├── dev-crew.yaml                    ← Project config (committed)
└── dev-crew/                        ← AI workspace (not committed)
    ├── resume.md                     ← Project state snapshot
    ├── blockers.md                   ← Issues and decisions
    ├── changes/
    │   └── {change-name}/
    │       ├── proposal.md           ← Requirements (Plan output)
    │       └── design.md             ← Technical design (Design output)
    └── archive/                      ← Archived changes
```

You don't usually need to edit these files directly, but you can view them anytime.

---

## Configuration

Project root `dev-crew.yaml`:

```yaml
project:
  name: my-project

verify:
  test_command: "npm test"        # If set, uses test command for verification; otherwise AI reviews
```

> Most defaults are fine. The only recommended config is `verify.test_command`.

### Domain Specialists (Optional)

If your project involves specific domains, activate built-in specialists — the AI will automatically dispatch experts at relevant PDEVI phases:

```yaml
# dev-crew.yaml
specialists:
  - game-designer
  - security-engineer
```

- Not configured = team works independently (zero impact)
- Configured = experts auto-participate at relevant phases (no manual dispatch)

> Full directory and recommendations at [Specialists](./specialists).
