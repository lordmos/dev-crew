# 使用场景

| 场景 | 你说 | DevCrew 做 |
|------|------|------------|
| 从零开始 | "有个想法，从零构建" | 初始化 → 引导需求 → Standard |
| 已有 PRD | "需求文档在这，执行吧" | 导入 PRD → 提炼 → Standard |
| 中途接入 | "代码已有，帮我续上" | 扫描代码 → 建基线 → Standard |
| 头脑风暴 | "讨论一下方案" | 探索模式（不改代码） |
| Bug 修复 | "有个 bug，快修" | Express 模式 |
| 代码重构 | "这段代码要重构" | Standard 完整流程 |
| 快速原型 | "先做个原型验证" | Prototype 模式 |
| 学习代码库 | "帮我理解这段代码" | 探索模式（分析代码） |

---

## 从零开始 — "我有个想法，从零构建"

```
你: 帮我初始化 DevCrew 工作区
AI: [OK] 已创建 dev-crew/ 工作区。你想做什么项目？

你: 做一个 Todo 应用，支持增删改查和标签分类
AI: [PdM] 好的，我来梳理需求。以下是我的理解：
    [展示 proposal.md 草稿，包含目标、需求和验收标准]
    请确认或修改。

你: 确认
AI: [OK] 需求已确认。开始技术方案设计...
    [自动进入 Design → Execute → Verify 流程]
```

**关键**：你只需要描述想法 + 确认需求，AI 自动走完 Plan → Design → Execute → Verify。

> 📌 **推荐指令**：`/crew.init` 初始化工作区 → `/crew.plan` 创建变更 → `/crew.status` 查看进度 → `/crew.checkpoint` 阶段审计

---

## 已有 PRD — "需求文档在这，执行吧"

```
你: 需求文档在 docs/requirements.md，帮我执行
AI: [Doc] 已导入需求文档，分析提炼中...
    [展示从 PRD 提取的 proposal.md]
    请确认这是否准确反映需求。

你: "用户角色"那段描述太模糊，补充一下：需要管理员和普通用户两种角色
AI: [OK] 已更新。开始设计...
```

**关键**：导入已有需求 → AI 提炼成 proposal → 你确认/补充 → 自动推进。

> 📌 **推荐指令**：`/crew.init` 初始化 → `/crew.plan` 导入并创建变更 → `/crew.checkpoint` 检查产出

---

## 中途接入 — "代码已有，帮我续上"

```
你: 代码已有，帮我扫描一下项目
AI: [Scan] 正在扫描项目代码...
    
    项目概况:
    - 语言: TypeScript + React
    - 结构: src/components/ (12), src/api/ (5), src/utils/ (3)
    - 测试: Jest, 覆盖率约 60%
    - 依赖: express, prisma, zod
    
    已创建工作区。你接下来想做什么？

你: 我要给 API 加上认证中间件
AI: [PdM] 好的，创建变更 add-api-auth...
```

**关键**：AI 先扫描代码建立基线，然后你直接描述要做什么。

> 📌 **推荐指令**：`/crew.init` 初始化 → `/crew.status` 查看项目概况 → `/crew.plan` 创建变更

---

## 头脑风暴 — "讨论一下方案"

```
你: 我在考虑状态管理方案，Redux 还是 Zustand？
AI: 基于你的项目分析：
    - 当前项目规模较小（12 个组件）
    - 没有复杂的异步数据流
    - 建议用 Zustand：API 更简单，bundle 更小
    [详细对比分析...]

你: 有道理，那就用 Zustand。帮我做这个改造
AI: 好的。创建变更 migrate-to-zustand，模式: Standard
    [自动转入 plan 流程]
```

**关键**：探索模式只讨论不改代码。讨论出结论后随时转入正式变更。

> 📌 **推荐指令**：`/crew.status` 了解项目现状 → 自然语言讨论 → 决定后 `/crew.plan` 创建变更

---

## Bug 修复 — "有个 bug，快修"

```
你: 用户登录后偶尔报 403，帮我查一下
AI: [Scan] 检测到 bug 修复任务，创建 Express 变更 fix-403-on-login
    模式: Express（跳过 Design，直接修复）
    
    [PdM] Proposal:
    - 目标: 修复登录后偶发 403 错误
    - 验收标准: [ ] 连续 10 次登录无 403
    请确认。

你: ok
AI: 开始排查...
    [OK] 定位问题: src/middleware/auth.ts:42，token 刷新时竞态条件
    [OK] 已修复 src/middleware/auth.ts（添加 mutex 锁）
    [OK] 已添加测试 src/middleware/auth.test.ts
    
    验证结果: npm test 全部通过。请确认修复。

你: 确认
AI: [OK] 变更 fix-403-on-login 完成。
```

**关键**：Express 模式跳过 Design，直接 Plan → Execute → Verify。

> 📌 **推荐指令**：`/crew.plan` 创建 Express 变更 → `/crew.status` 查看修复进度

---

## 代码重构 — "这段代码要重构"

```
你: src/utils/ 里的工具函数太乱了，需要重构
AI: [PdM] 创建变更 refactor-utils，模式: Standard
    
    Plan 阶段:
    - 目标: 重组 utils 目录结构，按功能分模块
    - 验收标准: [ ] 无破坏性变更 [ ] 所有导入路径更新 [ ] 测试通过
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

> 📌 **推荐指令**：`/crew.plan` 创建变更 → `/crew.checkpoint` 阶段审计 → `/crew.release` 归档完成

---

## 快速原型 — "先做个原型验证"

> Prototype 模式流程：Plan → Design → Execute（跳过 Verify + Iterate）。保留 Design 确保方案有章法，跳过验证加速交付。

```
你: 试一下用 WebSocket 替代轮询，做个原型看看效果
AI: [PdM] 创建变更 poc-websocket，模式: Prototype（跳过 Verify + Iterate）
    
    Plan:
    - 目标: 验证 WebSocket 实时推送方案可行性
    - 需求: 替换 /api/notifications 轮询为 WS 推送
    请确认。

你: 确认
AI: Design:
    - 使用 socket.io，server/client 双端实现
    - 保留原有轮询作为 fallback
    
    Execute:
    [OK] 已创建 src/ws/server.ts
    [OK] 已创建 src/ws/client.ts
    [OK] 已修改 src/components/NotificationBell.tsx
    
    原型完成。WebSocket 延迟从 5s 降到 <100ms。
    想正式做吗？

你: 效果不错，正式做吧
AI: [OK] 升级为 Standard 模式。补充测试策略，进入 Verify...
```

**关键**：Prototype 跳过 Verify/Iterate，快速验证想法。说"正式做吧"可升级为 Standard。

> 📌 **推荐指令**：`/crew.plan` 创建 Prototype 变更 → `/crew.status` 查看原型进度

---

## 学习代码库 — "帮我理解这段代码"

```
你: 帮我理解 src/core/pipeline.ts 的设计思路
AI: [Review] 分析 src/core/pipeline.ts:
    
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

**关键**：探索模式用于纯探索，不创建变更不修改文件。

> 📌 **推荐指令**：`/crew.status` 查看项目结构 → `/crew.agents` 查看可用专家角色

---

## 常见问题

### AI 遇到做不了的决策

AI 会在 `blockers.md` 提问，你可以在对话中直接回答：

```
AI: [!] 遇到一个需要你决策的问题:
    [OPEN] #3 数据库选型
    关联: add-user-auth
    问题: 用户数据存储选 PostgreSQL 还是 SQLite？
    
    建议: 目前是单人项目，SQLite 足够。后期可迁移。

你: 用 SQLite
AI: [OK] 已记录决策，继续开发...
```

### 修了好几次还不对

- Express 模式修 3 轮还没通过 → AI 自动升级为 Standard（加上 Design 阶段重新思考）
- Standard 模式迭代 5 轮还没通过 → AI 创建 blocker 问你

### 换了个对话窗口

直接在新窗口继续工作。AI 从 `resume.md` 恢复状态，无缝衔接。

```
你: （新会话）继续之前的工作
AI: [Review] 从 resume.md 恢复状态:
    - 变更 add-user-auth: Execute 阶段，进度 3/5
    - 待解决: [OPEN] #3 数据库选型
    
    继续执行任务 4/5...
```

### 不想做了

用自然语言说"放弃/取消/不做了"即可：

```
你: 不做 poc-websocket 了
AI: [!] 确认放弃变更 poc-websocket？这会删除 proposal.md 和 design.md。
你: 确认
AI: [OK] 已取消。相关文件已清理，resume.md 已更新。
```
