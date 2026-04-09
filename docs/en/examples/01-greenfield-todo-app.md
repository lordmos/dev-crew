# Best Practice 1: Building a Todo App from Scratch

> **Linked Scenarios**: Scenario 1 (Greenfield) → Scenario 5 (Bug Fix) → Scenario 7 (Quick Prototype)
> **Project Story**: Xiaoming uses AI to build a Todo app from scratch, encounters a bug during development, and later tries out a new feature prototype.

---

## Act 1: Starting from Scratch (Scenario 1, Standard Mode)

### Step 1 — Initialization

```
You: Help me initialize DevCrew, I'm using Copilot
```

```bash
crew init --platform copilot
```

The AI created these files:

```
project-root/
├── INSTRUCTIONS.md               ← AI behavior instructions (core protocol)
├── .github/copilot-instructions.md  ← Auto-read by Copilot
├── dev-crew.yaml
├── .gitignore
└── dev-crew/
    ├── resume.md
    ├── blockers.md
    ├── templates/                ← Document format templates
    │   ├── proposal.md
    │   ├── design.md
    │   ├── impl-log.md
    │   ├── test-report.md
    │   └── review-report.md
    └── memory/                   ← Agent long-term memory
        ├── pdm.md
        ├── architect.md
        ├── implementer.md
        ├── tester.md
        └── reviewer.md
```

**dev-crew.yaml**:
```yaml
project:
  name: todo-app
  description: ""
workflow:
  default_mode: standard
  concurrent_changes: true
verify:
  test_command: ""
git:
  ignore_dev_crew: true
```

### Step 2 — Plan Phase

```
You: Build a Todo app that supports creating, completing, and deleting tasks, with tag-based categorization
```

The AI created `dev-crew/changes/todo-app-mvp/proposal.md`:

```yaml
---
mode: standard
upgraded_from: ""
plan_confirmed: false
---
```

```markdown
# Change: todo-app-mvp

## Goal
Build a command-line Todo app with task management and tag-based categorization.

## Requirements
1. Create tasks (title + optional tags)
2. List all tasks (with tag-based filtering)
3. Mark tasks as complete
4. Delete tasks
5. Data persistence (JSON file storage)

## Acceptance Criteria
- [ ] Can create tasks with tags
- [ ] Can filter tasks by tag
- [ ] Data updates correctly after completing/deleting tasks
- [ ] Data persists after restart
```

```
AI: 📋 Here are the requirements I've compiled. Please confirm or modify.
You: Confirmed
```

The AI updated `proposal.md` frontmatter: `plan_confirmed: true`

### Step 3 — Design Phase

The AI created `dev-crew/changes/todo-app-mvp/design.md`:

```markdown
# Design: todo-app-mvp

## Technical Decisions
- Language: TypeScript (Node.js)
- Storage: JSON file (~/.todo/data.json)
- CLI framework: commander.js
- Testing: vitest

## Task Breakdown
- [ ] 1. Initialize project structure (package.json, tsconfig.json)
- [ ] 2. Implement Todo data model (src/model.ts)
- [ ] 3. Implement storage layer (src/storage.ts)
- [ ] 4. Implement CLI commands (src/cli.ts)
- [ ] 5. Write tests (src/__tests__/)
```

### Step 4 — Execute Phase

The AI implemented tasks one by one from the checklist, reporting after each:

```
AI: ✅ Completed [1/5] Initialize project structure
    - Created package.json (dependencies: commander, typescript, vitest)
    - Created tsconfig.json
    - Created src/ directory

AI: ✅ Completed [2/5] Todo data model
    - Created src/model.ts (Todo interface + TodoList class)

AI: ✅ Completed [3/5] Storage layer
    - Created src/storage.ts (JSON file read/write)

AI: ✅ Completed [4/5] CLI commands
    - Created src/cli.ts (add/list/done/delete subcommands)

AI: ✅ Completed [5/5] Tests
    - Created src/__tests__/model.test.ts (8 test cases)
    - Created src/__tests__/storage.test.ts (4 test cases)
```

After Execute completed, PjM performed a checkpoint:

```
AI: 📋 Execute phase audit:
    ✅ All tasks in impl-log.md marked [x]
    ✅ Each entry has file paths + change summary
    ✅ One-to-one correspondence with design.md tasks
    Audit passed, advancing to Verify.
```

### Step 5 — Verify Phase

```
AI: 🔍 Verifying...
    Running tests: 12 passed, 0 failed
    Checking acceptance criteria one by one:
    ✅ Can create tasks with tags
    ✅ Can filter tasks by tag
    ✅ Data updates correctly after completing/deleting tasks
    ✅ Data persists after restart
    
    All passed. Please confirm acceptance.

You: Confirmed
AI: ✅ Change todo-app-mvp completed!
```

---

## Act 2: Bug Fix (Scenario 5, Express Mode)

A few days later, Xiaoming discovered a bug.

```
You: Filtering fails when a tag name contains spaces. For example, the tag "work todo"
```

The AI automatically inferred Express mode (detected a bug fix task).

### Express Flow: Plan → Execute → Verify

The AI created `dev-crew/changes/fix-tag-filter/proposal.md`:

```yaml
---
mode: express
upgraded_from: ""
plan_confirmed: false
---
```

```markdown
# Change: fix-tag-filter

## Goal
Fix the bug where filtering fails when tags contain spaces.

## Requirements
Tag matching should support tag names containing spaces.

## Acceptance Criteria
- [ ] Tags containing spaces like "work todo" can be filtered correctly
- [ ] Existing tag filtering functionality is not affected
```

```
AI: 📋 Express mode, skipping Design. Confirm requirements?
You: ok
```

The AI went straight to Execute (no Design phase, no design.md):

```
AI: ✅ Located issue: src/cli.ts:28, tag parameter split by spaces caused "work todo" to be split into two tags
    ✅ Fixed src/cli.ts:28 (switched to quote-aware argument parsing)
    ✅ Added test: src/__tests__/model.test.ts (test case for tags with spaces)
    
    Verification: 14 passed, 0 failed. Please confirm.

You: Confirmed
AI: ✅ Change fix-tag-filter completed.
```

**Note**: Express did not create a `design.md`; the entire change directory only has a single `proposal.md` file.

---

## Act 3: Quick Prototype (Scenario 7, Prototype Mode)

Xiaoming wanted to try replacing command-line arguments with a TUI interface.

```
You: Build a prototype to try using blessed for a TUI interface to see how the interaction feels
```

The AI automatically inferred Prototype mode (detected the "prototype" keyword).

### Prototype Flow: Plan → Design → Execute (no Verify)

```yaml
# dev-crew/changes/poc-tui/proposal.md frontmatter
---
mode: prototype
upgraded_from: ""
plan_confirmed: false
---
```

```
AI: 📋 Prototype mode, skipping Verify/Iterate. Confirm requirements?
You: Confirmed
```

The AI did a lightweight Design + quick Execute:

```
AI: Design:
    - Using blessed library
    - Main interface: task list + bottom command bar
    
    Execute:
    ✅ Created src/tui.ts (main interface, 192 lines)
    ✅ Created src/tui-components.ts (list component)
    
    Prototype complete. Run `npx ts-node src/tui.ts` to try it out.
    Want to make it official?
```

Xiaoming tried it and liked it:

```
You: Looks good, let's make it official
AI: ✅ Upgraded to Standard mode.
    - Reviewed existing design.md, added keyboard shortcuts and error handling
    - Entering Verify phase...
```

The AI updated `proposal.md` frontmatter: `mode: standard`, `upgraded_from: prototype`.

---

## Act 4: Wrap-up and Archive

After all three changes were completed:

```
You: Help me archive
AI: 📦 Archiving 3 completed changes:
    - todo-app-mvp (Standard)
    - fix-tag-filter (Express)
    - poc-tui (Prototype → Standard)
    
    🧠 Memory consolidation:
    - memory/pdm.md ← User preference: prefers concise CLI interactions
    - memory/architect.md ← Tech stack: TypeScript + commander + vitest
    - memory/implementer.md ← Lesson learned: blessed TUI requires special CI configuration
    - memory/tester.md ← Pattern: tests involving environment variables need a setup file
    
    Moved to dev-crew/archive/
    ✅ Archive complete.
```

---

## Summary of File Changes Throughout the Process

| Point in Time | Files Added/Changed under dev-crew/ |
|---------------|-------------------------------------|
| init skill | `resume.md`, `blockers.md`, `templates/*.md`, `memory/*.md` |
| Plan (todo-app-mvp) | `changes/todo-app-mvp/proposal.md` |
| Design | `changes/todo-app-mvp/design.md` |
| Execute → Verify → Done | resume.md updated |
| Plan (fix-tag-filter) | `changes/fix-tag-filter/proposal.md` (no design.md) |
| Execute → Verify → Done | resume.md updated |
| Plan (poc-tui) | `changes/poc-tui/proposal.md` |
| Design | `changes/poc-tui/design.md` |
| Execute → Upgrade → Verify → Done | proposal.md mode updated, resume.md updated |
| release skill | All changes/ moved to archive/ |
