# 使用指南

## 三种工作模式

| 模式 | 流程 | 适用场景 |
|------|------|---------|
| **Standard** | Plan → Design → Execute → Verify → Iterate | 新功能、重构 |
| **Express** | Plan → Execute → Verify | Bug 修复 |
| **Prototype** | Plan → Design → Execute | 快速原型 |

## Skill 指令

| 指令 | 用途 |
|------|------|
| `/crew:init` | 初始化工作区 |
| `/crew:plan <名称>` | 创建变更并开始工作 |
| `/crew:status` | 查看当前进度 |
| `/crew:explore` | 讨论 / 分析（不改代码） |
| `/crew:release` | 归档已完成变更 |

> 自然语言同样有效——"帮我看看进度" = `/crew:status`

## 内建团队

| 角色 | 职责 |
|------|------|
| 🎯 **PjM** 项目经理 | 调度编排、模式推断、阶段推进 |
| 📋 **PdM** 产品经理 | 需求梳理、PRD 导入、验收标准 |
| 🏗️ **Architect** 架构师 | 技术选型、任务分解、依赖分析 |
| 💻 **Implementer** 开发 | 代码生成、重构、依赖安装 |
| 🧪 **Tester** 测试 | 测试执行、验收检查、覆盖率 |
| 👀 **Reviewer** 审查 | 规范检查、安全扫描、最佳实践 |

角色切换完全自动，无需手动分配。
