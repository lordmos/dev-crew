# Quick Start

## Install

```bash
npx skills add lordmos/dev-crew
```

Automatically installs the DevCrew protocol into your AI agent (supports Claude Code, GitHub Copilot, Cursor, Codex, and 44+ platforms).

> See [skills.sh](https://skills.sh)

## Initialize Your Project

After install, type in your AI chat:

```
/crew.init
```

The AI will create the workspace:

```
your-project/
├── INSTRUCTIONS.md    ← AI behavior instructions (core file)
├── dev-crew.yaml       ← Project configuration
└── dev-crew/
    ├── resume.md      ← Orchestration state
    ├── blockers.md    ← Issue tracking
    ├── specs/         ← Shared specifications
    ├── memory/        ← Agent long-term memory
    └── templates/     ← Document format templates
```

## Start Working

After initialization, describe what you need in natural language. The AI automatically follows the PDEVI workflow:

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

> 📖 Next: Read the [Guide](./guide) to learn about all Skills and work modes.
