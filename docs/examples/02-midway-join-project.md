# 最佳实践 2: 中途接入已有项目

> **串联场景**: 场景 3（中途接入）→ 场景 8（学习代码库）→ 场景 4（头脑风暴）→ 场景 5（安全修复）→ 场景 6（代码重构）
> **项目故事**: 小李接手一个已有的 Express API 项目，先了解代码，再讨论改进方案，最后做重构。

---

## 第一幕: 接入已有项目（场景 3）

小李拿到一个同事留下的项目，需要继续开发。

### Step 1 — 扫描初始化

```
小李: /crew:init --scan
```

AI 扫描整个代码库，建立基线：

```
AI: 🔍 扫描完成，项目概况:

    语言: JavaScript (Node.js)
    框架: Express.js
    结构:
    ├── src/routes/     (8 个路由文件)
    ├── src/models/     (5 个数据模型)
    ├── src/middleware/  (3 个中间件)
    └── src/utils/      (2 个工具文件)
    
    依赖: express, mongoose, jsonwebtoken, bcrypt
    测试: mocha + chai, 覆盖率 45%
    数据库: MongoDB
    
    ⚠️ 发现问题:
    - 无 .env.example（环境变量文档缺失）
    - src/utils/helpers.js 有 400+ 行（可能需要拆分）
    - 部分路由缺少错误处理中间件

    ✅ 已创建 devcrew/ 工作区。
```

**devcrew.yaml**:
```yaml
project:
  name: express-api
  description: "Express.js REST API"
verify:
  test_command: "npm test"
```

---

## 第二幕: 学习代码库（场景 8）

小李想先了解核心逻辑再动手。

```
小李: /crew:explore 帮我理解认证流程是怎么实现的
```

```
AI: 📖 认证流程分析:

    1. 登录: POST /api/auth/login
       → src/routes/auth.js:15
       → 校验密码 (bcrypt.compare)
       → 生成 JWT (jsonwebtoken.sign, 过期时间 24h)
       → 返回 { token, user }
    
    2. 鉴权中间件: src/middleware/auth.js
       → 从 Authorization header 提取 Bearer token
       → jsonwebtoken.verify 解码
       → 将 user 挂载到 req.user
       → ⚠️ token 过期只返回 401，没有 refresh token 机制
    
    3. 受保护路由: src/routes/users.js, src/routes/orders.js
       → 都调用 auth middleware
       → 部分路由还有 role-based 检查 (isAdmin)
    
    潜在改进:
    - 没有 refresh token，用户每 24h 需重新登录
    - JWT secret 硬编码在 src/middleware/auth.js:5 ⚠️ 安全隐患
    - 没有 rate limiting，可能被暴力破解
```

小李又问了几个问题：

```
小李: /crew:explore 数据模型之间的关系是什么？
AI: 📖 模型关系图:
    User (1) ──→ (n) Order
    Order (1) ──→ (n) OrderItem
    OrderItem (n) ←── (1) Product
    Product (n) ←── (1) Category
    
    所有模型用 Mongoose Schema 定义，User ↔ Order 通过 userId 关联。
    没有用 populate，查询时手动 join（可能有 N+1 问题）。
```

**关键**：`/crew:explore` 纯分析，没有创建变更，没有修改任何文件。

---

## 第三幕: 头脑风暴（场景 4）

了解代码后，小李想讨论改进方案。

```
小李: /crew:explore 我想重构 src/utils/helpers.js，你觉得应该怎么拆？
```

```
AI: 分析 src/utils/helpers.js（423 行）:

    当前包含 5 类功能混在一起:
    1. 字符串处理 (L12-89): slugify, truncate, capitalize
    2. 日期格式化 (L91-156): formatDate, relativeTime, parseISO
    3. 数据验证 (L158-267): isEmail, isPhone, isURL, validateSchema
    4. HTTP 辅助 (L269-345): buildQuery, parseHeaders, retry
    5. 通用工具 (L347-423): deepClone, debounce, memoize

    建议拆分方案:
    
    方案 A（按类型拆）:
    ├── utils/string.js
    ├── utils/date.js
    ├── utils/validation.js
    ├── utils/http.js
    └── utils/common.js
    
    方案 B（按使用者拆）:
    ├── utils/request-helpers.js    ← 路由层用
    ├── utils/model-helpers.js      ← 模型层用
    └── utils/common.js             ← 通用

    推荐方案 A:
    - 职责清晰，新人也能直觉找到
    - 影响范围: 14 个文件的 import 需要更新
    - 估计改动: ~30 处 import 修改

小李: 方案 A 好。另外，那个 JWT secret 硬编码的问题也一起处理吧
AI: 好的建议。这两个改动关联性不大，建议拆成两个独立变更:
    1. refactor-utils — 重构工具函数（Standard）
    2. fix-jwt-secret — 修复安全隐患（Express）
    
    要同时创建吗？

小李: 先做安全修复
```

**关键**：从 explore 自然过渡到创建变更，AI 还建议了合理的拆分策略。

---

## 第四幕: 安全修复 + 代码重构（场景 5 + 6）

### 变更 1: 修复 JWT 硬编码（Express）

```
AI: 📋 创建变更 fix-jwt-secret，模式: Express

    Proposal:
    - 目标: 将 JWT secret 从硬编码改为环境变量
    - 验收标准:
      - [ ] JWT secret 从 process.env.JWT_SECRET 读取
      - [ ] 添加 .env.example 文件
      - [ ] 启动时检查必需环境变量
    请确认。

小李: ok
AI: ✅ 已修复 src/middleware/auth.js:5（process.env.JWT_SECRET）
    ✅ 已创建 .env.example
    ✅ 已添加 src/config.js（启动时校验环境变量）
    
    验证: npm test — 12 passed, 2 failed
    ⚠️ 失败的测试没有设置 JWT_SECRET 环境变量

AI: 修复测试配置...
    ✅ 已更新 test/setup.js（添加测试环境变量）
    验证: npm test — 14 passed, 0 failed
    请确认。

小李: 确认
AI: ✅ 变更 fix-jwt-secret 完成。
```

### 变更 2: 重构工具函数（Standard）

```
小李: 现在做 refactor-utils
AI: 📋 创建变更 refactor-utils，模式: Standard

    Plan: [展示 proposal.md]
    请确认。

小李: 确认

AI: Design:
    按之前讨论的方案 A 拆分。
    
    任务分解:
    - [ ] 1. 创建 5 个新文件，迁移函数
    - [ ] 2. 为每个新文件添加 barrel export (utils/index.js)
    - [ ] 3. 更新 14 个文件的 import 路径（30 处）
    - [ ] 4. 删除旧的 helpers.js
    - [ ] 5. 运行测试确认无破坏

    Execute:
    ✅ [1/5] 创建 5 个新文件（string.js, date.js, validation.js, http.js, common.js）
    ✅ [2/5] 创建 utils/index.js (barrel export)
    ✅ [3/5] 更新 14 个文件的 import（30 处修改）
    ✅ [4/5] 删除 src/utils/helpers.js
    ✅ [5/5] 运行测试

    Verify:
    npm test — 14 passed, 0 failed ✅
    验收标准检查:
    ✅ 无破坏性变更（测试全通过）
    ✅ 所有 import 路径已更新（grep 确认无残留引用）
    ✅ helpers.js 已删除
    请确认。

小李: 确认
AI: ✅ 变更 refactor-utils 完成。
```

---

## 第五幕: 会话中断与恢复

第二天，小李在新会话中继续：

```
小李: (新对话窗口)
AI: 📖 从 resume.md 恢复:
    项目: express-api
    已完成变更: fix-jwt-secret, refactor-utils
    无活跃变更，无 OPEN blocker。
    
    需要做什么？

小李: /crew:release
AI: 📦 归档 2 个已完成变更:
    - fix-jwt-secret (Express)
    - refactor-utils (Standard)
    已移至 devcrew/archive/
    ✅ 归档完成。
```

---

## Blocker 使用示例

在重构过程中，如果 AI 遇到需要决策的问题：

**blockers.md** 内容示例：

```markdown
## [RESOLVED] #1 工具函数拆分粒度
**关联**: refactor-utils
**提问者**: AI
**问题**: validation.js 中的 validateSchema 依赖了 ajv 库（其他验证函数是纯函数），
是否要单独拆一个 utils/schema-validation.js？

> **用户决策**: 不用拆，放在 validation.js 里就行，在文件头部注释说明依赖。
> **状态**: [RESOLVED]
```

---

## 关键对比: 三种模式在同一项目中的体现

| 维度 | fix-jwt-secret (Express) | refactor-utils (Standard) |
|------|------------------------|--------------------------|
| 流程 | Plan → Execute → Verify | Plan → Design → Execute → Verify |
| 产出文件 | 仅 proposal.md | proposal.md + design.md |
| 有 Design？ | ❌ 跳过 | ✅ 有技术方案 + 任务分解 |
| 有 Verify？ | ✅ npm test + 用户确认 | ✅ npm test + 验收标准 + 用户确认 |
| 适合什么 | 目标明确的小修复 | 需要规划的系统性变更 |
