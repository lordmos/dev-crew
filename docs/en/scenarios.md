# Use Cases

| Scenario | You say | DevCrew does |
|----------|---------|-------------|
| Greenfield | "I have an idea, build from scratch" | Init → guide requirements → Standard |
| Existing PRD | "Here's the PRD, execute it" | Import PRD → refine → Standard |
| Mid-project | "Code exists, help me continue" | Scan code → establish baseline → Standard |
| Brainstorm | "Let's discuss the approach" | Explore mode (no code changes) |
| Bug fix | "There's a bug, fix it fast" | Express mode |
| Refactor | "This code needs refactoring" | Standard (full workflow) |
| Prototype | "Build a quick prototype first" | Prototype mode |
| Learn codebase | "Help me understand this code" | Explore mode (code analysis) |

---

## Greenfield — "I have an idea, build from scratch"

```
You: Help me initialize the DevCrew workspace
AI:  [OK] Created dev-crew/ workspace. What project do you want to build?

You: A Todo app with CRUD and tag categories
AI:  [PdM] Sure, let me gather requirements. Here's my understanding:
     [Shows proposal.md draft with goals, requirements, acceptance criteria]
     Please confirm or suggest changes.

You: Confirmed
AI:  [OK] Requirements confirmed. Starting technical design...
     [Auto-enters Design → Execute → Verify flow]
```

**Key**: Describe your idea + confirm requirements. AI handles Plan → Design → Execute → Verify automatically.

---

## Existing PRD — "Here's the PRD, execute it"

```
You: The requirements doc is at docs/requirements.md, execute it
AI:  [Doc] Imported requirements document, analyzing...
     [Shows proposal.md extracted from PRD]
     Please confirm this accurately reflects the requirements.

You: The "user roles" section is too vague. Add: need admin and regular user roles
AI:  [OK] Updated. Starting design...
```

**Key**: Import existing requirements → AI refines into proposal → you confirm/adjust → auto-proceeds.

---

## Mid-project — "Code exists, help me continue"

```
You: Code already exists, scan the project for me
AI:  [Scan] Scanning project code...
     
     Project overview:
     - Language: TypeScript + React
     - Structure: src/components/ (12), src/api/ (5), src/utils/ (3)
     - Tests: Jest, ~60% coverage
     - Dependencies: express, prisma, zod
     
     Workspace created. What do you want to work on?

You: I need to add auth middleware to the API
AI:  [PdM] Got it, creating change add-api-auth...
```

**Key**: AI scans code to establish baseline, then you describe what to do next.

---

## Brainstorm — "Let's discuss the approach"

```
You: I'm considering state management — Redux or Zustand?
AI:  Based on your project analysis:
     - Current project is small (12 components)
     - No complex async data flows
     - Recommend Zustand: simpler API, smaller bundle
     [Detailed comparison...]

You: Makes sense, let's go with Zustand. Do the migration
AI:  Creating change migrate-to-zustand, mode: Standard
     [Auto-enters plan flow]
```

**Key**: Explore mode discusses without changing code. When you decide, it transitions to a formal change.

---

## Bug Fix — "There's a bug, fix it fast"

```
You: Users sometimes get a 403 after login, check it
AI:  [Scan] Detected bug fix task, creating Express change fix-403-on-login
     Mode: Express (skip Design, fix directly)
     
     [PdM] Proposal:
     - Goal: Fix intermittent 403 after login
     - Acceptance: [ ] 10 consecutive logins without 403
     Please confirm.

You: ok
AI:  Investigating...
     [OK] Located: src/middleware/auth.ts:42, race condition during token refresh
     [OK] Fixed src/middleware/auth.ts (added mutex lock)
     [OK] Added test src/middleware/auth.test.ts
     
     Verification: npm test all passed. Please confirm fix.

You: Confirmed
AI:  [OK] Change fix-403-on-login complete.
```

**Key**: Express mode skips Design — Plan → Execute → Verify directly.

---

## Refactor — "This code needs refactoring"

```
You: The utils in src/utils/ are a mess, need refactoring
AI:  [PdM] Creating change refactor-utils, mode: Standard
     
     Plan:
     - Goal: Reorganize utils directory by function
     - Acceptance: [ ] No breaking changes [ ] All imports updated [ ] Tests pass
     Please confirm.

You: Confirmed
AI:  Design:
     Approach:
     - Split into utils/string.ts, utils/date.ts, utils/validation.ts
     - Use barrel export (index.ts)
     
     Tasks:
     - [1/4] Create new file structure
     - [2/4] Migrate functions
     - [3/4] Update all imports
     - [4/4] Run tests to confirm

     Executing...
```

**Key**: Refactoring uses Standard full workflow (includes Design) to ensure a sound approach.

---

## Prototype — "Build a quick prototype first"

> Prototype mode: Plan → Design → Execute (skips Verify + Iterate). Keeps Design for a structured approach, skips validation for speed.

```
You: Try replacing polling with WebSocket, build a prototype
AI:  [PdM] Creating change poc-websocket, mode: Prototype (skip Verify + Iterate)
     
     Plan:
     - Goal: Validate WebSocket real-time push feasibility
     - Requirement: Replace /api/notifications polling with WS push
     Please confirm.

You: Confirmed
AI:  Design:
     - Use socket.io, server/client implementation
     - Keep original polling as fallback
     
     Execute:
     [OK] Created src/ws/server.ts
     [OK] Created src/ws/client.ts
     [OK] Modified src/components/NotificationBell.tsx
     
     Prototype complete. WebSocket latency dropped from 5s to <100ms.
     Want to make it official?

You: Looks great, let's do it properly
AI:  [OK] Upgrading to Standard mode. Adding test strategy, entering Verify...
```

**Key**: Prototype skips Verify/Iterate for fast validation. Say "let's do it properly" to upgrade to Standard.

---

## Learn Codebase — "Help me understand this code"

```
You: Help me understand the design of src/core/pipeline.ts
AI:  [Review] Analyzing src/core/pipeline.ts:
     
     This is a middleware pipeline pattern implementation:
     - Pipeline class manages a series of Middleware functions
     - Each middleware receives context + next()
     - Supports sync and async middleware
     - Error handling via separate errorMiddleware chain
     
     Call graph:
     - Used by src/server.ts (HTTP request handling)
     - Used by src/ws/handler.ts (WebSocket message handling)
     
     Design highlight: Generic Pipeline<T> lets the same pipeline adapt to different context types.

You: How does the errorMiddleware chain work?
AI:  [Continues with deeper explanation...]
```

**Key**: Explore mode is for pure exploration — no changes created, no files modified.

---

## FAQ

### AI encounters a decision it can't make

AI records it in `blockers.md` and asks you directly:

```
AI:  [!] Need your decision:
     [OPEN] #3 Database choice
     Related: add-user-auth
     Question: PostgreSQL or SQLite for user data?
     
     Suggestion: Single-dev project, SQLite is sufficient. Can migrate later.

You: SQLite
AI:  [OK] Decision recorded, continuing...
```

### Multiple fix attempts failing

- Express mode fails after 3 rounds → AI auto-upgrades to Standard (adds Design phase to rethink)
- Standard mode fails after 5 iterations → AI creates a blocker and asks you

### Switched chat windows

Continue in the new window. AI restores state from `resume.md`:

```
You: (new session) Continue where I left off
AI:  [Review] Restoring from resume.md:
     - Change add-user-auth: Execute phase, progress 3/5
     - Pending: [OPEN] #3 Database choice
     
     Continuing task 4/5...
```

### Want to cancel

Just say "cancel" or "drop it" in natural language:

```
You: Drop the poc-websocket change
AI:  [!] Confirm abandoning change poc-websocket? This will delete proposal.md and design.md.
You: Confirmed
AI:  [OK] Cancelled. Files cleaned up, resume.md updated.
```
