---
name: crew:init
user-invocable: true
description: Initialize a DevCrew workspace — creates INSTRUCTIONS.md, project config, agent memory files, and document templates for AI team orchestration.
metadata:
  author: lordmos
  version: 0.5.0
---

# crew init — 初始化 DevCrew 工作区

在当前项目中创建 DevCrew 多 Agent 协作所需的完整工作区结构。

## 何时使用

- 从零开始一个新项目，需要 AI 团队协作
- 为已有项目引入 DevCrew 协议
- 用户说"初始化"、"设置 DevCrew"、"set up dev-crew"

## 使用方法

### CLI（推荐）

```bash
npx @lordmos/dev-crew init [options]
```

**参数：**

| 选项 | 说明 | 示例 |
|------|------|------|
| `--platform, -p` | 目标 AI 平台，自动写入平台指令文件 | `--platform copilot` |
| `--name` | 项目名称（默认从 package.json 或目录名推断） | `--name my-app` |
| `--no-gitignore` | 不修改 .gitignore | |

**平台选项：**

```bash
crew init -p copilot    # → .github/copilot-instructions.md
crew init -p cursor     # → .cursorrules
crew init -p claude     # → CLAUDE.md
crew init -p copilot cursor  # 多平台
```

### MCP Tool

```
crew_init(cwd: string, name?: string, platform?: string[], gitignore?: boolean)
```

## 创建的文件结构

```
your-project/
├── INSTRUCTIONS.md         ← AI 行为指令（核心协议文件）
├── dev-crew.yaml           ← 项目配置
└── dev-crew/
    ├── resume.md           ← PjM 编排状态
    ├── blockers.md         ← 问题与决策跟踪
    ├── specs/              ← 共享规约
    ├── memory/             ← Agent 长期记忆
    │   ├── pdm.md
    │   ├── architect.md
    │   ├── implementer.md
    │   ├── tester.md
    │   └── reviewer.md
    └── templates/          ← 文档格式模板
        ├── proposal.md
        ├── design.md
        ├── impl-log.md
        ├── test-report.md
        └── review-report.md
```

## 幂等性

重复执行不会覆盖已有文件，只补全缺失部分。
