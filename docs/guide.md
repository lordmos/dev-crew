# 使用指南

## 如何与 DevCrew 协作

DevCrew 的核心是 **INSTRUCTIONS.md** —— 它将任何 AI 变成一个按流程工作的开发团队。初始化后，有三种方式触发 Skills：

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

### 2. CLI（终端）

在终端中直接执行：

```bash
crew plan add-auth -m standard    # 创建变更计划
crew status                       # 查看进度
crew checkpoint                   # 阶段审计
crew release                      # 归档变更
```

### 3. MCP Server（AI 工具调用）

让 AI 通过 [Model Context Protocol](https://modelcontextprotocol.io/) 直接调用 Skills。

**VS Code (GitHub Copilot) 配置**：在 `.vscode/settings.json` 中添加：

```json
{
  "mcp": {
    "servers": {
      "dev-crew": {
        "command": "crew-mcp"
      }
    }
  }
}
```

**Cursor 配置**：在 `.cursor/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "dev-crew": {
      "command": "crew-mcp"
    }
  }
}
```

配置后，AI 可直接调用 `crew_plan`、`crew_status` 等工具。

> **三种方式可混合使用**：自然语言做日常协作，CLI 做快捷操作，MCP 让 AI 自主调用工具。

---

## 三种工作模式

| 模式 | 流程 | 适用场景 |
|------|------|---------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | 新功能、重构 |
| **Express** | Plan → Execute → Verify | Bug 修复 |
| **Prototype** | Plan → Design → Execute | 快速原型 |

## Skills

| Skill | CLI | MCP Tool | 用途 |
|-------|-----|----------|------|
| **init** | `crew init` | `crew_init` | 初始化工作区 + Agent 记忆文件 |
| **plan** | `crew plan <名称>` | `crew_plan` | 创建变更并开始工作 |
| **status** | `crew status` | `crew_status` | 查看当前进度 |
| **checkpoint** | `crew checkpoint` | `crew_checkpoint` | 阶段审计 + 一致性检查 + 记忆同步 |
| **release** | `crew release` | `crew_release` | 归档变更 + 记忆整合 |
| **agents** | `crew agents` | `crew_agents` | 列出可用领域专家 |

> 自然语言同样有效——"做个检查点"，AI 自动调用 checkpoint skill

## 内建团队

| Agent | 职责 |
|-------|------|
| <i class="fas fa-bullseye"></i> **PjM** 项目经理 | 任务拆解、Agent 调度、进度协调 |
| <i class="fas fa-clipboard-list"></i> **PdM** 产品经理 | 需求梳理、PRD 导入、验收标准 |
| <i class="fas fa-drafting-compass"></i> **Architect** 架构师 | 技术选型、任务分解、依赖分析 |
| <i class="fas fa-code"></i> **Implementer** 开发 | 代码生成、重构、依赖安装 |
| <i class="fas fa-vial"></i> **Tester** 测试 | 测试执行、验收检查、覆盖率 |
| <i class="fas fa-magnifying-glass"></i> **Reviewer** 审查 | 规范检查、安全扫描、最佳实践 |

PjM 按需组建团队，可根据需求创建更多 Agent，无需手动分配。

## Agent 记忆

每个 Agent 在 `dev-crew/memory/` 维护长期记忆文件，跨变更积累项目认知、经验库和工作偏好。变更完成时自动整合，新会话启动时自动加载——团队越用越懂你的项目。
