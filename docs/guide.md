# 使用指南

## 三种工作模式

| 模式 | 流程 | 适用场景 |
|------|------|---------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | 新功能、重构 |
| **Express** | Plan → Execute → Verify | Bug 修复 |
| **Prototype** | Plan → Design → Execute | 快速原型 |

## Skills

| Skill | CLI | MCP Tool | 用途 |
|-------|-----|----------|------|
| **init** | `crew init` | `crew_init` | 初始化工作区 |
| **plan** | `crew plan <名称>` | `crew_plan` | 创建变更并开始工作 |
| **status** | `crew status` | `crew_status` | 查看当前进度 |
| **release** | `crew release` | `crew_release` | 归档已完成变更 |
| **agents** | `crew agents` | `crew_agents` | 列出可用领域专家 |

> 自然语言同样有效——"帮我看看进度"，AI 自动调用 status skill

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
