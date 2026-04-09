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

For specific platforms (auto-creates platform instruction files):

```bash
crew init --platform copilot    # → .github/copilot-instructions.md
crew init --platform cursor     # → .cursorrules
crew init --platform claude     # → CLAUDE.md
crew init -p copilot cursor     # Multiple platforms at once
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
    ├── memory/        ← Agent long-term memory
    └── templates/     ← Document format templates
```

## Start Working

After initialization, open your AI assistant (Copilot, Claude, Cursor, etc.) and describe what you need in natural language. The AI automatically reads `INSTRUCTIONS.md` and follows the PDEVI workflow:

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

> 💡 Besides natural language, you can also trigger Skills via CLI (`crew plan`) or MCP Server. See the [Guide](./guide) for details.

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
