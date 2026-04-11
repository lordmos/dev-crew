# 使用指南

## 如何与 DevCrew 协作

DevCrew 的核心是 **INSTRUCTIONS.md** —— 它将任何 AI 变成一个按流程工作的开发团队。安装后，有两种方式触发 Skills：

### 1. 自然语言（推荐）

直接在 AI 对话中用自然语言描述需求，AI 自动按 PDEVI 流程执行：

```
你: 我要给 API 加认证中间件
AI: [PdM] 创建变更 add-api-auth，模式: Standard …
```

常用自然语言指令：

| 你说的话 | AI 触发的 Skill |
|---------|----------------|
| "帮我做个计划" / "我要加个功能" | plan |
| "现在进度怎么样" / "看看状态" | status |
| "做个检查点" / "审计一下" | checkpoint |
| "归档吧" / "这个做完了" | release |

### 2. Skill 命令

在 AI 对话中直接使用 Skill 命令：

```
/crew-plan      # 创建变更计划
/crew-status    # 查看进度
/crew-checkpoint  # 阶段审计
/crew-release   # 归档变更
```

> **两种方式可混合使用**：自然语言做日常协作，Skill 命令做快捷操作。

---

## Skills 一览

安装后即可在 AI 对话中使用：

| Skill | 调用方式 | 用途 |
|-------|---------|------|
| **init** | `/crew-init` | 初始化工作区 + Agent 记忆文件 |
| **plan** | `/crew-plan` | 创建变更并开始工作 |
| **status** | `/crew-status` | 查看当前进度 |
| **checkpoint** | `/crew-checkpoint` | 阶段审计 + 一致性检查 + 记忆同步 |
| **release** | `/crew-release` | 归档变更 + 记忆整合 |
| **agents** | `/crew-agents` | 列出可用领域专家 |

> 自然语言同样有效——"做个检查点"，AI 自动调用 checkpoint skill

---

## 三种工作模式

| 模式 | 流程 | 适用场景 |
|------|------|---------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | 新功能、重构 |
| **Express** | Plan → Execute → Verify | Bug 修复 |
| **Prototype** | Plan → Design → Execute | 快速原型 |

---

## 你需要做什么

整个工作过程中，AI 只在两个地方需要你参与：

| 时机 | 你做什么 | 为什么 |
|------|---------|--------|
| **Plan 确认** | 看 AI 整理的需求，说"确认"或提修改 | 确保需求理解正确 |
| **Verify 确认** | 看验证结果，说"确认"或指出问题 | 确保质量达标 |

> Prototype 模式没有 Verify，所以只需确认一次需求。其余时间 AI 自动推进，你可以去做别的事。

---

## 内建团队

PjM 根据用户需求按需创建 Agent，常见角色：

| Agent | 职责 |
|-------|------|
| <i class="fas fa-bullseye"></i> **PjM** 项目经理 | 任务拆解、Agent 调度、进度协调 |
| <i class="fas fa-clipboard-list"></i> **PdM** 产品经理 | 需求梳理、PRD 导入、验收标准 |
| <i class="fas fa-drafting-compass"></i> **Architect** 架构师 | 技术选型、任务分解、依赖分析 |
| <i class="fas fa-code"></i> **Implementer** 开发 | 代码生成、重构、依赖安装 |
| <i class="fas fa-vial"></i> **Tester** 测试 | 测试执行、验收检查、覆盖率 |
| <i class="fas fa-magnifying-glass"></i> **Reviewer** 审查 | 规范检查、安全扫描、最佳实践 |

> 团队规模不固定，PjM 按需创建更多 Agent（如 DBA、技术文档、运维），无需手动分配。

## Agent 记忆

每个 Agent 在 `dev-crew/memory/` 维护长期记忆文件，跨变更积累项目认知、经验库和工作偏好。变更完成时自动整合，新会话启动时自动加载——团队越用越懂你的项目。

---

## 文件结构

AI 会在你的项目中创建以下文件（都在 `dev-crew/` 目录下，默认 .gitignore 排除）：

```
project-root/
├── dev-crew.yaml                    ← 项目配置（会入库）
└── dev-crew/                        ← AI 工作区（不入库）
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

## 配置

项目根目录的 `dev-crew.yaml`：

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
# dev-crew.yaml
specialists:
  - game-designer
  - security-engineer
```

- 不配置 = 团队独立工作（零影响）
- 配了 = 专家在相关阶段自动参与（你不需要手动调度）

> 完整的专家目录和推荐搭配见 [领域专家](./specialists)。
