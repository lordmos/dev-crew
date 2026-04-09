# DevCrew 用户手册

> 面向开发者的使用指南。所有 AI 平台通用（GitHub Copilot、Claude、Cursor 等）。

---

## 快速开始

**30 秒上手**：

1. 把 `INSTRUCTIONS.md` 放入你的项目根目录（或配置到 AI 工具中）
2. 打开 AI 对话，说"我要做一个新功能"或执行 `/crew:init`
3. AI 自动组建团队、创建工作区、引导你梳理需求，然后开始开发

就这样。一个文件，一个完整的软件开发团队。不需要配置角色，不需要学习复杂概念。

---

## 你只需要知道 3 个概念

| 概念 | 一句话解释 |
|------|-----------|
| **变更** | 一个具体的开发任务（如"添加用户认证"、"修复空指针 bug"） |
| **模式** | 任务有多复杂？Standard（完整流程）、Express（快速修 bug）、Prototype（试验想法） |
| **Blocker** | AI 搞不定的问题，需要你做决策（如"用哪个数据库？"） |

> DevCrew 内建了一个完整的软件开发团队（项目经理、产品经理、架构师、开发、测试、审查），自动分工协作。你不需要手动分配角色或调用 skill——团队在幕后自动编排。你只管说做什么。

---

## 5 个指令

| 指令 | 干什么 | 什么时候用 |
|------|--------|-----------|
| `/crew:init` | 初始化工作区 | 第一次使用 |
| `/crew:plan <名称>` | 创建一个变更并开始工作 | 有新任务 |
| `/crew:status` | 看进度 | 随时 |
| `/crew:explore` | 讨论/分析，不改代码 | 头脑风暴、学代码 |
| `/crew:release` | 归档已完成的变更 | 任务做完 |

> 你也可以用自然语言，AI 同样能理解。"帮我看看进度" = `/crew:status`。

---

## 8 种使用场景

### 场景 1: 从零开始 — "我有个想法，从零构建"

```
你: /crew:init
AI: ✅ 已创建 devcrew/ 工作区。你想做什么项目？

你: 做一个 Todo 应用，支持增删改查和标签分类
AI: 📋 好的，我来梳理需求。以下是我的理解：
    [展示 proposal.md 草稿，包含目标、需求和验收标准]
    请确认或修改。

你: 确认
AI: ✅ 需求已确认。开始技术方案设计...
    [自动进入 Design → Execute → Verify 流程]
```

**关键**：你只需要描述想法 + 确认需求，AI 自动走完 Plan → Design → Execute → Verify。

---

### 场景 2: 已有 PRD — "需求文档在这，执行吧"

```
你: /crew:init --prd docs/requirements.md
AI: 📄 已导入需求文档，分析提炼中...
    [展示从 PRD 提取的 proposal.md]
    请确认这是否准确反映需求。

你: "用户角色"那段描述太模糊，补充一下：需要管理员和普通用户两种角色
AI: ✅ 已更新。开始设计...
```

**关键**：导入已有需求 → AI 提炼成 proposal → 你确认/补充 → 自动推进。

---

### 场景 3: 中途接入 — "代码已有，帮我续上"

```
你: /crew:init --scan
AI: 🔍 正在扫描项目代码...
    
    项目概况:
    - 语言: TypeScript + React
    - 结构: src/components/ (12), src/api/ (5), src/utils/ (3)
    - 测试: Jest, 覆盖率约 60%
    - 依赖: express, prisma, zod
    
    已创建工作区。你接下来想做什么？

你: 我要给 API 加上认证中间件
AI: 📋 好的，创建变更 add-api-auth...
```

**关键**：AI 先扫描代码建立基线，然后你直接描述要做什么。

---

### 场景 4: 头脑风暴 — "讨论一下方案"

```
你: /crew:explore 我在考虑状态管理方案，Redux 还是 Zustand？
AI: 基于你的项目分析：
    - 当前项目规模较小（12 个组件）
    - 没有复杂的异步数据流
    - 建议用 Zustand：API 更简单，bundle 更小
    [详细对比分析...]

你: 有道理，那就用 Zustand。帮我做这个改造
AI: 好的。创建变更 migrate-to-zustand，模式: Standard
    [自动转入 /crew:plan 流程]
```

**关键**：`/crew:explore` 只讨论不改代码。讨论出结论后随时转入正式变更。

---

### 场景 5: Bug 修复 — "有个 bug，快修"

```
你: 用户登录后偶尔报 403，帮我查一下
AI: 🔍 检测到 bug 修复任务，创建 Express 变更 fix-403-on-login
    模式: Express（跳过 Design，直接修复）
    
    📋 Proposal:
    - 目标: 修复登录后偶发 403 错误
    - 验收标准: ☐ 连续 10 次登录无 403
    请确认。

你: ok
AI: 开始排查...
    ✅ 定位问题: src/middleware/auth.ts:42，token 刷新时竞态条件
    ✅ 已修复 src/middleware/auth.ts（添加 mutex 锁）
    ✅ 已添加测试 src/middleware/auth.test.ts
    
    验证结果: npm test 全部通过。请确认修复。

你: 确认
AI: ✅ 变更 fix-403-on-login 完成。
```

**关键**：Express 模式跳过 Design，直接 Plan → Execute → Verify。

---

### 场景 6: 代码重构 — "这段代码要重构"

```
你: src/utils/ 里的工具函数太乱了，需要重构
AI: 📋 创建变更 refactor-utils，模式: Standard
    
    Plan 阶段:
    - 目标: 重组 utils 目录结构，按功能分模块
    - 验收标准: ☐ 无破坏性变更 ☐ 所有导入路径更新 ☐ 测试通过
    请确认。

你: 确认
AI: Design 阶段:
    技术方案:
    - 拆分为 utils/string.ts, utils/date.ts, utils/validation.ts
    - 使用 barrel export (index.ts)
    
    任务分解:
    - [1/4] 创建新文件结构
    - [2/4] 迁移函数
    - [3/4] 更新所有 import
    - [4/4] 运行测试确认

    开始执行...
```

**关键**：重构走 Standard 完整流程（有 Design），确保方案合理。

---

### 场景 7: 快速原型 — "先做个原型验证"

> Prototype 模式流程：Plan → Design → Execute（跳过 Verify + Iterate）。保留 Design 确保方案有章法，跳过验证加速交付。

```
你: 试一下用 WebSocket 替代轮询，做个原型看看效果
AI: 📋 创建变更 poc-websocket，模式: Prototype（跳过 Verify + Iterate）
    
    Plan:
    - 目标: 验证 WebSocket 实时推送方案可行性
    - 需求: 替换 /api/notifications 轮询为 WS 推送
    请确认。

你: 确认
AI: Design:
    - 使用 socket.io，server/client 双端实现
    - 保留原有轮询作为 fallback
    
    Execute:
    ✅ 已创建 src/ws/server.ts
    ✅ 已创建 src/ws/client.ts
    ✅ 已修改 src/components/NotificationBell.tsx
    
    原型完成。WebSocket 延迟从 5s 降到 <100ms。
    想正式做吗？

你: 效果不错，正式做吧
AI: ✅ 升级为 Standard 模式。补充测试策略，进入 Verify...
```

**关键**：Prototype 跳过 Verify/Iterate，快速验证想法。说"正式做吧"可升级为 Standard。

---

### 场景 8: 学习代码库 — "帮我理解这段代码"

```
你: /crew:explore 帮我理解 src/core/pipeline.ts 的设计思路
AI: 📖 分析 src/core/pipeline.ts:
    
    这是一个中间件管道模式的实现：
    - Pipeline 类管理一系列 Middleware 函数
    - 每个 middleware 接收 context + next()
    - 支持同步和异步中间件
    - 错误处理通过 errorMiddleware 链单独管理
    
    调用关系:
    - 被 src/server.ts 使用（HTTP 请求处理）
    - 被 src/ws/handler.ts 使用（WebSocket 消息处理）
    
    设计亮点: 用泛型 Pipeline<T> 让同一套管道适配不同 context 类型。

你: 这个 errorMiddleware 链是怎么工作的？
AI: [继续深入解释...]
```

**关键**：`/crew:explore` 用于纯探索，不创建变更不修改文件。

---

## 工作流程中你需要做什么

整个工作过程中，AI 只在两个地方需要你参与：

| 时机 | 你做什么 | 为什么 |
|------|---------|--------|
| **Plan 确认** | 看 AI 整理的需求，说"确认"或提修改 | 确保需求理解正确 |
| **Verify 确认** | 看验证结果，说"确认"或指出问题 | 确保质量达标 |

> Prototype 模式没有 Verify，所以只需确认一次需求。

其余时间 AI 自动推进，你可以去做别的事。

---

## 遇到问题怎么办

### AI 遇到做不了的决策

AI 会在 `blockers.md` 提问，你可以在对话中直接回答：

```
AI: ⚠️ 遇到一个需要你决策的问题:
    [OPEN] #3 数据库选型
    关联: add-user-auth
    问题: 用户数据存储选 PostgreSQL 还是 SQLite？
    
    建议: 目前是单人项目，SQLite 足够。后期可迁移。

你: 用 SQLite
AI: ✅ 已记录决策，继续开发...
```

### 修了好几次还不对

- Express 模式修 3 轮还没通过 → AI 自动升级为 Standard（加上 Design 阶段重新思考）
- Standard 模式迭代 5 轮还没通过 → AI 创建 blocker 问你

### 换了个对话窗口

直接在新窗口继续工作。AI 从 `resume.md` 恢复状态，无缝衔接。

```
你: （新会话）继续之前的工作
AI: 📖 从 resume.md 恢复状态:
    - 变更 add-user-auth: Execute 阶段，进度 3/5
    - 待解决: [OPEN] #3 数据库选型
    
    继续执行任务 4/5...
```

### 不想做了

什么时候取消变更：
- 原型试验后觉得方案不行
- 需求变了，当前方向不对
- 同时开了太多变更，想聚焦

```
你: 不做 poc-websocket 了
AI: ⚠️ 确认放弃变更 poc-websocket？这会删除 proposal.md 和 design.md。
你: 确认
AI: ✅ 已取消。相关文件已清理，resume.md 已更新。
```

> 用自然语言说"放弃/取消/不做了"即可，不需要专用命令。

---

## 文件结构一览

AI 会在你的项目中创建以下文件（都在 `devcrew/` 目录下，默认 .gitignore 排除）：

```
project-root/
├── devcrew.yaml                    ← 项目配置（会入库）
└── devcrew/                        ← AI 工作区（不入库）
    ├── resume.md                     ← 项目状态快照
    ├── blockers.md                   ← 问题和决策记录
    ├── changes/
    │   └── {变更名}/
    │       ├── proposal.md           ← 需求（Plan 阶段产出）
    │       └── design.md             ← 技术方案（Design 阶段产出）
    └── archive/                      ← 已归档的变更
```

你通常不需要直接编辑这些文件，但可以随时查看。

---

## 配置（可选）

项目根目录的 `devcrew.yaml`：

```yaml
project:
  name: my-project

verify:
  test_command: "npm test"        # 配了就用测试命令验证，没配就 AI 审查
```

> 大多数配置项保持默认即可。唯一建议配置的是 `verify.test_command`。

### 领域专家（可选）

如果项目涉及特定领域，可以激活预置的领域专家——AI 会在 PDEVI 的对应阶段自动调度专家提供领域知识：

```yaml
# devcrew.yaml
specialists:
  - game-designer        # 游戏设计师：GDD、游戏循环、经济平衡
  - security-engineer    # 安全工程师：威胁建模、OWASP、安全审查
  - ui-designer          # UI 设计师：设计系统、组件库、无障碍
  - devops-engineer      # DevOps 工程师：CI/CD、容器化、监控
```

- 不配置 = 核心团队独立工作（零影响）
- 配了 = 专家在相关阶段自动参与（你不需要手动调度）
- 专家产出合并到 proposal.md / design.md，不创建额外文件

> 详细的专家目录和推荐搭配见 [`agents/README.md`](../agents/README.md)。
