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

| Role | Responsibility |
|------|---------------|
| 🎯 **PjM** Project Manager | Orchestration, mode inference, stage transitions |
| 📋 **PdM** Product Manager | Requirements analysis, PRD import, acceptance criteria |
| 🏗️ **Architect** | Tech decisions, task decomposition, dependency analysis |
| 💻 **Implementer** | Code generation, refactoring, dependency management |
| 🧪 **Tester** | Test execution, acceptance checks, coverage |
| 👀 **Reviewer** | Code review, security scanning, best practices |

Role switching is fully automatic — no manual assignment needed.
