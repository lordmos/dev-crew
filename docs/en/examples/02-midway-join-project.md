# Best Practice 2: Joining an Existing Project Midway

> **Linked Scenarios**: Scenario 3 (Midway Join) → Scenario 8 (Learning the Codebase) → Scenario 4 (Brainstorming) → Scenario 5 (Security Fix) → Scenario 6 (Code Refactoring)
> **Project Story**: Xiaoli takes over an existing Express API project, first understands the code, then discusses improvement plans, and finally performs a refactoring.

---

## Act 1: Joining an Existing Project (Scenario 3)

Xiaoli received a project left by a colleague and needs to continue development.

### Step 1 — Scan and Initialize

```
You: Help me scan the existing code and initialize
```

The AI scanned the entire codebase and established a baseline:

```
AI: 🔍 Scan complete, project overview:

    Language: JavaScript (Node.js)
    Framework: Express.js
    Structure:
    ├── src/routes/     (8 route files)
    ├── src/models/     (5 data models)
    ├── src/middleware/  (3 middleware files)
    └── src/utils/      (2 utility files)
    
    Dependencies: express, mongoose, jsonwebtoken, bcrypt
    Testing: mocha + chai, 45% coverage
    Database: MongoDB
    
    ⚠️ Issues found:
    - No .env.example (environment variable documentation missing)
    - src/utils/helpers.js has 400+ lines (may need splitting)
    - Some routes lack error handling middleware

    ✅ Created dev-crew/ workspace.
```

**dev-crew.yaml**:
```yaml
project:
  name: express-api
  description: "Express.js REST API"
verify:
  test_command: "npm test"
```

---

## Act 2: Learning the Codebase (Scenario 8)

Xiaoli wanted to understand the core logic before making changes.

```
You: Help me understand how the authentication flow is implemented
```

```
AI: 📖 Authentication flow analysis:

    1. Login: POST /api/auth/login
       → src/routes/auth.js:15
       → Password verification (bcrypt.compare)
       → Generate JWT (jsonwebtoken.sign, expires in 24h)
       → Returns { token, user }
    
    2. Auth middleware: src/middleware/auth.js
       → Extracts Bearer token from Authorization header
       → Decodes with jsonwebtoken.verify
       → Attaches user to req.user
       → ⚠️ Only returns 401 on token expiry, no refresh token mechanism
    
    3. Protected routes: src/routes/users.js, src/routes/orders.js
       → Both use auth middleware
       → Some routes also have role-based checks (isAdmin)
    
    Potential improvements:
    - No refresh token, users must re-login every 24h
    - JWT secret hardcoded in src/middleware/auth.js:5 ⚠️ Security risk
    - No rate limiting, vulnerable to brute force attacks
```

Xiaoli asked a few more questions:

```
You: What are the relationships between data models?
AI: 📖 Model relationship diagram:
    User (1) ──→ (n) Order
    Order (1) ──→ (n) OrderItem
    OrderItem (n) ←── (1) Product
    Product (n) ←── (1) Category
    
    All models are defined with Mongoose Schemas. User ↔ Order linked via userId.
    No populate used — queries do manual joins (potential N+1 problem).
```

**Key point**: Natural language conversation (exploration mode) is purely analytical — no changes were created, no files were modified.

---

## Act 3: Brainstorming (Scenario 4)

After understanding the code, Xiaoli wanted to discuss improvement plans.

```
You: I want to refactor src/utils/helpers.js. How do you think it should be split?
```

```
AI: Analysis of src/utils/helpers.js (423 lines):

    Currently contains 5 types of functionality mixed together:
    1. String processing (L12-89): slugify, truncate, capitalize
    2. Date formatting (L91-156): formatDate, relativeTime, parseISO
    3. Data validation (L158-267): isEmail, isPhone, isURL, validateSchema
    4. HTTP helpers (L269-345): buildQuery, parseHeaders, retry
    5. General utilities (L347-423): deepClone, debounce, memoize

    Suggested split options:
    
    Option A (split by type):
    ├── utils/string.js
    ├── utils/date.js
    ├── utils/validation.js
    ├── utils/http.js
    └── utils/common.js
    
    Option B (split by consumer):
    ├── utils/request-helpers.js    ← Used by route layer
    ├── utils/model-helpers.js      ← Used by model layer
    └── utils/common.js             ← General purpose

    Recommended: Option A
    - Clear responsibilities, intuitive for newcomers to navigate
    - Impact scope: imports in 14 files need updating
    - Estimated changes: ~30 import modifications

You: Option A sounds good. Also, let's handle the hardcoded JWT secret issue too
AI: Good idea. These two changes have low correlation, so I recommend splitting them into two independent changes:
    1. refactor-utils — Refactor utility functions (Standard)
    2. fix-jwt-secret — Fix security vulnerability (Express)
    
    Want to create both at the same time?

You: Do the security fix first
```

**Key point**: The conversation naturally transitioned from exploration to creating changes. The AI also suggested a sensible splitting strategy.

---

## Act 4: Security Fix + Code Refactoring (Scenario 5 + 6)

### Change 1: Fix Hardcoded JWT Secret (Express)

```
AI: 📋 Creating change fix-jwt-secret, mode: Express

    Proposal:
    - Goal: Move JWT secret from hardcoded value to environment variable
    - Acceptance criteria:
      - [ ] JWT secret reads from process.env.JWT_SECRET
      - [ ] Add .env.example file
      - [ ] Check required environment variables at startup
    Please confirm.

You: ok
AI: ✅ Fixed src/middleware/auth.js:5 (process.env.JWT_SECRET)
    ✅ Created .env.example
    ✅ Added src/config.js (validates environment variables at startup)
    
    Verification: npm test — 12 passed, 2 failed
    ⚠️ Failing tests don't have JWT_SECRET environment variable set

AI: Fixing test configuration...
    ✅ Updated test/setup.js (added test environment variables)
    Verification: npm test — 14 passed, 0 failed
    Please confirm.

You: Confirmed
AI: ✅ Change fix-jwt-secret completed.
```

### Change 2: Refactor Utility Functions (Standard)

```
You: Now do refactor-utils
AI: 📋 Creating change refactor-utils, mode: Standard

    Plan: [showing proposal.md]
    Please confirm.

You: Confirmed

AI: Design:
    Splitting according to Option A as previously discussed.
    
    Task breakdown:
    - [ ] 1. Create 5 new files, migrate functions
    - [ ] 2. Add barrel export for each new file (utils/index.js)
    - [ ] 3. Update import paths in 14 files (30 locations)
    - [ ] 4. Delete the old helpers.js
    - [ ] 5. Run tests to confirm no breakage

    Execute:
    ✅ [1/5] Created 5 new files (string.js, date.js, validation.js, http.js, common.js)
    ✅ [2/5] Created utils/index.js (barrel export)
    ✅ [3/5] Updated imports in 14 files (30 modifications)
    ✅ [4/5] Deleted src/utils/helpers.js
    ✅ [5/5] Ran tests

    Verify:
    npm test — 14 passed, 0 failed ✅
    Acceptance criteria check:
    ✅ No breaking changes (all tests pass)
    ✅ All import paths updated (grep confirms no remaining references)
    ✅ helpers.js deleted
    Please confirm.

You: Confirmed
AI: ✅ Change refactor-utils completed.
```

---

## Act 5: Session Interruption and Recovery

The next day, Xiaoli continued in a new session:

```
You: (new chat window)
AI: 📖 Restoring from resume.md:
    Project: express-api
    Completed changes: fix-jwt-secret, refactor-utils
    No active changes, no OPEN blockers.
    
    What would you like to do?

You: Help me archive
AI: 📦 Archiving 2 completed changes:
    - fix-jwt-secret (Express)
    - refactor-utils (Standard)
    Moved to dev-crew/archive/
    ✅ Archive complete.
```

---

## Blocker Usage Example

During refactoring, if the AI encounters a decision that needs input:

**blockers.md** content example:

```markdown
## [RESOLVED] #1 Utility Function Split Granularity
**Related**: refactor-utils
**Raised by**: AI
**Question**: validateSchema in validation.js depends on the ajv library (other validation functions are pure functions).
Should it be split into a separate utils/schema-validation.js?

> **User decision**: No need to split. Keep it in validation.js, just add a comment at the top of the file noting the dependency.
> **Status**: [RESOLVED]
```

---

## Key Comparison: How the Three Modes Manifest in the Same Project

| Dimension | fix-jwt-secret (Express) | refactor-utils (Standard) |
|-----------|------------------------|--------------------------|
| Flow | Plan → Execute → Verify | Plan → Design → Execute → Verify |
| Output files | proposal.md only | proposal.md + design.md |
| Has Design? | ❌ Skipped | ✅ Has technical design + task breakdown |
| Has Verify? | ✅ npm test + user confirmation | ✅ npm test + acceptance criteria + user confirmation |
| Best for | Small, well-defined fixes | Systematic changes that need planning |
