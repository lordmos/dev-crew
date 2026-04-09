# Guide

## How to Work with DevCrew

The core of DevCrew is **INSTRUCTIONS.md** — it turns any AI into a dev team that follows a structured workflow. After initialization, there are three ways to invoke Skills:

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

### 2. CLI (Terminal)

Run directly in the terminal:

```bash
crew plan add-auth -m standard    # Create a change plan
crew status                       # Check progress
crew checkpoint                   # Phase audit
crew release                      # Archive changes
```

### 3. MCP Server (AI Tool Calls)

Let AI call Skills directly via the [Model Context Protocol](https://modelcontextprotocol.io/).

**VS Code (GitHub Copilot)**: Add to `.vscode/settings.json`:

```json
{
  "mcp": {
    "servers": {
      "dev-crew": {
        "command": "crew-mcp"
      }
    }
  }
}
```

**Cursor**: Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "dev-crew": {
      "command": "crew-mcp"
    }
  }
}
```

Once configured, AI can directly call `crew_plan`, `crew_status`, and other tools.

> **Mix and match**: Use natural language for daily collaboration, CLI for quick ops, MCP for autonomous AI tool calls.

---

## Three Work Modes

| Mode | Flow | Best For |
|------|------|----------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | New features, refactoring |
| **Express** | Plan → Execute → Verify | Bug fixes |
| **Prototype** | Plan → Design → Execute | Quick prototyping |

## Skills

| Skill | CLI | MCP Tool | Purpose |
|-------|-----|----------|---------|
| **init** | `crew init` | `crew_init` | Initialize workspace + agent memory files |
| **plan** | `crew plan <name>` | `crew_plan` | Create a change and start working |
| **status** | `crew status` | `crew_status` | Check current progress |
| **checkpoint** | `crew checkpoint` | `crew_checkpoint` | Phase audit + consistency check + memory sync |
| **release** | `crew release` | `crew_release` | Archive changes + consolidate memory |
| **agents** | `crew agents` | `crew_agents` | List available specialists |

> Natural language works too — "run a checkpoint" triggers the checkpoint skill

## Built-in Team

| Agent | Responsibility |
|-------|---------------|
| <i class="fas fa-bullseye"></i> **PjM** Project Manager | Task decomposition, agent coordination, progress tracking |
| <i class="fas fa-clipboard-list"></i> **PdM** Product Manager | Requirements analysis, PRD import, acceptance criteria |
| <i class="fas fa-drafting-compass"></i> **Architect** | Tech decisions, task decomposition, dependency analysis |
| <i class="fas fa-code"></i> **Implementer** | Code generation, refactoring, dependency management |
| <i class="fas fa-vial"></i> **Tester** | Test execution, acceptance checks, coverage |
| <i class="fas fa-magnifying-glass"></i> **Reviewer** | Code review, security scanning, best practices |

PjM assembles the team on demand, creating additional agents as needed — no manual assignment required.

## Agent Memory

Each agent maintains a long-term memory file in `dev-crew/memory/`, accumulating project knowledge, patterns, and preferences across changes. Memory is consolidated on release and auto-loaded on new sessions — the team gets better the more you use it.
