# Guide

## Three Work Modes

| Mode | Flow | Best For |
|------|------|----------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | New features, refactoring |
| **Express** | Plan → Execute → Verify | Bug fixes |
| **Prototype** | Plan → Design → Execute | Quick prototyping |

## Skill Commands

| Command | Purpose |
|---------|---------|
| `/crew:init` | Initialize workspace |
| `/crew:plan <name>` | Create a change and start working |
| `/crew:status` | Check current progress |
| `/crew:explore` | Discuss / analyze (no code changes) |
| `/crew:release` | Archive completed changes |

> Natural language works too — "show me the progress" = `/crew:status`

## Built-in Team

| Agent | Responsibility |
|-------|---------------|
| <i class="fas fa-bullseye"></i> **PjM** Project Manager | Task decomposition, agent coordination, progress tracking |
| <i class="fas fa-clipboard-list"></i> **PdM** Product Manager | Requirements analysis, PRD import, acceptance criteria |
| <i class="fas fa-drafting-compass"></i> **Architect** | Tech decisions, task decomposition, dependency analysis |
| <i class="fas fa-code"></i> **Implementer** | Code generation, refactoring, dependency management |
| <i class="fas fa-vial"></i> **Tester** | Test execution, acceptance checks, coverage |
| <i class="fas fa-magnifying-glass"></i> **Reviewer** | Code review, security scanning, best practices |

PjM orchestrates the entire team — multiple agents work in parallel, no manual assignment needed.

## Agent Memory

Each agent maintains a long-term memory file in `dev-crew/memory/`, accumulating project knowledge, patterns, and preferences across changes. Memory is consolidated on release and auto-loaded on new sessions — the team gets better the more you use it.
