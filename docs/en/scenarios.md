# Use Cases

| Scenario | You say | DevCrew does |
|----------|---------|-------------|
| Greenfield | "I have an idea, build from scratch" | Init → guide requirements → Standard |
| Existing PRD | "Here's the PRD, execute it" | Import PRD → refine → Standard |
| Mid-project | "Code exists, help me continue" | Scan code → establish baseline → Standard |
| Brainstorm | "Let's discuss the approach" | `/crew:explore` (no code changes) |
| Bug fix | "There's a bug, fix it fast" | Express mode |
| Refactor | "This code needs refactoring" | Standard (full workflow) |
| Prototype | "Build a quick prototype first" | Prototype mode |
| Learn codebase | "Help me understand this code" | `/crew:explore` (code analysis) |

## Greenfield

When you have a new idea, tell the AI. DevCrew auto-enters Standard mode:

1. **Plan** — AI guides you through requirements, defines acceptance criteria
2. **Design** — Generates technical design and task breakdown
3. **Execute** — Code implementation
4. **Verify** — Automated testing and code review
5. **Iterate** — Issues auto-fixed

## Bug Fix

Bug fixes use Express mode (skip Design):

1. **Plan** — Locate issue, confirm fix target
2. **Execute** — Code the fix
3. **Verify** — Validate the fix

## Quick Prototype

Prototyping uses Prototype mode (skip Verify + Iterate):

1. **Plan** — Define prototype goals
2. **Design** — Quick technical approach
3. **Execute** — Rapid implementation
