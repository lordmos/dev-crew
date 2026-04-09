# Quick Start

## Install

```bash
npm install -g @lordmos/dev-crew
```

> Requires Node.js 18+

## Initialize Your Project

```bash
cd your-project
crew init
```

`crew init` creates:

```
your-project/
├── INSTRUCTIONS.md    ← AI behavior instructions (core file)
├── dev-crew.yaml       ← Project configuration
└── dev-crew/
    ├── resume.md      ← Orchestration state
    ├── blockers.md    ← Issue tracking
    ├── specs/         ← Shared specifications
    └── memory/        ← Agent long-term memory
```

## Start Working

Open any AI assistant (Copilot, Claude, Cursor, etc.). The AI automatically reads `INSTRUCTIONS.md`, assembles the team, and follows the PDEVI workflow.

```
You: I need to add auth middleware to the API

AI:  [PdM] Creating change add-api-auth, mode: Standard
     Plan — Requirements:
     - Goal: Add JWT auth to all /api/ routes
     - Acceptance: [ ] No token → 401  [ ] Expired token → 401
     Please confirm.

You: Confirmed

AI:  Design → Execute → Verify — All passed. Please confirm acceptance.

You: Confirmed

AI:  [OK] Change add-api-auth complete.
```

You only confirm twice (requirements + results). Everything else is automatic.

## View Available Specialists

```bash
crew agents
```

Activate in `dev-crew.yaml`:

```yaml
specialists:
  - game-designer
  - security-engineer
```
